import { Request, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { Schedule } from "../schedules/schedule.model.js";
import { Slot } from "../slots/slot.model.js";
import { User } from "../users/user.model.js";
import { Boat } from "../boats/boat.model.js";
import { Booking } from "../bookings/booking.model.js";
import { Route } from "../routes/route.model.js";
import { City } from "../cities/city.model.js";
import { Permit } from "../permits/permit.model.js";
import { Offer } from "../offers/offer.model.js";
import { Notification } from "../notifications/notification.model.js";
import { Ghat } from "../ghats/ghat.model.js";

export const globalSearch = async (req: AuthRequest, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.json({
        users: [],
        owners: [],
        staff: [],
        boats: [],
        bookings: [],
        routes: [],
        cities: [],
        permits: [],
        offers: [],
        notifications: [],
      });
    }

    const regex = new RegExp(query, "i");

    // 1. Search Users (role CUSTOMER)
    const users = await User.find({
      $or: [
        { name: regex },
        { email: regex },
        { phone: regex },
      ],
      role: "CUSTOMER",
    }).limit(5);

    // 2. Search Owners (role BOAT_OWNER, MANAGER)
    const owners = await User.find({
      $or: [
        { name: regex },
        { email: regex },
        { phone: regex },
      ],
      role: { $in: ["BOAT_OWNER", "MANAGER"] },
    }).limit(5);

    // 3. Search Staff (role DRIVER, CAPTAIN, HELPER)
    const staff = await User.find({
      $or: [
        { name: regex },
        { email: regex },
        { phone: regex },
      ],
      role: { $in: ["DRIVER", "CAPTAIN", "HELPER"] },
    }).limit(5);

    // 4. Search Boats
    const boats = await Boat.find({
      $or: [
        { boatName: regex },
        { boatNumber: regex },
      ],
    }).populate("ownerId", "name email").limit(5);

    // 5. Search Bookings
    const bookings = await Booking.find({
      $or: [
        { bookingCode: regex },
        { passengerName: regex },
        { passengerPhone: regex },
      ],
    }).limit(5);

    // 6. Search Cities
    const cities = await City.find({
      $or: [
        { name: regex },
        { state: regex },
        { riverName: regex },
      ],
    }).limit(5);

    // 7. Search Offers
    const offers = await Offer.find({
      $or: [
        { code: regex },
      ],
    }).limit(5);

    // 8. Search Notifications (only owned by Super Admin, or general system alerts)
    const notifications = await Notification.find({
      $or: [
        { title: regex },
        { message: regex },
      ],
      userId: req.user._id,
    }).limit(5);

    // 9. Search Permits
    const permits = await Permit.find({
      $or: [
        { permitNumber: regex },
      ],
    }).populate("boatId", "boatName boatNumber").limit(5);

    // 10. Search Routes (by City name or Ghat names)
    const matchedCities = await City.find({ name: regex }).select("_id");
    const matchedGhats = await Ghat.find({ name: regex }).select("_id");

    const routes = await Route.find({
      $or: [
        { cityId: { $in: matchedCities.map((c) => c._id) } },
        { sourceGhatId: { $in: matchedGhats.map((g) => g._id) } },
        { destinationGhatId: { $in: matchedGhats.map((g) => g._id) } },
      ],
    })
      .populate("cityId", "name")
      .populate("sourceGhatId", "name")
      .populate("destinationGhatId", "name")
      .limit(5);

    return res.json({
      users,
      owners,
      staff,
      boats,
      bookings,
      routes,
      cities,
      permits,
      offers,
      notifications,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Global search failed",
      error: error.message,
    });
  }
};

