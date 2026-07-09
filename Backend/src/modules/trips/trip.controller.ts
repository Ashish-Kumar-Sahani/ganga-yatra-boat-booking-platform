import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { Trip } from "./trip.model.js";
import { Boat } from "../boats/boat.model.js";
import { Booking } from "../bookings/booking.model.js";
import { Schedule } from "../schedules/schedule.model.js";
import { Slot } from "../slots/slot.model.js";

export const startTrip = async (req: AuthRequest, res: Response) => {
  try {
    const { boatId, routeId, slotId, latitude, longitude } = req.body;

    const trip = await Trip.create({
      boatId,
      routeId,
      slotId,
      currentLatitude: latitude,
      currentLongitude: longitude,
      tripStatus: "STARTED",
      startedAt: new Date(),
    });

    res.status(201).json({
      message: "Trip started successfully",
      trip,
    });
  } catch (error) {
    res.status(500).json({ message: "Trip start failed", error });
  }
};

export const updateTripLocation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { tripId, latitude, longitude } = req.body;

    const trip = await Trip.findByIdAndUpdate(
      tripId,
      {
        currentLatitude: latitude,
        currentLongitude: longitude,
        tripStatus: "IN_PROGRESS",
      },
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json({
      message: "Trip location updated",
      trip,
    });
  } catch (error) {
    res.status(500).json({ message: "Location update failed", error });
  }
};

export const getLiveTrip = async (req: AuthRequest, res: Response) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("boatId", "boatName boatNumber")
      .populate("routeId")
      .populate("slotId");

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Live trip fetch failed", error });
  }
};

export const completeTrip = async (req: AuthRequest, res: Response) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      {
        tripStatus: "COMPLETED",
        completedAt: new Date(),
      },
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json({
      message: "Trip completed successfully",
      trip,
    });
  } catch (error) {
    res.status(500).json({ message: "Trip completion failed", error });
  }
};

export const activateSOS = async (req: AuthRequest, res: Response) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      {
        sosActive: true,
        sosReason: req.body.reason || "Emergency",
      },
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json({
      message: "SOS activated successfully",
      trip,
    });
  } catch (error) {
    res.status(500).json({ message: "SOS activation failed", error });
  }
};
export const getOwnerTrips = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?._id || req.user?.id;

    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized owner" });
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
    }).select("_id");

    const scheduleIds = schedules.map((schedule) => schedule._id);

    const slots = await Slot.find({
      scheduleId: { $in: scheduleIds },
    })
      .populate({
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
      })
      .sort({ slotDate: -1 });

    const slotIds = slots.map((slot) => slot._id);

    const bookings = await Booking.find({
      slotId: { $in: slotIds },
      bookingStatus: { $ne: "CANCELLED" },
    });

    const trips = slots.map((slot: any) => {
      const schedule = slot.scheduleId;

      const slotBookings = bookings.filter(
        (booking: any) =>
          booking.slotId.toString() === slot._id.toString()
      );

      const passengers = slotBookings.reduce(
        (sum: number, booking: any) =>
          sum + Number(booking.seatsBooked || 0),
        0
      );

      const revenue = slotBookings
        .filter((booking: any) => booking.paymentStatus === "PAID")
        .reduce(
          (sum: number, booking: any) =>
            sum + Number(booking.totalAmount || 0),
          0
        );

      const now = new Date();
      const slotDate = new Date(slot.slotDate);

      let tripStatus = "NOT_STARTED";

      if (slot.status === "CANCELLED") {
        tripStatus = "CANCELLED";
      } else if (slot.status === "EXPIRED" || slotDate < now) {
        tripStatus = "COMPLETED";
      }

      return {
        _id: slot._id,
        tripCode: `TRIP-${String(slot._id).slice(-6).toUpperCase()}`,

        boatId: schedule?.boatId,
        routeId: schedule?.routeId,
        slotId: slot,

        startTime: schedule?.departureTime || "N/A",
        endTime: schedule?.arrivalTime || "N/A",
        tripDate: slot.slotDate,

        passengers,
        revenue,

        tripStatus,
        startedAt: null,
        completedAt: tripStatus === "COMPLETED" ? slotDate : null,

        currentLatitude: null,
        currentLongitude: null,
        sosActive: false,
      };
    });

    return res.json(trips);
  } catch (error) {
    return res.status(500).json({
      message: "Owner trips fetch failed",
      error,
    });
  }
};
export const cancelTrip = async (req: AuthRequest, res: Response) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      {
        tripStatus: "CANCELLED",
      },
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    return res.json({
      message: "Trip cancelled successfully",
      trip,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Trip cancellation failed",
      error,
    });
  }
};