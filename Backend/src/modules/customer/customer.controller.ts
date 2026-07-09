import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";

import { Booking } from "../bookings/booking.model.js";
import { Boat } from "../boats/boat.model.js";
import { Slot } from "../slots/slot.model.js";
import { Route } from "../routes/route.model.js";
import { Schedule } from "../schedules/schedule.model.js";
import { User } from "../users/user.model.js";
import { Trip } from "../trips/trip.model.js";
import { Review } from "../reviews/review.model.js";
import { WalletTransaction } from "./walletTransaction.model.js";

const populateBookingQuery = {
  path: "slotId",
  populate: {
    path: "scheduleId",
    populate: [
      {
        path: "boatId",
        select: "boatName boatNumber boatType capacity image",
      },
      {
        path: "routeId",
        populate: [
          { path: "sourceGhatId", select: "name location" },
          { path: "destinationGhatId", select: "name location" },
        ],
      },
    ],
  },
};

export const getCustomerDashboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const customerId = req.user?._id || req.user?.id;

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized customer",
      });
    }

    const user = await User.findById(customerId);
    const walletBalance = user?.walletBalance || 0;
    const rewardPoints = user?.rewardPoints || 0;

    const allBookings = await Booking.find({ customerId })
      .populate(populateBookingQuery as any)
      .sort({ createdAt: -1 });

    const recentBookings = allBookings.slice(0, 6);

    const upcomingBooking =
      allBookings.find(
        (booking: any) =>
          booking.bookingStatus === "CONFIRMED" ||
          booking.bookingStatus === "PENDING"
      ) || null;

    const totalSpent = allBookings.reduce(
      (sum: number, booking: any) => sum + Number(booking.totalAmount || 0),
      0
    );

    const recommendedBoats = await Boat.find({
      status: "APPROVED",
      isAvailable: true,
    })
      .select("boatName boatNumber boatType capacity image")
      .sort({ createdAt: -1 })
      .limit(4);

    return res.status(200).json({
      customerName: user?.name || req.user?.name || "Customer",
      walletBalance,
      rewardPoints,

      stats: {
        upcomingBookings: allBookings.filter(
          (booking: any) =>
            booking.bookingStatus === "CONFIRMED" ||
            booking.bookingStatus === "PENDING"
        ).length,

        totalRides: allBookings.length,

        completedRides: allBookings.filter(
          (booking: any) => booking.bookingStatus === "COMPLETED"
        ).length,

        cancelledBookings: allBookings.filter(
          (booking: any) => booking.bookingStatus === "CANCELLED"
        ).length,

        totalSpent,

        loyaltyPoints: rewardPoints,
      },

      recentBookings,

      upcomingBooking,

      recommendedBoats: recommendedBoats.map((boat: any) => ({
        _id: boat._id,
        boatName: boat.boatName,
        boatNumber: boat.boatNumber,
        boatType: boat.boatType,
        capacity: boat.capacity,
        image: boat.image || null,
        rating: 4.5,
        price: 100,
      })),
    });
  } catch (error: any) {
    console.error("Customer dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Customer dashboard failed",
    });
  }
};

export const getCustomerWallet = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const transactions = await WalletTransaction.find({ userId }).sort({ createdAt: -1 });

    const totalSpent = transactions
      .filter((t) => t.type === "DEBIT" && t.purpose === "BOOKING_PAYMENT")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return res.status(200).json({
      balance: user.walletBalance || 0,
      rewardPoints: user.rewardPoints || 0,
      totalSpent,
      transactions,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Wallet fetch failed",
      error: error.message,
    });
  }
};

export const rechargeWallet = async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Invalid recharge amount" });
    }

    const userId = req.user?._id || req.user?.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.walletBalance = (user.walletBalance || 0) + Number(amount);
    const addedPoints = Math.floor(Number(amount) / 100);
    user.rewardPoints = (user.rewardPoints || 0) + addedPoints;
    await user.save();

    await WalletTransaction.create({
      userId,
      amount: Number(amount),
      type: "CREDIT",
      purpose: "RECHARGE",
      title: "Wallet Recharge",
      description: `Credited ₹${amount} via Card/UPI Simulation`,
    });

    return res.status(200).json({
      message: "Recharge successful",
      balance: user.walletBalance,
      rewardPoints: user.rewardPoints,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Recharge failed", error: error.message });
  }
};

