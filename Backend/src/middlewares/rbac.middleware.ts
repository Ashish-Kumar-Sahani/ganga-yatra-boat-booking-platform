import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware.js";
import { getOwnerId } from "../utils/getOwnerId.js";

/**
 * Middleware to enforce specific permission tokens.
 * SUPER_ADMIN role bypasses all permission checks.
 */
export const allowPermissions = (...permissions: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (req.user.role === "SUPER_ADMIN") {
      return next();
    }

    const userPermissions = req.user.permissions || [];
    const hasAll = permissions.every((p) => userPermissions.includes(p));

    if (!hasAll) {
      return res.status(403).json({
        message: `Access denied: Insufficient permissions. Required: [${permissions.join(", ")}]`,
      });
    }

    next();
  };
};

/**
 * Middleware to restrict DRIVER, CAPTAIN, HELPER to their assigned boat.
 */
export const allowBoatAccess = () => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Admins, Owners, and Managers have full boat scope within their owner context
    if (["SUPER_ADMIN", "BOAT_OWNER", "MANAGER"].includes(req.user.role)) {
      return next();
    }

    const requestedBoatId =
      req.params.boatId ||
      req.params.id ||
      req.body.boatId ||
      req.query.boatId;

    if (!requestedBoatId) {
      return next();
    }

    const userBoatId = req.user.assignedBoatId?._id
      ? req.user.assignedBoatId._id.toString()
      : req.user.assignedBoatId?.toString();

    if (
      userBoatId &&
      userBoatId !== requestedBoatId.toString()
    ) {
      return res.status(403).json({
        message: "Access denied: You are not assigned to this boat",
      });
    }

    next();
  };
};

/**
 * Middleware to restrict staff/manager users to resources owned by their parent owner.
 */
export const allowOwnerAccess = () => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (req.user.role === "SUPER_ADMIN" || req.user.role === "BOAT_OWNER") {
      return next();
    }

    const ownerId = await getOwnerId(req);
    if (!ownerId) {
      return res.status(403).json({
        message: "Access denied: Parent owner relationship not found",
      });
    }

    // Attach ownerId to the request context
    (req as any).ownerId = ownerId;
    next();
  };
};

/**
 * Middleware to restrict users/authorities to their assigned city jurisdiction.
 */
export const allowCityAccess = () => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Admins and owners bypass local city constraints
    if (["SUPER_ADMIN", "BOAT_OWNER"].includes(req.user.role)) {
      return next();
    }

    const requestedCityId =
      req.params.cityId ||
      req.body.cityId ||
      req.query.cityId;

    if (!requestedCityId) {
      return next();
    }

    const userCityId = req.user.cityId?._id
      ? req.user.cityId._id.toString()
      : req.user.cityId?.toString();

    if (
      userCityId &&
      userCityId !== requestedCityId.toString()
    ) {
      return res.status(403).json({
        message: "Access denied: Restricted to assigned city jurisdiction",
      });
    }

    next();
  };
};
