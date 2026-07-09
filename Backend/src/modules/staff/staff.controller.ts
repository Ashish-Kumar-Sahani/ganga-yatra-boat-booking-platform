import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import bcrypt from "bcryptjs";

import { Staff } from "./staff.model.js";
import { User } from "../users/user.model.js";
import { getOwnerId } from "../../utils/getOwnerId.js";
import {
  validateEmailFormat,
  validatePasswordStrength,
  validateAndNormalizePhone,
} from "../auth/auth.validation.js";

export const createStaff = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = await getOwnerId(req);

    if (!ownerId) {
      return res.status(403).json({ message: "Owner not linked" });
    }

    const { name, phone, email, role, assignedBoatId, status, password } = req.body;

    if (!name || !phone || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, phone, email, password, and role are required",
      });
    }

    // Email format check
    if (!validateEmailFormat(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }
    const normalizedEmail = email.toLowerCase();

    // Phone validation and normalization
    const phoneCheck = validateAndNormalizePhone(phone);
    if (!phoneCheck.isValid) {
      return res.status(400).json({
        message: "Please enter a valid Indian mobile number",
      });
    }
    const phoneNormalized = phoneCheck.normalized || phone;

    // Password strength check
    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.isValid) {
      return res.status(400).json({
        message: passwordCheck.message,
      });
    }

    // Check if email already exists in User collection
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the User account
    const user = await User.create({
      name,
      email: normalizedEmail,
      phone: phoneNormalized,
      password: hashedPassword,
      role, // MANAGER, DRIVER, CAPTAIN, HELPER
      ownerId,
      assignedBoatId: assignedBoatId || null,
      isActive: status === "ACTIVE",
      emailVerified: true, // Auto verify so staff can log in directly
      emailVerifiedAt: new Date(),
    });

    // Create the Staff profile linked to the User account
    const staff = await Staff.create({
      ownerId,
      userId: user._id,
      name,
      phone: phoneNormalized,
      email: normalizedEmail,
      role,
      assignedBoatId: assignedBoatId || null,
      status: status || "ACTIVE",
    });

    return res.status(201).json({
      message: "Staff created successfully",
      staff,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Staff creation failed",
      error: error.message,
    });
  }
};

export const getOwnerStaff = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = await getOwnerId(req);

    if (!ownerId) {
      return res.status(403).json({ message: "Owner not linked" });
    }

    // Fetch all staff rows
    const staffRows = await Staff.find({ ownerId })
      .populate("assignedBoatId", "boatName boatNumber")
      .sort({ createdAt: -1 });

    const linkedUserIds = staffRows
      .map((s: any) => s.userId?.toString())
      .filter(Boolean);

    // Fetch legacy managers who are not linked to a Staff profile
    const legacyManagers = await User.find({
      ownerId,
      role: "MANAGER",
      _id: { $nin: linkedUserIds },
    })
      .select("_id name email phone role isActive ownerId createdAt")
      .sort({ createdAt: -1 });

    const managerRows = legacyManagers.map((manager: any) => ({
      _id: manager._id,
      name: manager.name,
      email: manager.email,
      phone: manager.phone,
      role: manager.role,
      status: manager.isActive ? "ACTIVE" : "INACTIVE",
      assignedBoatId: null,
      source: "USER",
      createdAt: manager.createdAt,
    }));

    return res.json([...managerRows, ...staffRows]);
  } catch (error: any) {
    console.error("Staff fetch error:", error);

    return res.status(500).json({
      message: "Staff fetch failed",
      error: error.message,
    });
  }
};

export const updateStaff = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = await getOwnerId(req);

    if (!ownerId) {
      return res.status(403).json({ message: "Owner not linked" });
    }

    if (req.body.source === "USER") {
      const manager = await User.findOneAndUpdate(
        {
          _id: req.params.id,
          ownerId,
          role: "MANAGER",
        },
        {
          isActive: req.body.status === "ACTIVE",
        },
        { new: true }
      ).select("_id name email phone role isActive ownerId createdAt");

      if (!manager) {
        return res.status(404).json({ message: "Manager not found" });
      }

      return res.json({
        message: "Manager updated successfully",
        staff: {
          _id: manager._id,
          name: manager.name,
          email: manager.email,
          phone: manager.phone,
          role: manager.role,
          status: manager.isActive ? "ACTIVE" : "INACTIVE",
          assignedBoatId: null,
          source: "USER",
          createdAt: manager.createdAt,
        },
      });
    }

    const staff = await Staff.findOneAndUpdate(
      {
        _id: req.params.id,
        ownerId,
      },
      req.body,
      { new: true, runValidators: true }
    ).populate("assignedBoatId", "boatName boatNumber");

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // Update corresponding user record if userId is linked
    if (staff.userId) {
      const userUpdate: any = {};
      if (req.body.status) {
        userUpdate.isActive = req.body.status === "ACTIVE";
      }
      if (req.body.name) {
        userUpdate.name = req.body.name;
      }
      if (req.body.phone) {
        userUpdate.phone = req.body.phone;
      }
      if (req.body.assignedBoatId !== undefined) {
        userUpdate.assignedBoatId = req.body.assignedBoatId || null;
      }
      if (req.body.role) {
        userUpdate.role = req.body.role;
      }
      await User.findByIdAndUpdate(staff.userId, userUpdate);
    }

    return res.json({
      message: "Staff updated successfully",
      staff,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Staff update failed",
      error: error.message,
    });
  }
};

export const deleteStaff = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = await getOwnerId(req);

    if (!ownerId) {
      return res.status(403).json({ message: "Owner not linked" });
    }

    const staff = await Staff.findOneAndDelete({
      _id: req.params.id,
      ownerId,
    });

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // Delete corresponding user record if userId is linked
    if (staff.userId) {
      await User.findByIdAndDelete(staff.userId);
    }

    return res.json({
      message: "Staff removed successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Staff delete failed",
      error: error.message,
    });
  }
};