export const payWithWallet = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    const userId = req.user?._id || req.user?.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const booking = await Booking.findOne({ _id: bookingId, customerId: userId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.paymentStatus === "PAID") {
      return res.status(400).json({ message: "Booking already paid" });
    }

    const fare = booking.totalAmount || 0;
    if ((user.walletBalance || 0) < fare) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    user.walletBalance = (user.walletBalance || 0) - fare;
    const earnedPoints = Math.floor(fare / 10);
    user.rewardPoints = (user.rewardPoints || 0) + earnedPoints;
    await user.save();

    await WalletTransaction.create({
      userId,
      amount: fare,
      type: "DEBIT",
      purpose: "BOOKING_PAYMENT",
      bookingId: booking._id,
      title: "Ride Payment",
      description: `Debited for Ride Booking ${booking.bookingCode || booking._id}`,
    });

    booking.paymentStatus = "PAID";
    booking.bookingStatus = "CONFIRMED";
    await booking.save();

    return res.status(200).json({
      message: "Payment successful using wallet",
      balance: user.walletBalance,
      booking,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Wallet payment failed", error: error.message });
  }
};

export const getLiveTrip = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const customerId = req.user?._id || req.user?.id;
    const { bookingId } = req.params;

    let booking;
    if (bookingId && bookingId !== "current-booking") {
      booking = await Booking.findOne({ _id: bookingId, customerId }).populate(populateBookingQuery as any);
    } else {
      booking = await Booking.findOne({
        customerId,
        bookingStatus: { $in: ["CONFIRMED", "COMPLETED"] }
      })
      .populate(populateBookingQuery as any)
      .sort({ createdAt: -1 });
    }

    if (!booking) {
      return res.status(200).json(null);
    }

    const slotId = (booking as any).slotId?._id;
    const boatId = (booking as any).slotId?.scheduleId?.boatId?._id;
    const routeId = (booking as any).slotId?.scheduleId?.routeId?._id;

    // Find active trip
    let trip = await Trip.findOne({
      slotId,
      tripStatus: { $in: ["STARTED", "IN_PROGRESS"] }
    });

    if (!trip && boatId) {
      trip = await Trip.findOne({
        boatId,
        tripStatus: { $in: ["STARTED", "IN_PROGRESS"] }
      });
    }

    // Try to find a captain user assigned to the boat
    let captainName = "Captain Kumar";
    let captainPhone = "+91 98765 43210";
    if (boatId) {
      const captainUser = await User.findOne({
        assignedBoatId: boatId,
        role: { $in: ["CAPTAIN", "DRIVER"] }
      });
      if (captainUser) {
        captainName = captainUser.name;
        captainPhone = captainUser.phone || captainPhone;
      }
    }

    const sourceGhatName = (booking as any).slotId?.scheduleId?.routeId?.sourceGhatId?.name || "Source Ghat";
    const destGhatName = (booking as any).slotId?.scheduleId?.routeId?.destinationGhatId?.name || "Destination Ghat";
    const routeName = `${sourceGhatName} ➔ ${destGhatName}`;
    const boatName = (booking as any).slotId?.scheduleId?.boatId?.boatName || "Ganga Cruiser";

    return res.status(200).json({
      bookingId: booking._id,
      bookingCode: booking.bookingCode,
      boatName,
      boatNumber: (booking as any).slotId?.scheduleId?.boatId?.boatNumber || "G-YATRA-01",
      routeName,
      eta: trip ? "10 mins" : "Not Started Yet",
      currentLocation: trip ? "Midstream Ganga" : sourceGhatName,
      status: trip ? trip.tripStatus : "SCHEDULED",
      currentLat: trip?.currentLatitude || 25.3176,
      currentLng: trip?.currentLongitude || 82.9739,
      captainName,
      captainPhone,
      passengers: booking.seatsBooked || 1,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Live trip fetch failed",
      error: error.message,
    });
  }
};

export const getCustomerProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      city: user.city || "",
      address: user.address || "",
      role: user.role,
      profileImage: user.profileImage || "",
      walletBalance: user.walletBalance || 0,
      rewardPoints: user.rewardPoints || 0,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Profile fetch failed",
      error: error.message,
    });
  }
};

export const updateCustomerProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { name, phone, city, address } = req.body;
    const userId = req.user?._id || req.user?.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.phone = phone !== undefined ? phone : user.phone;
    user.city = city !== undefined ? city : user.city;
    user.address = address !== undefined ? address : user.address;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        address: user.address,
        profileImage: user.profileImage || "",
        walletBalance: user.walletBalance || 0,
        rewardPoints: user.rewardPoints || 0,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Profile update failed",
      error: error.message,
    });
  }
};

export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const user = await User.findById(userId).populate({
      path: "wishlist",
      select: "boatName boatNumber boatType capacity image status isAvailable",
    });

    return res.status(200).json(user?.wishlist || []);
  } catch (error: any) {
    return res.status(500).json({ message: "Wishlist fetch failed", error: error.message });
  }
};

