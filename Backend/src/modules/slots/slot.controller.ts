import { Request, Response } from "express";

import { Slot } from "./slot.model.js";
import { Schedule } from "../schedules/schedule.model.js";
import { Boat } from "../boats/boat.model.js";
import { Booking } from "../bookings/booking.model.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const expireOldSlotsNow = async () => {
  const today = startOfDay(new Date());

  await Slot.updateMany(
    {
      slotDate: { $lt: today },
      status: { $nin: ["CANCELLED", "EXPIRED"] },
    },
    {
      $set: {
        status: "EXPIRED",
        expiredAt: new Date(),
      },
    }
  );
};

export const createSlot = async (req: Request, res: Response) => {
  try {
    const { scheduleId, slotDate } = req.body;

    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    const date = startOfDay(new Date(slotDate));

    const existingSlot = await Slot.findOne({
      scheduleId,
      slotDate: {
        $gte: startOfDay(date),
        $lte: endOfDay(date),
      },
    });

    if (existingSlot) {
      return res.status(400).json({
        message: "Slot already exists for this schedule and date",
      });
    }

    const slot = await Slot.create({
      scheduleId,
      slotDate: date,
      totalSeats: schedule.totalSeats,
      onlineSeats: schedule.onlineSeats,
      offlineSeats: schedule.offlineSeats,
      emergencySeats: schedule.emergencySeats,
      bookedOnlineSeats: 0,
      bookedOfflineSeats: 0,
      bookedEmergencySeats: 0,
      status: "OPEN",
    });

    return res.status(201).json({
      message: "Slot created successfully",
      slot,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Slot creation failed",
      error,
    });
  }
};

export const getSlots = async (_req: Request, res: Response) => {
  try {
    await expireOldSlotsNow();

    const slots = await Slot.find()
      .populate({
        path: "scheduleId",
        populate: [
          { path: "boatId", select: "boatName boatNumber capacity" },
          {
            path: "routeId",
            populate: [
              { path: "sourceGhatId", select: "name" },
              { path: "destinationGhatId", select: "name" },
            ],
          },
        ],
      })
      .sort({ slotDate: 1 });

    return res.json(slots);
  } catch (error) {
    return res.status(500).json({
      message: "Slots fetch failed",
      error,
    });
  }
};

export const getSlotSeatSummary = async (req: Request, res: Response) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    const booked =
      slot.bookedOnlineSeats +
      slot.bookedOfflineSeats +
      slot.bookedEmergencySeats;

    return res.json({
      slotId: slot._id,
      totalSeats: slot.totalSeats,
      bookedSeats: booked,
      availableSeats: Math.max(slot.totalSeats - booked, 0),

      online: {
        total: slot.onlineSeats,
        booked: slot.bookedOnlineSeats,
        available: Math.max(slot.onlineSeats - slot.bookedOnlineSeats, 0),
      },

      offline: {
        total: slot.offlineSeats,
        booked: slot.bookedOfflineSeats,
        available: Math.max(slot.offlineSeats - slot.bookedOfflineSeats, 0),
      },

      emergency: {
        total: slot.emergencySeats,
        booked: slot.bookedEmergencySeats,
        available: Math.max(
          slot.emergencySeats - slot.bookedEmergencySeats,
          0
        ),
      },

      status: slot.status,
      slotDate: slot.slotDate,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Seat summary fetch failed",
      error,
    });
  }
};

export const generateSlots = async (req: Request, res: Response) => {
  try {
    const { scheduleId, days = 7 } = req.body;

    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    const createdSlots = [];

    for (let i = 0; i < Number(days); i++) {
      const slotDate = new Date();
      slotDate.setDate(slotDate.getDate() + i);

      const dayStart = startOfDay(slotDate);
      const dayEnd = endOfDay(slotDate);

      const existingSlot = await Slot.findOne({
        scheduleId,
        slotDate: {
          $gte: dayStart,
          $lte: dayEnd,
        },
      });

      if (existingSlot) continue;

      const slot = await Slot.create({
        scheduleId,
        slotDate: dayStart,
        totalSeats: schedule.totalSeats,
        onlineSeats: schedule.onlineSeats,
        offlineSeats: schedule.offlineSeats,
        emergencySeats: schedule.emergencySeats,
        bookedOnlineSeats: 0,
        bookedOfflineSeats: 0,
        bookedEmergencySeats: 0,
        status: "OPEN",
      });

      createdSlots.push(slot);
    }

    return res.status(201).json({
      message: "Slots generated successfully",
      totalCreated: createdSlots.length,
      slots: createdSlots,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Slot generation failed",
      error,
    });
  }
};

export const updateSlotStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["OPEN", "FULL", "CANCELLED", "EXPIRED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Use OPEN, FULL, CANCELLED or EXPIRED",
      });
    }

    const updateData: any = { status };

    if (status === "EXPIRED") {
      updateData.expiredAt = new Date();
    }

    const slot = await Slot.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!slot) {
      return res.status(404).json({
        message: "Slot not found",
      });
    }

    return res.json({
      message: "Slot status updated successfully",
      slot,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Slot status update failed",
      error,
    });
  }
};