export const publicSearchRoutes = async (req: Request, res: Response) => {
  try {
    const { cityId, sourceGhatId, destinationGhatId, date, travelDate } = req.query;

    const targetDateStr = String(date || travelDate || "");
    if (!sourceGhatId || !destinationGhatId || !targetDateStr) {
      return res.status(400).json({
        message: "sourceGhatId, destinationGhatId and travelDate are required",
      });
    }

    const queryRoute: any = {
      sourceGhatId,
      destinationGhatId,
      isActive: true,
    };
    if (cityId) {
      queryRoute.cityId = cityId;
    }

    const route = await Route.findOne(queryRoute)
      .populate("sourceGhatId", "name")
      .populate("destinationGhatId", "name")
      .populate("cityId", "name");

    if (!route) {
      return res.json([]);
    }

    const targetDate = new Date(targetDateStr);
    targetDate.setHours(12, 0, 0, 0);

    const schedules = await Schedule.find({
      routeId: route._id,
      isActive: true,
    }).populate("boatId", "boatName boatType capacity image status isAvailable");

    const results = [];

    for (const schedule of schedules) {
      const start = new Date(schedule.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(schedule.endDate);
      end.setHours(23, 59, 59, 999);

      if (targetDate < start || targetDate > end) {
        continue;
      }

      if (schedule.scheduleType === "SPECIAL") {
        if (schedule.specialDate) {
          const spec = new Date(schedule.specialDate);
          if (spec.toDateString() !== targetDate.toDateString()) {
            continue;
          }
        } else {
          continue;
        }
      } else if (schedule.scheduleType === "WEEKLY") {
        const day = targetDate.getDay();
        if (!schedule.weekDays || !schedule.weekDays.includes(day)) {
          continue;
        }
      }

      const startOfTarget = new Date(targetDate);
      startOfTarget.setHours(0, 0, 0, 0);
      const endOfTarget = new Date(targetDate);
      endOfTarget.setHours(23, 59, 59, 999);

      let slot = await Slot.findOne({
        scheduleId: schedule._id,
        slotDate: { $gte: startOfTarget, $lte: endOfTarget }
      });

      let availableSeats = 0;
      let slotId = null;

      if (slot) {
        if (slot.status !== "OPEN") {
          continue;
        }
        availableSeats = (slot.onlineSeats || 0) - (slot.bookedOnlineSeats || 0);
        slotId = slot._id;
      } else {
        availableSeats = schedule.onlineSeats || 0;
        
        try {
          slot = await Slot.create({
            scheduleId: schedule._id,
            slotDate: startOfTarget,
            totalSeats: schedule.totalSeats,
            onlineSeats: schedule.onlineSeats,
            offlineSeats: schedule.offlineSeats,
            emergencySeats: schedule.emergencySeats || 0,
            bookedOnlineSeats: 0,
            bookedOfflineSeats: 0,
            bookedEmergencySeats: 0,
            status: "OPEN",
          });
          slotId = slot._id;
        } catch (slotErr) {
          console.error("Failed to auto-create slot:", slotErr);
        }
      }

      const boatInfo = schedule.boatId as any;

      results.push({
        scheduleId: schedule._id,
        slotId: slotId,
        boat: {
          _id: boatInfo?._id,
          boatName: boatInfo?.boatName,
          boatType: boatInfo?.boatType,
          capacity: boatInfo?.capacity,
          image: boatInfo?.image,
        },
        route: {
          _id: route._id,
          distanceKm: route.distanceKm,
          baseFare: route.baseFare,
          sourceGhatId: route.sourceGhatId,
          destinationGhatId: route.destinationGhatId,
        },
        sourceGhat: route.sourceGhatId,
        destinationGhat: route.destinationGhatId,
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        totalSeats: schedule.totalSeats,
        availableSeats: availableSeats,
        baseFare: route.baseFare,
        scheduleType: schedule.scheduleType,
        travelDate: targetDateStr,
      });
    }

    return res.json(results);
  } catch (error: any) {
    console.error("Public search routes error:", error);
    return res.status(500).json({
      message: "Public search routes failed",
      error: error.message,
    });
  }
};