export const toggleWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const { boatId } = req.body;
    if (!boatId) {
      return res.status(400).json({ message: "boatId is required" });
    }

    const userId = req.user?._id || req.user?.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.wishlist) {
      user.wishlist = [];
    }

    const index = user.wishlist.indexOf(boatId);
    let isAdded = false;
    if (index === -1) {
      user.wishlist.push(boatId);
      isAdded = true;
    } else {
      user.wishlist.splice(index, 1);
    }

    await user.save();
    return res.status(200).json({
      message: isAdded ? "Added to wishlist" : "Removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Wishlist toggle failed", error: error.message });
  }
};

export const getCustomerReviews = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const reviews = await Review.find({ customerId: userId })
      .populate({
        path: "boatId",
        select: "boatName boatNumber boatType capacity image",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json(reviews);
  } catch (error: any) {
    return res.status(500).json({ message: "Reviews fetch failed", error: error.message });
  }
};

export const createCustomerReview = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId, rating, comment, boatRating, captainRating, tripRating, ownerRating, images } = req.body;
    if (!bookingId) {
      return res.status(400).json({ message: "bookingId is required" });
    }

    const booking: any = await Booking.findById(bookingId).populate({
      path: "slotId",
      populate: {
        path: "scheduleId",
        populate: { path: "boatId" },
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const boatId = booking.slotId?.scheduleId?.boatId?._id;
    if (!boatId) {
      return res.status(400).json({ message: "No boat associated with this booking" });
    }

    // Save detailed review
    const review = await Review.create({
      customerId: req.user._id,
      bookingId,
      boatId,
      rating: rating || boatRating || 5,
      boatRating: boatRating || rating || 5,
      captainRating: captainRating || 5,
      tripRating: tripRating || 5,
      ownerRating: ownerRating || 5,
      comment: comment || "",
      images: images || [],
    });

    return res.status(201).json({
      message: "Review submitted successfully",
      review,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Review submission failed", error: error.message });
  }
};

export const getAvailableCustomerSlots = async (req: AuthRequest, res: Response) => {
  try {
    const { sourceGhatId, destinationGhatId, date, passengers = 1 } = req.query;

    if (!sourceGhatId || !destinationGhatId || !date) {
      return res.status(400).json({
        message: "sourceGhatId, destinationGhatId and date are required",
      });
    }

    const routes = await Route.find({
      isActive: true,
    });

    const route = routes.find(
      (item: any) =>
        String(item.sourceGhatId) === String(sourceGhatId) &&
        String(item.destinationGhatId) === String(destinationGhatId)
    );

    if (!route) {
      return res.status(404).json({
        message: "No route found for selected ghats",
      });
    }

    const startDate = new Date(String(date));
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(String(date));
    endDate.setHours(23, 59, 59, 999);

    const slots = await Slot.find({
      slotDate: { $gte: startDate, $lte: endDate },
      status: "OPEN",
    })
      .populate({
        path: "scheduleId",
        match: {
          routeId: route._id,
          isActive: true,
        },
        populate: [
          {
            path: "boatId",
            select: "boatName boatNumber boatType capacity image isAvailable status",
          },
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

    const availableSlots = slots
      .filter((slot: any) => slot.scheduleId)
      .filter((slot: any) => {
        const availableOnline =
          (slot.onlineSeats || 0) - (slot.bookedOnlineSeats || 0);

        return (
          availableOnline >= Number(passengers) &&
          (slot as any).scheduleId?.boatId?.isAvailable !== false &&
          (slot as any).scheduleId?.boatId?.status === "APPROVED"
        );
      })
      .map((slot: any) => {
        const availableOnline =
          (slot.onlineSeats || 0) - (slot.bookedOnlineSeats || 0);

        return {
          _id: slot._id,
          slotDate: slot.slotDate,
          availableOnlineSeats: availableOnline,
          totalSeats: slot.totalSeats,
          onlineSeats: slot.onlineSeats,
          bookedOnlineSeats: slot.bookedOnlineSeats,
          schedule: slot.scheduleId,
        };
      });

    return res.json(availableSlots);
  } catch (error: any) {
    return res.status(500).json({
      message: "Available slots fetch failed",
      error: error.message,
    });
  }
};

export const searchTrips = async (req: AuthRequest, res: Response) => {
  try {
    const { cityId, sourceGhatId, destinationGhatId, date, travelDate, passengers = 1 } = req.query;

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
      .populate("sourceGhatId")
      .populate("destinationGhatId")
      .populate("cityId");

    if (!route) {
      return res.json([]);
    }

    const targetDate = new Date(targetDateStr);
    targetDate.setHours(12, 0, 0, 0);

    const schedules = await Schedule.find({
      routeId: route._id,
      isActive: true,
    }).populate("boatId");

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

      if (availableSeats < Number(passengers)) {
        continue;
      }

      results.push({
        scheduleId: schedule._id,
        slotId: slotId,
        boat: schedule.boatId,
        route: route,
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
    console.error("Search trips error:", error);
    return res.status(500).json({
      message: "Search trips failed",
      error: error.message,
    });
  }
};