export const getSlotById = async (req: Request, res: Response) => {
  try {
    await expireOldSlotsNow();

    const slot = await Slot.findById(req.params.id).populate({
      path: "scheduleId",
      populate: [
        {
          path: "routeId",
          populate: ["sourceGhatId", "destinationGhatId"],
        },
        {
          path: "boatId",
        },
      ],
    });

    if (!slot) {
      return res.status(404).json({
        message: "Slot not found",
      });
    }

    return res.json(slot);
  } catch (error) {
    return res.status(500).json({
      message: "Slot fetch failed",
      error,
    });
  }
};

export const getOwnerSlots = async (req: AuthRequest, res: Response) => {
  try {
    await expireOldSlotsNow();

    const ownerId = req.user?._id || req.user?.id;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized owner",
      });
    }

    const boats = await Boat.find({ ownerId }).select("_id");
    const boatIds = boats.map((boat) => boat._id);

    const schedules = await Schedule.find({
      boatId: { $in: boatIds },
    }).select("_id");

    const scheduleIds = schedules.map((schedule) => schedule._id);

    const slots = await Slot.find({
      scheduleId: { $in: scheduleIds },
    })
      .populate({
        path: "scheduleId",
        populate: [
          { path: "boatId", select: "boatName boatNumber capacity" },
          {
            path: "routeId",
            populate: [
              { path: "sourceGhatId", select: "name location" },
              { path: "destinationGhatId", select: "name location" },
            ],
          },
        ],
      })
      .sort({ slotDate: 1 });

    return res.json(slots);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Owner slots fetch failed",
      error,
    });
  }
};

