import { Request, Response } from "express";
import { Schedule } from "./schedule.model.js";
import { Boat } from "../boats/boat.model.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { getOwnerId } from "../../utils/getOwnerId.js";

export const createSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const validationError = validateSchedulePayload(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const ownerId = await getOwnerId(req);

    if (!ownerId) {
      return res.status(403).json({ message: "Owner not linked" });
    }

    const boat = await Boat.findOne({
      _id: req.body.boatId,
      ownerId,
    });

    if (!boat) {
      return res.status(404).json({
        message: "Boat not found or not owned by this owner",
      });
    }

    const schedule = await Schedule.create({
      ...req.body,
      totalSeats: Number(req.body.totalSeats),
      onlineSeats: Number(req.body.onlineSeats),
      offlineSeats: Number(req.body.offlineSeats),
      emergencySeats: Number(req.body.emergencySeats || 0),
    });

    return res.status(201).json({
      message: "Schedule created successfully",
      schedule,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Schedule creation failed",
      error,
    });
  }
};
export const getSchedules = async (req: Request, res: Response) => {
  try {
    const schedules = await Schedule.find()
      .populate("boatId", "boatName boatNumber capacity")
      .populate({
        path: "routeId",
        populate: [
          { path: "sourceGhatId", select: "name location" },
          { path: "destinationGhatId", select: "name location" },
        ],
      })
      .sort({ createdAt: -1 });

    return res.json(schedules);
  } catch (error) {
    return res.status(500).json({
      message: "Schedules fetch failed",
      error,
    });
  }
};

export const getSchedulesByRoute = async (req: Request, res: Response) => {
  try {
    const schedules = await Schedule.find({
      routeId: req.params.routeId,
      status: "ACTIVE",
    })
      .populate("boatId", "boatName boatNumber capacity")
      .populate("routeId");

    return res.json(schedules);
  } catch (error) {
    return res.status(500).json({
      message: "Route schedules fetch failed",
      error,
    });
  }
};

export const updateScheduleStatus = async (req: Request, res: Response) => {
  try {
    const { isActive } = req.body;

    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({
        message: "Schedule not found",
      });
    }

    return res.json({
      message: "Schedule status updated",
      schedule,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Schedule status update failed",
      error,
    });
  }
};
export const updateSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const validationError = validateSchedulePayload(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const ownerId = await getOwnerId(req);

    if (!ownerId) {
      return res.status(403).json({ message: "Owner not linked" });
    }

    const boats = await Boat.find({ ownerId }).select("_id");
    const boatIds = boats.map((boat) => boat._id);

    const schedule = await Schedule.findOneAndUpdate(
      {
        _id: req.params.id,
        boatId: { $in: boatIds },
      },
      {
        ...req.body,
        totalSeats: Number(req.body.totalSeats),
        onlineSeats: Number(req.body.onlineSeats),
        offlineSeats: Number(req.body.offlineSeats),
        emergencySeats: Number(req.body.emergencySeats || 0),
      },
      { new: true, runValidators: true }
    );

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    return res.json({
      message: "Schedule updated successfully",
      schedule,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Schedule update failed",
      error,
    });
  }
};

export const getOwnerSchedules = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = await getOwnerId(req);

    if (!ownerId) {
      return res.status(403).json({
        message: "Owner not linked",
      });
    }

    let queryBoatIds: any[] = [];
    if (["DRIVER", "CAPTAIN", "HELPER"].includes(req.user.role)) {
      if (req.user.assignedBoatId) {
        queryBoatIds = [req.user.assignedBoatId];
      } else {
        return res.json([]);
      }
    } else {
      const boats = await Boat.find({ ownerId }).select("_id");
      queryBoatIds = boats.map((boat) => boat._id);
    }

    const schedules = await Schedule.find({
      boatId: { $in: queryBoatIds },
    })
      .populate("boatId", "boatName boatNumber capacity")
      .populate({
        path: "routeId",
        populate: [
          { path: "sourceGhatId", select: "name" },
          { path: "destinationGhatId", select: "name" },
        ],
      })
      .sort({ startDate: 1, departureTime: 1 });

    return res.json(schedules);
  } catch (error) {
    return res.status(500).json({
      message: "Owner schedules fetch failed",
      error,
    });
  }
};
export const deleteSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    await schedule.deleteOne();

    return res.json({
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Schedule delete failed",
      error,
    });
  }
};
const validateSchedulePayload = (body: any) => {
  const {
    totalSeats,
    onlineSeats,
    offlineSeats,
    emergencySeats = 0,
    scheduleType,
    startDate,
    endDate,
    weekDays = [],
    specialDate,
  } = body;

  if (Number(onlineSeats) + Number(offlineSeats) + Number(emergencySeats) !== Number(totalSeats)) {
    return "Online + Offline + Emergency seats must equal total seats";
  }

  if (!startDate || !endDate) {
    return "startDate and endDate are required";
  }

  if (new Date(startDate) > new Date(endDate)) {
    return "startDate cannot be greater than endDate";
  }

  if (scheduleType === "WEEKLY" && (!Array.isArray(weekDays) || weekDays.length === 0)) {
    return "weekDays are required for WEEKLY schedule";
  }

  if (scheduleType === "SPECIAL" && !specialDate) {
    return "specialDate is required for SPECIAL schedule";
  }

  return null;
};