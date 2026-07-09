import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../users/user.model.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";
import { sendOtpEmail } from "../../services/email.service.js";
import {
  validateEmailFormat,
  isDisposableEmail,
  validateEmailDomain,
  validatePasswordStrength,
  validateAndNormalizePhone,
} from "./auth.validation.js";
import { DEFAULT_ROLE_PERMISSIONS } from "../../constants/permissions.js";

const generateToken = (id: string, role: string) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
};

const allowedPublicRoles = ["CUSTOMER", "BOAT_OWNER"];

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role = "CUSTOMER", cityId } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "Name, email, phone and password are required",
      });
    }

    if (!allowedPublicRoles.includes(role)) {
      return res.status(403).json({
        message: "This role cannot register publicly",
      });
    }

    // 1. Email format check
    const isEmailFormatValid = validateEmailFormat(email);
    const normalizedEmail = email.toLowerCase();

    // 2. Phone validation and normalization
    const phoneCheck = validateAndNormalizePhone(phone);
    const phoneNormalized = phoneCheck.normalized || phone;

    // Strict domain check check
    const strictCheck = process.env.STRICT_EMAIL_DOMAIN_CHECK === "true";

    // Debug logs (Development only)
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEBUG REGISTER] received email: ${email}`);
      console.log(`[DEBUG REGISTER] normalized email: ${normalizedEmail}`);
      console.log(`[DEBUG REGISTER] email format valid/invalid: ${isEmailFormatValid ? "valid" : "invalid"}`);
      console.log(`[DEBUG REGISTER] strict domain check enabled/disabled: ${strictCheck ? "enabled" : "disabled"}`);
      console.log(`[DEBUG REGISTER] phone normalized: ${phoneNormalized}`);
    }

    if (!isEmailFormatValid) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    // Disposable email check
    if (isDisposableEmail(email)) {
      return res.status(400).json({
        message: "Disposable email addresses are not allowed",
      });
    }

    if (!phoneCheck.isValid) {
      return res.status(400).json({
        message: "Please enter a valid Indian mobile number",
      });
    }

    // 3. Duplicate checks
    // If email already exists (and is verified or has legacy verification), reject duplicate
    const existingEmailUser = await User.findOne({ email: normalizedEmail });
    if (existingEmailUser && existingEmailUser.emailVerified !== false) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // If phone already exists (and is verified or has legacy verification), reject duplicate
    const existingPhoneUser = await User.findOne({ phone: phoneNormalized });
    if (existingPhoneUser && existingPhoneUser.emailVerified !== false) {
      return res.status(400).json({
        message: "Phone number already registered",
      });
    }

    // 4. Domain MX check (Optional)
    if (strictCheck) {
      const domainResult = await validateEmailDomain(email);
      if (domainResult.serviceUnavailable) {
        return res.status(400).json({
          message: "Email verification service unavailable, please try again",
        });
      }
      if (!domainResult.isValid) {
        return res.status(400).json({
          message: "Email domain is invalid or cannot receive mail",
        });
      }
    }

    // 5. Password strength check
    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.isValid) {
      return res.status(400).json({
        message: passwordCheck.message,
      });
    }

    // 6. Existing user check (Backward Compatible for unverified accounts)
    let user;
    if (existingEmailUser) {
      // Reuse/update this record for re-registration (since emailVerified is false)
      existingEmailUser.name = name;
      existingEmailUser.phone = phoneNormalized;
      existingEmailUser.password = await bcrypt.hash(password, 10);
      existingEmailUser.role = role;
      existingEmailUser.cityId = cityId || null;
      existingEmailUser.loginAttempts = 0;
      existingEmailUser.lockUntil = undefined;
      user = existingEmailUser;
    } else {
      // Create new user record (unverified by default)
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({
        name,
        email: normalizedEmail,
        phone: phoneNormalized,
        password: hashedPassword,
        role,
        cityId: cityId || null,
        isActive: true,
        emailVerified: false,
      });
    }

    // 7. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(otp, 10);

    user.otpHash = hashedPassword;
    user.otpExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    user.otpAttempts = 0;

    await user.save();

    // 8. Send OTP Email
    await sendOtpEmail(user.email, otp, "register");

    return res.status(200).json({
      message: "Verification OTP sent to your email. Please verify to complete registration.",
      email: user.email,
      // For development and testing purposes (matching original testing design)
      otp: (!process.env.EMAIL_USER || process.env.NODE_ENV === "development") ? otp : undefined,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Register failed",
      error: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 1. Brute-force Lockout Check
    if (user.lockUntil && user.lockUntil > new Date()) {
      const minutesRemaining = Math.ceil(
        (user.lockUntil.getTime() - Date.now()) / 60000
      );
      return res.status(423).json({
        message: `Account is temporarily locked due to multiple failed attempts. Please try again in ${minutesRemaining} minutes.`,
      });
    }

    // 2. Active Account Check
    if (!user.isActive) {
      return res.status(403).json({
        message: "Account is inactive/blocked",
      });
    }

    // 3. Email Verified Check (Allow legacy users where emailVerified is not false)
    if (user.emailVerified === false) {
      return res.status(403).json({
        message: "Your email address is not verified. Please verify your email first.",
      });
    }

    // 4. Verify Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
        user.loginAttempts = 0; // reset counter after locking
      }
      await user.save();

      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 5. Successful Login - Reset attempts
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    const populatedUser = await User.findById(user._id)
      .populate("ownerId", "name email phone role")
      .populate("cityId", "name state riverName")
      .populate("assignedBoatId", "boatName boatNumber");

    if (!populatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = generateToken(user._id.toString(), user.role);

    const rolePermissions = DEFAULT_ROLE_PERMISSIONS[user.role] || [];
    const mergedPermissions = Array.from(new Set([...(user.permissions || []), ...rolePermissions]));

    return res.json({
      message: "Login successful",
      token,
      refreshToken: "placeholder_refresh_token_rotation",
      user: {
        id: populatedUser._id,
        _id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        phone: populatedUser.phone,
        role: populatedUser.role,
        cityId: populatedUser.cityId,
        ownerId: populatedUser.ownerId,
        assignedBoatId: populatedUser.assignedBoatId,
        profileImage: populatedUser.profileImage,
        isActive: populatedUser.isActive,
        permissions: mergedPermissions,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Account is inactive/blocked",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otpHash = hashedOtp;
    user.otpExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    user.otpAttempts = 0;
    user.resetOtpVerified = false;

    await user.save();

    // Send reset email
    await sendOtpEmail(user.email, otp, "reset");

    return res.json({
      message: "Password reset OTP sent to your email successfully",
      email: user.email,
      // For development and testing purposes (matching original testing design)
      otp: (!process.env.EMAIL_USER || process.env.NODE_ENV === "development") ? otp : undefined,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Forgot password failed",
      error: error.message,
    });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+otpHash");

    if (!user) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    // 1. Max verification attempts check (limit: 5)
    if (user.otpAttempts >= 5) {
      return res.status(400).json({
        message: "Maximum OTP verification attempts exceeded. Please request a new OTP.",
      });
    }

    // 2. Expiry check
    if (!user.otpExpire || user.otpExpire < new Date()) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // 3. Verify OTP code
    const isMatch = await bcrypt.compare(otp, user.otpHash || "");
    if (!isMatch) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;
      await user.save();
      return res.status(400).json({
        message: `Invalid OTP. You have ${5 - user.otpAttempts} attempts remaining.`,
      });
    }

    // 4. Success - Clear OTP fields and handle activation
    const isRegistrationFlow = user.emailVerified === false;

    user.otpHash = undefined;
    user.otpExpire = undefined;
    user.otpAttempts = 0;

    if (isRegistrationFlow) {
      user.emailVerified = true;
      user.emailVerifiedAt = new Date();
      await user.save();

      const populatedUser = await User.findById(user._id)
        .populate("ownerId", "name email phone role")
        .populate("cityId", "name state riverName")
        .populate("assignedBoatId", "boatName boatNumber");

      if (!populatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create login token automatically for registration flow
      const token = generateToken(user._id.toString(), user.role);

      const rolePermissions = DEFAULT_ROLE_PERMISSIONS[user.role] || [];
      const mergedPermissions = Array.from(new Set([...(user.permissions || []), ...rolePermissions]));

      return res.json({
        message: "Email verified successfully! Registration complete.",
        token,
        refreshToken: "placeholder_refresh_token_rotation",
        user: {
          id: populatedUser._id,
          _id: populatedUser._id,
          name: populatedUser.name,
          email: populatedUser.email,
          phone: populatedUser.phone,
          role: populatedUser.role,
          cityId: populatedUser.cityId,
          ownerId: populatedUser.ownerId,
          assignedBoatId: populatedUser.assignedBoatId,
          profileImage: populatedUser.profileImage,
          isActive: populatedUser.isActive,
          permissions: mergedPermissions,
        },
      });
    } else {
      // Forgot Password flow
      user.resetOtpVerified = true;
      await user.save();

      return res.json({
        message: "OTP verified successfully. You can now reset your password.",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: "OTP verification failed",
      error: error.message,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 1. Check if reset has been pre-verified via OTP
    if (!user.resetOtpVerified) {
      return res.status(400).json({
        message: "OTP must be verified before resetting password",
      });
    }

    // 2. Validate password strength
    const strength = validatePasswordStrength(newPassword);
    if (!strength.isValid) {
      return res.status(400).json({
        message: strength.message,
      });
    }

    // 3. Prevent reuse of previous password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: "New password cannot be the same as your previous password",
      });
    }

    // 4. Update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;
    user.resetOtpVerified = false;
    user.passwordChangedAt = new Date();
    await user.save();

    const populatedUser = await User.findById(user._id)
      .populate("ownerId", "name email phone role")
      .populate("cityId", "name state riverName")
      .populate("assignedBoatId", "boatName boatNumber");

    if (!populatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 5. Login Automatically after reset
    const token = generateToken(user._id.toString(), user.role);

    const rolePermissions = DEFAULT_ROLE_PERMISSIONS[user.role] || [];
    const mergedPermissions = Array.from(new Set([...(user.permissions || []), ...rolePermissions]));

    return res.json({
      message: "Password reset successfully",
      token,
      refreshToken: "placeholder_refresh_token_rotation",
      user: {
        id: populatedUser._id,
        _id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        phone: populatedUser.phone,
        role: populatedUser.role,
        cityId: populatedUser.cityId,
        ownerId: populatedUser.ownerId,
        assignedBoatId: populatedUser.assignedBoatId,
        profileImage: populatedUser.profileImage,
        isActive: populatedUser.isActive,
        permissions: mergedPermissions,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Reset password failed",
      error: error.message,
    });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, phone, city, address, email } = req.body;

    if (email && email.toLowerCase() !== req.user.email.toLowerCase()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already taken by another user" });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone, city, address, email: email ? email.toLowerCase() : undefined },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.populate([
      { path: "ownerId", select: "name email phone role" },
      { path: "cityId", select: "name state riverName" },
      { path: "assignedBoatId", select: "boatName boatNumber" }
    ]);

    const rolePermissions = DEFAULT_ROLE_PERMISSIONS[user.role] || [];
    const mergedPermissions = Array.from(new Set([...(user.permissions || []), ...rolePermissions]));

    return res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        cityId: user.cityId,
        ownerId: user.ownerId,
        assignedBoatId: user.assignedBoatId,
        profileImage: user.profileImage,
        isActive: user.isActive,
        permissions: mergedPermissions,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

export const updateProfileImage = async (req: any, res: Response) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const uploaded = await uploadToCloudinary(req.file.path, "profiles");

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: uploaded.secure_url },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.populate([
      { path: "ownerId", select: "name email phone role" },
      { path: "cityId", select: "name state riverName" },
      { path: "assignedBoatId", select: "boatName boatNumber" }
    ]);

    const rolePermissions = DEFAULT_ROLE_PERMISSIONS[user.role] || [];
    const mergedPermissions = Array.from(new Set([...(user.permissions || []), ...rolePermissions]));

    return res.json({
      message: "Profile image updated successfully",
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        cityId: user.cityId,
        ownerId: user.ownerId,
        assignedBoatId: user.assignedBoatId,
        profileImage: user.profileImage,
        isActive: user.isActive,
        permissions: mergedPermissions,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to update profile image",
      error: error.message,
    });
  }
};

export const changePassword = async (req: any, res: Response) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required" });
    }

    // 1. Password strength check
    const strength = validatePasswordStrength(newPassword);
    if (!strength.isValid) {
      return res.status(400).json({ message: strength.message });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Current password match check
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // 3. Prevent reuse
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password must be different from current password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordChangedAt = new Date();
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to change password",
      error: error.message,
    });
  }
};