export const getOwnerMonthlySlots = async (req: AuthRequest, res: Response) => {
  try {
    await expireOldSlotsNow();

    const ownerId = req.user?._id || req.user?.id;
    const days = Number(req.query.days || 30);
    const historyDays = Number(req.query.historyDays || 15);

    if (!ownerId) {
      return res.status(401).json({
        message: "Unauthorized owner",
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - historyDays);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    endDate.setHours(23, 59, 59, 999);

    const boats = await Boat.find({ ownerId }).select("_id");
    const boatIds = boats.map((boat) => boat._id);

    const schedules = await Schedule.find({
      boatId: { $in: boatIds },
    }).select("_id");

    const scheduleIds = schedules.map((schedule) => schedule._id);

    const slots = await Slot.find({
      scheduleId: { $in: scheduleIds },
      slotDate: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate({
        path: "scheduleId",
        populate: [
          { path: "boatId", select: "boatName boatNumber capacity" },
          {
            path: "routeId",
            populate: [
              { path: "sourceGhatId", select: "name" },
              { path: "destinationGhatId", select: "name" },
            ],
          },
        ],
      })
      .sort({ slotDate: 1 });

    return res.json(slots);
  } catch (error) {
    return res.status(500).json({
      message: "Owner monthly slots fetch failed",
      error,
    });
  }
};

export const getMonthlySlotAvailability = async (
  req: Request,
  res: Response
) => {
  try {
    await expireOldSlotsNow();

    const routeId = req.query.routeId as string;
    const month = req.query.month as string;

    if (!routeId || !month) {
      return res.status(400).json({
        message:
          "routeId and month are required. Example: ?routeId=xxx&month=2026-06",
      });
    }

    const [year, monthNumber] = String(month).split("-").map(Number);

    const startDate = new Date(year, monthNumber - 1, 1);
    const endDate = new Date(year, monthNumber, 0);
    endDate.setHours(23, 59, 59, 999);

    const schedules = await Schedule.find({
      routeId,
      isActive: true,
    }).select("_id");

    const scheduleIds = schedules.map((schedule) => schedule._id);

    const slots = await Slot.find({
      scheduleId: { $in: scheduleIds },
      slotDate: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate({
        path: "scheduleId",
        populate: [
          { path: "boatId", select: "boatName boatNumber capacity" },
          {
            path: "routeId",
            populate: [
              { path: "sourceGhatId", select: "name" },
              { path: "destinationGhatId", select: "name" },
            ],
          },
        ],
      })
      .sort({ slotDate: 1 });

    const grouped: Record<string, any> = {};

    slots.forEach((slot: any) => {
      const dateKey = slot.slotDate.toISOString().split("T")[0];

      const bookedSeats =
        (slot.bookedOnlineSeats || 0) +
        (slot.bookedOfflineSeats || 0) +
        (slot.bookedEmergencySeats || 0);

      const availableSeats = Math.max((slot.totalSeats || 0) - bookedSeats, 0);

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: dateKey,
          totalSeats: 0,
          bookedSeats: 0,
          availableSeats: 0,
          status: "NO_SLOT",
          slots: [],
        };
      }

      grouped[dateKey].totalSeats += slot.totalSeats || 0;
      grouped[dateKey].bookedSeats += bookedSeats;
      grouped[dateKey].availableSeats += availableSeats;

      grouped[dateKey].slots.push({
        _id: slot._id,
        slotDate: slot.slotDate,
        totalSeats: slot.totalSeats,
        bookedSeats,
        availableSeats,
        status: slot.status,
        schedule: slot.scheduleId,
      });
    });

    Object.keys(grouped).forEach((dateKey) => {
      const day = grouped[dateKey];

      if (day.availableSeats <= 0) {
        day.status = "FULL";
      } else if (day.availableSeats <= 5) {
        day.status = "LIMITED";
      } else {
        day.status = "AVAILABLE";
      }
    });

    return res.json(Object.values(grouped));
  } catch (error) {
    return res.status(500).json({
      message: "Monthly slot availability fetch failed",
      error,
    });
  }
};

export const updateSlot = async (req: Request, res: Response) => {
  try {
    const { totalSeats, onlineSeats, offlineSeats, emergencySeats = 0 } =
      req.body;

    if (onlineSeats + offlineSeats + emergencySeats !== totalSeats) {
      return res.status(400).json({
        message: "Online + Offline + Emergency seats must equal total seats",
      });
    }

    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    const bookedOnline = slot.bookedOnlineSeats || 0;
    const bookedOffline = slot.bookedOfflineSeats || 0;
    const bookedEmergency = slot.bookedEmergencySeats || 0;

    if (onlineSeats < bookedOnline) {
      return res.status(400).json({
        message: `Online seats cannot be less than booked online seats (${bookedOnline})`,
      });
    }

    if (offlineSeats < bookedOffline) {
      return res.status(400).json({
        message: `Offline seats cannot be less than booked offline seats (${bookedOffline})`,
      });
    }

    if (emergencySeats < bookedEmergency) {
      return res.status(400).json({
        message: `Emergency seats cannot be less than booked emergency seats (${bookedEmergency})`,
      });
    }

    slot.totalSeats = totalSeats;
    slot.onlineSeats = onlineSeats;
    slot.offlineSeats = offlineSeats;
    slot.emergencySeats = emergencySeats;

    const totalBooked = bookedOnline + bookedOffline + bookedEmergency;

    if (slot.status !== "CANCELLED" && slot.status !== "EXPIRED") {
      slot.status = totalBooked >= totalSeats ? "FULL" : "OPEN";
    }

    await slot.save();

    return res.json({
      message: "Slot updated successfully",
      slot,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Slot update failed",
      error,
    });
  }
};

export const shiftSlotDate = async (req: Request, res: Response) => {
  try {
    const { slotDate } = req.body;

    if (!slotDate) {
      return res.status(400).json({
        message: "slotDate is required",
      });
    }

    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    const booked =
      slot.bookedOnlineSeats +
      slot.bookedOfflineSeats +
      slot.bookedEmergencySeats;

    if (booked > 0) {
      return res.status(400).json({
        message: "Booked slot cannot be shifted",
      });
    }

    const newDate = startOfDay(new Date(slotDate));

    const existingSlot = await Slot.findOne({
      _id: { $ne: slot._id },
      scheduleId: slot.scheduleId,
      slotDate: {
        $gte: startOfDay(newDate),
        $lte: endOfDay(newDate),
      },
    });

    if (existingSlot) {
      return res.status(400).json({
        message: "Another slot already exists for this schedule on selected date",
      });
    }

    slot.slotDate = newDate;
    slot.status = "OPEN";
    slot.expiredAt = undefined;

    await slot.save();

    return res.json({
      message: "Slot shifted successfully",
      slot,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Slot shift failed",
      error,
    });
  }
};

export const getSlotPassengers = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const slotId = req.params.id;

    const slot = await Slot.findById(slotId).populate({
      path: "scheduleId",
      populate: [
        { path: "boatId", select: "boatName boatNumber" },
        {
          path: "routeId",
          populate: [
            { path: "sourceGhatId", select: "name" },
            { path: "destinationGhatId", select: "name" },
          ],
        },
      ],
    });

    if (!slot) {
      return res.status(404).json({
        message: "Slot not found",
      });
    }

    const bookings = await Booking.find({ slotId })
      .populate("customerId", "name email phone")
      .sort({ createdAt: -1 });

    const passengers = bookings.map((booking: any) => ({
      bookingId: booking._id,
      bookingCode: booking.bookingCode,
      passengerName: booking.passengerName,
      passengerPhone: booking.passengerPhone,
      customerName: booking.customerId?.name,
      customerEmail: booking.customerId?.email,
      customerPhone: booking.customerId?.phone,
      seatsBooked: booking.seatsBooked,
      totalAmount: booking.totalAmount,
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.bookingStatus,
      checkInStatus: booking.checkInStatus,
      bookingType: booking.bookingType,
      createdAt: booking.createdAt,
    }));

    return res.json({
      slotId,
      slot,
      totalBookings: bookings.length,
      totalPassengers: bookings.reduce(
        (sum, booking) => sum + booking.seatsBooked,
        0
      ),
      totalRevenue: bookings.reduce(
        (sum, booking) => sum + booking.totalAmount,
        0
      ),
      passengers,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Slot passengers fetch failed",
      error,
    });
  }
};