import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../users/user.model.js";
import { AuthorityProfile } from "./authorityProfile.model.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";
import mongoose from "mongoose";

// Interface for request with files
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const getAuthorities = async (req: Request, res: Response) => {
  try {
    const {
      search,
      cityId,
      status,
      department,
      designation,
      page = "1",
      limit = "10",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query: any = { role: "CITY_AUTHORITY" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { employeeCode: { $regex: search, $options: "i" } },
      ];
    }

    if (cityId) {
      query.cityId = cityId;
    }

    if (status) {
      query.isActive = status === "ACTIVE";
    }

    if (department) {
      query.department = { $regex: department, $options: "i" };
    }

    if (designation) {
      query.designation = { $regex: designation, $options: "i" };
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;

    const sortObj: any = {};
    sortObj[sortBy as string] = sortOrder === "asc" ? 1 : -1;

    const authorities = await User.find(query)
      .select("-password")
      .populate("cityId", "name state")
      .sort(sortObj)
      .skip(skipNum)
      .limit(limitNum);

    const total = await User.countDocuments(query);

    // Calculate Admin Authorities Stats
    const totalCount = await User.countDocuments({ role: "CITY_AUTHORITY" });
    const activeCount = await User.countDocuments({ role: "CITY_AUTHORITY", isActive: true });
    const inactiveCount = await User.countDocuments({ role: "CITY_AUTHORITY", isActive: false });
    
    // Number of unique cities that have at least one authority assigned
    const assignedCitiesList = await User.distinct("cityId", {
      role: "CITY_AUTHORITY",
      cityId: { $ne: null },
    });
    const assignedCitiesCount = assignedCitiesList.length;

    res.json({
      success: true,
      authorities,
      stats: {
        total: totalCount,
        active: activeCount,
        inactive: inactiveCount,
        assignedCitiesCount,
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch authorities",
      error: error.message,
    });
  }
};

export const getAuthorityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const authority = await User.findOne({ _id: id, role: "CITY_AUTHORITY" })
      .select("-password")
      .populate("cityId", "name state");

    if (!authority) {
      return res.status(404).json({
        success: false,
        message: "Authority not found",
      });
    }

    // Get secondary details from profile if needed
    const profile = await AuthorityProfile.findOne({ userId: id });

    res.json({
      success: true,
      authority: {
        ...authority.toObject(),
        joiningDate: profile?.joiningDate || (authority as any).createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch authority details",
      error: error.message,
    });
  }
};

export const createAuthority = async (req: MulterRequest, res: Response) => {
  const {
    name,
    email,
    phone,
    password,
    cityId,
    department,
    designation,
    employeeCode,
    status,
    permissions,
  } = req.body;

  // 1. Basic field validation
  if (!name || !email || !password || !employeeCode || !cityId) {
    return res.status(400).json({
      success: false,
      message: "Name, email, password, employee code, and city are required fields",
    });
  }

  const emailLower = email.toLowerCase();

  try {
    // 2. Email uniqueness check
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // 3. Phone uniqueness check (only if non-empty phone is provided)
    if (phone && phone.trim() !== "") {
      const existingPhone = await User.findOne({ phone: phone.trim() });
      if (existingPhone) {
        return res.status(409).json({
          success: false,
          message: "User with this phone number already exists",
        });
      }
    }

    // 4. Employee code uniqueness check
    const existingCode = await User.findOne({ employeeCode: employeeCode.trim() });
    if (existingCode) {
      return res.status(409).json({
        success: false,
        message: "Authority with this employee code already exists",
      });
    }
  } catch (dbError: any) {
    console.error("Database lookup error during validation:", dbError);
    return res.status(500).json({
      success: false,
      message: "Database lookup failure",
      error: dbError.message,
    });
  }

  // 5. Cloudinary file upload (if file provided)
  let profileImageUrl = "";
  if (req.file) {
    try {
      const uploadRes = await uploadToCloudinary(req.file.path, "profiles");
      profileImageUrl = uploadRes.secure_url;
    } catch (uploadError: any) {
      console.error("Cloudinary upload failed:", uploadError);
      return res.status(500).json({
        success: false,
        message: "Failed to upload profile image",
        error: uploadError.message,
      });
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const isActive = status !== "INACTIVE";

  // Parse permissions (in multipart forms, it might come as a JSON string, comma-separated list, or array)
  let parsedPermissions: string[] = [];
  if (permissions) {
    if (Array.isArray(permissions)) {
      parsedPermissions = permissions;
    } else {
      try {
        parsedPermissions = JSON.parse(permissions);
      } catch {
        parsedPermissions = typeof permissions === "string" ? permissions.split(",") : [];
      }
    }
  }

  const createSequentially = async () => {
    // Create User
    const newUser = await User.create({
      name,
      email: emailLower,
      phone: phone || "",
      password: hashedPassword,
      role: "CITY_AUTHORITY",
      cityId,
      isActive,
      profileImage: profileImageUrl,
      department: department || "",
      designation: designation || "",
      employeeCode,
      permissions: parsedPermissions,
    });

    try {
      // Create Profile
      await AuthorityProfile.create({
        userId: newUser._id,
        cityId,
        department: department || "",
        designation: designation || "",
        employeeCode,
        status: isActive ? "ACTIVE" : "INACTIVE",
        permissions: parsedPermissions,
      });

      return newUser;
    } catch (profileError) {
      // Rollback the created User to prevent orphans
      console.warn("AuthorityProfile creation failed, rolling back User creation:", profileError);
      await User.findByIdAndDelete(newUser._id);
      throw profileError;
    }
  };

  let session: any = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    // Create User
    const newUser = await User.create(
      [
        {
          name,
          email: emailLower,
          phone: phone || "",
          password: hashedPassword,
          role: "CITY_AUTHORITY",
          cityId,
          isActive,
          profileImage: profileImageUrl,
          department: department || "",
          designation: designation || "",
          employeeCode,
          permissions: parsedPermissions,
        },
      ],
      { session }
    );

    // Create Profile
    await AuthorityProfile.create(
      [
        {
          userId: newUser[0]._id,
          cityId,
          department: department || "",
          designation: designation || "",
          employeeCode,
          status: isActive ? "ACTIVE" : "INACTIVE",
          permissions: parsedPermissions,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Authority created successfully",
      authority: {
        id: newUser[0]._id,
        name: newUser[0].name,
        email: newUser[0].email,
        employeeCode: newUser[0].employeeCode,
      },
    });
  } catch (error: any) {
    if (session) {
      try {
        await session.abortTransaction();
        session.endSession();
      } catch (abortError) {
        console.error("Failed to abort transaction:", abortError);
      }
    }

    // Check if error is due to transactions not supported
    const isTxNotSupported = 
      error.code === 20 || 
      error.message?.includes("Transaction numbers") || 
      error.message?.includes("retryable writes") || 
      error.originalError?.message?.includes("Transaction") ||
      error.originalError?.message?.includes("retryable writes");

    if (isTxNotSupported) {
      console.log("MongoDB does not support transactions/sessions. Falling back to sequential creation with manual rollback.");
      try {
        const newUser = await createSequentially();
        return res.status(201).json({
          success: true,
          message: "Authority created successfully",
          authority: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            employeeCode: newUser.employeeCode,
          },
        });
      } catch (seqError: any) {
        return handleCreationError(seqError, res);
      }
    }

    return handleCreationError(error, res);
  }
};

const handleCreationError = (error: any, res: Response) => {
  console.error("Error inside transaction for createAuthority:", error);

  // Mongoose Validation error handling
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((val: any) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }

  // Duplicate key handling
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Authority already exists.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Failed to create authority",
    error: error.message,
  });
};

