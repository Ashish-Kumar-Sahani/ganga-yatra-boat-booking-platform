import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../modules/users/user.model.js";
import { DEFAULT_ROLE_PERMISSIONS } from "../constants/permissions.js";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string; role: string };
    const user = await User.findById(decoded.id)
      .select("-password")
      .populate("ownerId", "name email phone role")
      .populate("cityId", "name state riverName")
      .populate("assignedBoatId", "boatName boatNumber");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const rolePermissions = DEFAULT_ROLE_PERMISSIONS[user.role] || [];
    const mergedPermissions = Array.from(new Set([...(user.permissions || []), ...rolePermissions]));

    req.user = user;
    Object.defineProperty(req.user, "permissions", {
      value: mergedPermissions,
      writable: true,
      enumerable: true,
      configurable: true
    });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};