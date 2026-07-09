import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware.js";
import { Permit } from "../modules/permits/permit.model.js";
import {
  isPermitExpired,
} from "../utils/permitHelper.js";

export const validatePermit = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { boatId, routeId } = req.body;

    const permit = await Permit.findOne({
      boatId,
      ownerId: req.user?._id,
      status: "APPROVED",
      allowedRoutes: routeId,
    });

    if (!permit) {
      return res.status(403).json({
        message:
          "No approved permit found for this route",
      });
    }

    if (isPermitExpired(permit.validTill)) {
      return res.status(403).json({
        message: "Permit expired",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Permit validation failed",
      error,
    });
  }
};