export const updateAuthority = async (req: MulterRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      cityId,
      department,
      designation,
      employeeCode,
      status,
      permissions,
    } = req.body;

    const authority = await User.findOne({ _id: id, role: "CITY_AUTHORITY" });
    if (!authority) {
      return res.status(404).json({
        success: false,
        message: "Authority user not found",
      });
    }

    // Email duplicate check
    if (email && email.toLowerCase() !== authority.email.toLowerCase()) {
      const emailDup = await User.findOne({ email: email.toLowerCase() });
      if (emailDup) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use by another user",
        });
      }
    }

    // Phone duplicate check
    if (phone && phone.trim() !== "" && phone.trim() !== authority.phone) {
      const phoneDup = await User.findOne({ phone: phone.trim() });
      if (phoneDup) {
        return res.status(409).json({
          success: false,
          message: "Phone number is already in use by another user",
        });
      }
    }

    // Employee code duplicate check
    if (employeeCode && employeeCode !== authority.employeeCode) {
      const codeDup = await User.findOne({ employeeCode: employeeCode.trim() });
      if (codeDup) {
        return res.status(409).json({
          success: false,
          message: "Employee code is already in use by another user",
        });
      }
    }

    let profileImageUrl = authority.profileImage;
    if (req.file) {
      const uploadRes = await uploadToCloudinary(req.file.path, "profiles");
      profileImageUrl = uploadRes.secure_url;
    }

    const isActive = status !== "INACTIVE";

    let parsedPermissions: string[] = [];
    if (permissions) {
      if (Array.isArray(permissions)) {
        parsedPermissions = permissions;
      } else {
        try {
          parsedPermissions = JSON.parse(permissions);
        } catch {
          parsedPermissions = typeof permissions === "string" ? permissions.split(",") : [];
        }
      }
    } else {
      parsedPermissions = authority.permissions || [];
    }

    const updateSequentially = async () => {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          name: name || authority.name,
          email: email ? email.toLowerCase() : authority.email,
          phone: phone !== undefined ? phone : authority.phone,
          cityId: cityId || authority.cityId,
          isActive: status !== undefined ? isActive : authority.isActive,
          profileImage: profileImageUrl,
          department: department || authority.department,
          designation: designation || authority.designation,
          employeeCode: employeeCode || authority.employeeCode,
          permissions: parsedPermissions,
        },
        { new: true }
      );

      try {
        await AuthorityProfile.findOneAndUpdate(
          { userId: id },
          {
            cityId: cityId || authority.cityId,
            department: department || authority.department,
            designation: designation || authority.designation,
            employeeCode: employeeCode || authority.employeeCode,
            status: status !== undefined ? status : (isActive ? "ACTIVE" : "INACTIVE"),
            permissions: parsedPermissions,
          }
        );
        return updatedUser;
      } catch (profileError) {
        console.warn("AuthorityProfile update failed, reverting User update:", profileError);
        await User.findByIdAndUpdate(id, {
          name: authority.name,
          email: authority.email,
          phone: authority.phone,
          cityId: authority.cityId,
          isActive: authority.isActive,
          profileImage: authority.profileImage,
          department: authority.department,
          designation: authority.designation,
          employeeCode: authority.employeeCode,
          permissions: authority.permissions,
        });
        throw profileError;
      }
    };

    let session: any = null;
    try {
      session = await mongoose.startSession();
      session.startTransaction();

      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          name: name || authority.name,
          email: email ? email.toLowerCase() : authority.email,
          phone: phone !== undefined ? phone : authority.phone,
          cityId: cityId || authority.cityId,
          isActive: status !== undefined ? isActive : authority.isActive,
          profileImage: profileImageUrl,
          department: department || authority.department,
          designation: designation || authority.designation,
          employeeCode: employeeCode || authority.employeeCode,
          permissions: parsedPermissions,
        },
        { new: true, session }
      );

      await AuthorityProfile.findOneAndUpdate(
        { userId: id },
        {
          cityId: cityId || authority.cityId,
          department: department || authority.department,
          designation: designation || authority.designation,
          employeeCode: employeeCode || authority.employeeCode,
          status: status !== undefined ? status : (isActive ? "ACTIVE" : "INACTIVE"),
          permissions: parsedPermissions,
        },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return res.json({
        success: true,
        message: "Authority updated successfully",
        authority: updatedUser,
      });
    } catch (innerError: any) {
      if (session) {
        try {
          await session.abortTransaction();
          session.endSession();
        } catch (abortError) {
          console.error("Failed to abort transaction:", abortError);
        }
      }

      const isTxNotSupported = 
        innerError.code === 20 || 
        innerError.message?.includes("Transaction numbers") || 
        innerError.message?.includes("retryable writes") || 
        innerError.originalError?.message?.includes("Transaction") ||
        innerError.originalError?.message?.includes("retryable writes");

      if (isTxNotSupported) {
        console.log("MongoDB does not support transactions/sessions. Falling back to sequential update with manual rollback.");
        const updatedUser = await updateSequentially();
        return res.json({
          success: true,
          message: "Authority updated successfully",
          authority: updatedUser,
        });
      }

      throw innerError;
    }
  } catch (error: any) {
    console.error("Error in updateAuthority:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update authority",
      error: error.message,
    });
  }
};

