import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { Attendance } from "./attendance.model.js";
import { getOwnerId } from "../../utils/getOwnerId.js";
import { Boat } from "../boats/boat.model.js";

// Check in for today
export const checkIn = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const ownerId = await getOwnerId(req);

    if (!userId || !ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Check if already checked in
    const existing = await Attendance.findOne({ userId, date: todayStr });
    if (existing) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const record = await Attendance.create({
      userId,
      ownerId,
      date: todayStr,
      checkIn: new Date(),
      status: "PRESENT",
    });

    return res.status(201).json({ message: "Checked in successfully", record });
  } catch (error: any) {
    return res.status(500).json({ message: "Check-in failed", error: error.message });
  }
};

// Check out for today
export const checkOut = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const todayStr = new Date().toISOString().split("T")[0];

    const record = await Attendance.findOne({ userId, date: todayStr });
    if (!record) {
      return res.status(400).json({ message: "No check-in record found for today" });
    }

    if (record.checkOut) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    record.checkOut = new Date();
    await record.save();

    return res.json({ message: "Checked out successfully", record });
  } catch (error: any) {
    return res.status(500).json({ message: "Check-out failed", error: error.message });
  }
};

// Get today's attendance status
export const getTodayStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const record = await Attendance.findOne({ userId, date: todayStr });

    return res.json({ record });
  } catch (error: any) {
    return res.status(500).json({ message: "Fetch status failed", error: error.message });
  }
};

// Get all attendance records for owner/manager
export const getOwnerAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = await getOwnerId(req);
    if (!ownerId) {
      return res.status(403).json({ message: "Owner not linked" });
    }

    // Fetch all attendance for this owner's staff
    const records = await Attendance.find({ ownerId })
      .populate("userId", "name role email phone assignedBoatId")
      .sort({ date: -1, createdAt: -1 });

    // Format them to match client side
    const formatted = await Promise.all(
      records.map(async (rec: any) => {
        const user = rec.userId;
        let assignedBoatName = "Not Assigned";
        if (user?.assignedBoatId) {
          const boat = await Boat.findById(user.assignedBoatId);
          if (boat) {
            assignedBoatName = boat.boatName;
          }
        }
        return {
          _id: rec._id,
          staffName: user?.name || "Staff Member",
          role: user?.role || "DRIVER",
          assignedBoat: assignedBoatName,
          checkInTime: rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--",
          checkOutTime: rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--",
          status: rec.status,
          date: rec.date,
        };
      })
    );

    return res.json(formatted);
  } catch (error: any) {
    return res.status(500).json({ message: "Fetch attendance failed", error: error.message });
  }
};
