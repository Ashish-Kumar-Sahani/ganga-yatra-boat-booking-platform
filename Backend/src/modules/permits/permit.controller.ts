import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { Permit } from "./permit.model.js";
import { getOwnerId } from "../../utils/getOwnerId.js";

export const createPermitRequest = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = await getOwnerId(req);
    const permit = await Permit.create({
      ...req.body,
      ownerId,
    });

    res.status(201).json({ message: "Permit request created", permit });
  } catch (error) {
    res.status(500).json({ message: "Permit request failed", error });
  }
};

export const getPermitRequests = async (req: AuthRequest, res: Response) => {
  try {
    const permits = await Permit.find()
      .populate("boatId", "boatName boatNumber")
      .populate("ownerId", "name phone email")
      .populate("cityId", "name state")
      .populate("allowedRoutes")
      .sort({ createdAt: -1 });

    res.json(permits);
  } catch (error) {
    res.status(500).json({ message: "Permits fetch failed", error });
  }
};

export const approvePermit = async (req: AuthRequest, res: Response) => {
  try {
    const permit = await Permit.findByIdAndUpdate(
      req.params.id,
      {
        status: "APPROVED",
        remarks: req.body.remarks || "Approved",
      },
      { new: true }
    );

    res.json({ message: "Permit approved", permit });
  } catch (error) {
    res.status(500).json({ message: "Permit approval failed", error });
  }
};

export const rejectPermit = async (req: AuthRequest, res: Response) => {
  try {
    const permit = await Permit.findByIdAndUpdate(
      req.params.id,
      {
        status: "REJECTED",
        remarks: req.body.remarks || "Rejected",
      },
      { new: true }
    );

    res.json({ message: "Permit rejected", permit });
  } catch (error) {
    res.status(500).json({ message: "Permit rejection failed", error });
  }
};