export const updateAuthorityStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: "isActive status is required",
      });
    }

    const userCheck = await User.findOne({ _id: id, role: "CITY_AUTHORITY" });
    if (!userCheck) {
      return res.status(404).json({
        success: false,
        message: "Authority not found",
      });
    }

    const status = isActive ? "ACTIVE" : "INACTIVE";

    const updateStatusSequentially = async () => {
      const user = await User.findOneAndUpdate(
        { _id: id, role: "CITY_AUTHORITY" },
        { isActive },
        { new: true }
      );

      try {
        await AuthorityProfile.findOneAndUpdate(
          { userId: id },
          { status }
        );
        return user;
      } catch (profileError) {
        console.warn("AuthorityProfile status update failed, reverting User status:", profileError);
        await User.findOneAndUpdate(
          { _id: id, role: "CITY_AUTHORITY" },
          { isActive: userCheck.isActive }
        );
        throw profileError;
      }
    };

    let session: any = null;
    try {
      session = await mongoose.startSession();
      session.startTransaction();

      const user = await User.findOneAndUpdate(
        { _id: id, role: "CITY_AUTHORITY" },
        { isActive },
        { new: true, session }
      );

      await AuthorityProfile.findOneAndUpdate(
        { userId: id },
        { status },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return res.json({
        success: true,
        message: "Authority status updated successfully",
        user,
      });
    } catch (innerError: any) {
      if (session) {
        try {
          await session.abortTransaction();
          session.endSession();
        } catch (abortError) {
          console.error("Failed to abort transaction:", abortError);
        }
      }

      const isTxNotSupported = 
        innerError.code === 20 || 
        innerError.message?.includes("Transaction numbers") || 
        innerError.message?.includes("retryable writes") || 
        innerError.originalError?.message?.includes("Transaction") ||
        innerError.originalError?.message?.includes("retryable writes");

      if (isTxNotSupported) {
        console.log("MongoDB does not support transactions/sessions. Falling back to sequential status update with manual rollback.");
        const user = await updateStatusSequentially();
        return res.json({
          success: true,
          message: "Authority status updated successfully",
          user,
        });
      }

      throw innerError;
    }
  } catch (error: any) {
    console.error("Error in updateAuthorityStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update authority status",
      error: error.message,
    });
  }
};

export const updateAuthorityPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { _id: id, role: "CITY_AUTHORITY" },
      { password: hashedPassword }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Authority not found",
      });
    }

    res.json({
      success: true,
      message: "Authority password reset successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to reset authority password",
      error: error.message,
    });
  }
};

export const deleteAuthority = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userCheck = await User.findOne({ _id: id, role: "CITY_AUTHORITY" });
    if (!userCheck) {
      return res.status(404).json({
        success: false,
        message: "Authority not found",
      });
    }

    const deleteSequentially = async () => {
      await AuthorityProfile.findOneAndDelete({ userId: id });
      await User.findOneAndDelete({ _id: id, role: "CITY_AUTHORITY" });
    };

    let session: any = null;
    try {
      session = await mongoose.startSession();
      session.startTransaction();

      await User.findOneAndDelete({ _id: id, role: "CITY_AUTHORITY" }, { session });
      await AuthorityProfile.findOneAndDelete({ userId: id }, { session });

      await session.commitTransaction();
      session.endSession();

      return res.json({
        success: true,
        message: "Authority deleted successfully",
      });
    } catch (innerError: any) {
      if (session) {
        try {
          await session.abortTransaction();
          session.endSession();
        } catch (abortError) {
          console.error("Failed to abort transaction:", abortError);
        }
      }

      const isTxNotSupported = 
        innerError.code === 20 || 
        innerError.message?.includes("Transaction numbers") || 
        innerError.message?.includes("retryable writes") || 
        innerError.originalError?.message?.includes("Transaction") ||
        innerError.originalError?.message?.includes("retryable writes");

      if (isTxNotSupported) {
        console.log("MongoDB does not support transactions/sessions. Falling back to sequential deletion.");
        await deleteSequentially();
        return res.json({
          success: true,
          message: "Authority deleted successfully",
        });
      }

      throw innerError;
    }
  } catch (error: any) {
    console.error("Error in deleteAuthority:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete authority",
      error: error.message,
    });
  }
};
