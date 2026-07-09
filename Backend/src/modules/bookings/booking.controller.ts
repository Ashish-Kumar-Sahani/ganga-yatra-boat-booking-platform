import { Response } from "express";
import QRCode from "qrcode";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { Booking } from "./booking.model.js";
import { Schedule } from "../schedules/schedule.model.js";
import { Boat } from "../boats/boat.model.js";
import { Slot } from "../slots/slot.model.js";
import { getOwnerId } from "../../utils/getOwnerId.js";
import { User } from "../users/user.model.js";
import { WalletTransaction } from "../customer/walletTransaction.model.js";
import { Setting } from "../settings/setting.model.js";
import { Wallet } from "../wallet/wallet.model.js";

const getDepartureDateTime = (slotDate: Date, departureTime: string): Date => {
  const date = new Date(slotDate);
  const time = departureTime.trim().toUpperCase();
  let hours = 0;
  let minutes = 0;

  const match12 = time.match(/^(\d+):(\d+)\s*(AM|PM)$/);
  if (match12) {
    hours = parseInt(match12[1], 10);
    minutes = parseInt(match12[2], 10);
    const ampm = match12[3];
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
  } else {
    const match24 = time.match(/^(\d+):(\d+)(:\d+)?$/);
    if (match24) {
      hours = parseInt(match24[1], 10);
      minutes = parseInt(match24[2], 10);
    } else {
      const numbers = time.split(":");
      if (numbers.length >= 2) {
        hours = parseInt(numbers[0], 10) || 0;
        minutes = parseInt(numbers[1], 10) || 0;
      }
    }
  }

  date.setHours(hours, minutes, 0, 0);
  return date;
};

const generateBookingCode = () => `WBB-${Date.now()}`;
const createQrCode = async (booking: any) => {
  const qrData = {
    bookingId: booking._id,
    bookingCode: booking.bookingCode,
  };

  const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

  booking.qrCode = qrCode;
  await booking.save();

  return qrCode;
};

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { slotId, seatsBooked, passengerName, passengerPhone } = req.body;

    if (!slotId || !seatsBooked || !passengerName || !passengerPhone) {
      return res.status(400).json({
        message: "slotId, seatsBooked, passengerName and passengerPhone are required",
      });
    }

    const slot: any = await Slot.findById(slotId).populate({
      path: "scheduleId",
      populate: { path: "routeId" },
    });

    if (!slot) return res.status(404).json({ message: "Slot not found" });

    if (slot.status !== "OPEN") {
      return res.status(400).json({
        message: "This slot is not available for booking",
        status: slot.status,
      });
    }

    const availableOnlineSeats = slot.onlineSeats - slot.bookedOnlineSeats;

    if (availableOnlineSeats < seatsBooked) {
      return res.status(400).json({
        message: "Not enough online seats available",
        availableOnlineSeats,
      });
    }

    const route = slot.scheduleId?.routeId;

    if (!route) {
      return res.status(400).json({ message: "Route not found for this slot" });
    }

    slot.bookedOnlineSeats += seatsBooked;

    if (slot.bookedOnlineSeats >= slot.onlineSeats) {
      slot.status = "FULL";
    }

    await slot.save();

    const booking = await Booking.create({
      customerId: req.user._id,
      slotId,
      seatsBooked,
      totalAmount: seatsBooked * route.baseFare,
      bookingCode: generateBookingCode(),
      passengerName,
      passengerPhone,
      bookingType: "ONLINE",
      paymentStatus: "PENDING",
    });

    const qrCode = await createQrCode(booking);

    return res.status(201).json({
      message: "Booking created successfully",
      booking,
      qrCode,
      availableOnlineSeats: slot.onlineSeats - slot.bookedOnlineSeats,
    });
  } catch (error) {
    return res.status(500).json({ message: "Booking failed", error });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ customerId: req.user._id })
      .populate({
        path: "slotId",
        populate: {
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
        },
      })
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: "Bookings fetch failed", error });
  }
};

export const getOwnerBookings = async (req: AuthRequest, res: Response) => {
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
    }).select("_id");

    const scheduleIds = schedules.map((schedule) => schedule._id);

    const slots = await Slot.find({
      scheduleId: { $in: scheduleIds },
    }).select("_id");

    const slotIds = slots.map((slot) => slot._id);

    const bookings = await Booking.find({
      slotId: { $in: slotIds },
    })
      .populate("customerId", "name email phone")
      .populate({
        path: "slotId",
        populate: {
          path: "scheduleId",
          populate: [
            {
              path: "boatId",
              select: "boatName boatNumber capacity",
            },
            {
              path: "routeId",
              populate: [
                { path: "sourceGhatId", select: "name" },
                { path: "destinationGhatId", select: "name" },
              ],
            },
          ],
        },
      })
      .sort({ createdAt: -1 });

    // console.log("Owner:", ownerId);
    // console.log("Boats:", boats.length);
    // console.log("Schedules:", schedules.length);
    // console.log("Slots:", slots.length);
    // console.log("Bookings:", bookings.length);

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({
      message: "Owner bookings fetch failed",
      error,
    });
  }
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customerId", "name email phone")
      .populate({
        path: "slotId",
        populate: {
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
        },
      });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    return res.json(booking);
  } catch (error) {
    return res.status(500).json({ message: "Booking fetch failed", error });
  }
};

export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const { search, status, paymentStatus, type, page = "1", limit = "10" } = req.query;

    const query: any = {};

    if (status) {
      query.bookingStatus = status;
    }
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }
    if (type) {
      query.bookingType = type;
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;

    if (search) {
      query.$or = [
        { bookingCode: { $regex: search, $options: "i" } },
        { passengerName: { $regex: search, $options: "i" } },
        { passengerPhone: { $regex: search, $options: "i" } },
      ];
    }

    const bookings = await Booking.find(query)
      .populate("customerId", "name email phone")
      .populate({
        path: "slotId",
        populate: {
          path: "scheduleId",
          populate: [
            { path: "boatId", select: "boatName boatNumber capacity ownerId", populate: { path: "ownerId", select: "name" } },
            {
              path: "routeId",
              populate: [
                { path: "sourceGhatId", select: "name" },
                { path: "destinationGhatId", select: "name" },
              ],
            },
          ],
        },
      })
      .sort({ createdAt: -1 })
      .skip(skipNum)
      .limit(limitNum);

    const total = await Booking.countDocuments(query);

    return res.json({
      success: true,
      bookings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Bookings fetch failed", error });
  }
};

export const checkInBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { bookingCode: req.params.bookingCode },
      { checkInStatus: "CHECKED_IN" },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    return res.json({
      message: "Passenger checked in successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({ message: "Check-in failed", error });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.bookingStatus === "CANCELLED") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    const slot = await Slot.findById(booking.slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    if (booking.bookingType === "ONLINE") {
      slot.bookedOnlineSeats = Math.max(
        0,
        slot.bookedOnlineSeats - booking.seatsBooked
      );
    } else if (booking.bookingType === "OFFLINE") {
      slot.bookedOfflineSeats = Math.max(
        0,
        slot.bookedOfflineSeats - booking.seatsBooked
      );
    } else if (booking.bookingType === "EMERGENCY") {
      slot.bookedEmergencySeats = Math.max(
        0,
        slot.bookedEmergencySeats - booking.seatsBooked
      );
    }

    if (slot.status === "FULL") slot.status = "OPEN";
    await slot.save();

    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }

    const { reason = "Cancelled", cancelledBy: bodyCancelledBy, refundMethod = "WALLET" } = req.body;
    let cancelledBy: "CUSTOMER" | "OWNER" | "ADMIN" | "WEATHER" | "BREAKDOWN" = "CUSTOMER";
    let refundPercent = 100;

    if (req.user.role === "CUSTOMER") {
      cancelledBy = "CUSTOMER";
      const populatedSlot: any = await Slot.findById(booking.slotId).populate("scheduleId");
      if (populatedSlot && populatedSlot.scheduleId) {
        const departureTimeStr = populatedSlot.scheduleId.departureTime || "00:00";
        const departureDateTime = getDepartureDateTime(populatedSlot.slotDate, departureTimeStr);
        const now = new Date();
        const msDiff = departureDateTime.getTime() - now.getTime();
        const hoursDiff = msDiff / (1000 * 60 * 60);

        if (hoursDiff > (settings.freeCancellationHours ?? 12)) {
          refundPercent = 100;
        } else if (hoursDiff >= (settings.partialRefundHours ?? 2)) {
          refundPercent = settings.partialRefundPercentage ?? 50;
        } else {
          refundPercent = 0;
        }
      }
    } else {
      // Owner or Admin cancellation is always 100% refund
      refundPercent = 100;
      if (req.user.role === "BOAT_OWNER") {
        cancelledBy = bodyCancelledBy || "OWNER";
      } else {
        cancelledBy = bodyCancelledBy || "ADMIN";
      }
    }

    booking.bookingStatus = "CANCELLED";
    booking.cancelledAt = new Date();
    booking.cancellationReason = reason;
    booking.cancelledBy = cancelledBy;

    const refundAmount = Math.round(((booking.totalAmount || 0) * refundPercent) / 100);
    booking.refundAmount = refundAmount;
    booking.refundPercentage = refundPercent;
    booking.refundReason = `Cancellation by ${cancelledBy}: ${reason}`;

    if (booking.paymentStatus === "PAID" && refundAmount > 0) {
      booking.refundStatus = "PENDING"; // Auto create refund request in PENDING state
      booking.cancellationRequestedAt = new Date();
      booking.expectedRefundDate = new Date(Date.now() + 7 * 24 * 3600 * 1000);
      if (req.user.role !== "CUSTOMER") {
        booking.ownerRespondedAt = new Date();
        booking.ownerRemark = `Emergency Cancellation (${cancelledBy}): ${reason}`;
      }
    } else {
      booking.refundStatus = "NONE";
    }

    await booking.save();

    return res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Booking cancellation failed",
      error: error.message,
    });
  }
};

export const createOfflineBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { slotId, seatsBooked, passengerName, passengerPhone } = req.body;

    const slot: any = await Slot.findById(slotId).populate({
      path: "scheduleId",
      populate: { path: "routeId" },
    });

    if (!slot) return res.status(404).json({ message: "Slot not found" });

    const availableOfflineSeats = slot.offlineSeats - slot.bookedOfflineSeats;

    if (availableOfflineSeats < seatsBooked) {
      return res.status(400).json({
        message: "Not enough offline seats available",
        availableOfflineSeats,
      });
    }

    const route = slot.scheduleId?.routeId;

    slot.bookedOfflineSeats += seatsBooked;
    await slot.save();

    const booking = await Booking.create({
      customerId: req.user._id,
      slotId,
      seatsBooked,
      totalAmount: seatsBooked * route.baseFare,
      bookingCode: `WBB-OFF-${Date.now()}`,
      passengerName,
      passengerPhone,
      bookingType: "OFFLINE",
      paymentStatus: "PAID",
    });

    const qrCode = await createQrCode(booking);

    return res.status(201).json({
      message: "Offline booking created successfully",
      booking,
      qrCode,
      availableOfflineSeats: slot.offlineSeats - slot.bookedOfflineSeats,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Offline booking failed",
      error,
    });
  }
};

export const createEmergencyBooking = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { slotId, seatsBooked, passengerName, passengerPhone, reason } =
      req.body;

    const slot: any = await Slot.findById(slotId).populate({
      path: "scheduleId",
      populate: { path: "routeId" },
    });

    if (!slot) return res.status(404).json({ message: "Slot not found" });

    const availableEmergencySeats =
      slot.emergencySeats - slot.bookedEmergencySeats;

    if (availableEmergencySeats < seatsBooked) {
      return res.status(400).json({
        message: "Not enough emergency seats available",
        availableEmergencySeats,
      });
    }

    const route = slot.scheduleId?.routeId;

    slot.bookedEmergencySeats += seatsBooked;
    await slot.save();

    const booking = await Booking.create({
      customerId: req.user._id,
      slotId,
      seatsBooked,
      totalAmount: seatsBooked * route.baseFare,
      bookingCode: `WBB-EMG-${Date.now()}`,
      passengerName,
      passengerPhone,
      bookingType: "EMERGENCY",
      paymentStatus: "PAID",
      cancellationReason: reason || null,
    });

    const qrCode = await createQrCode(booking);

    return res.status(201).json({
      message: "Emergency booking created successfully",
      booking,
      qrCode,
      availableEmergencySeats:
        slot.emergencySeats - slot.bookedEmergencySeats,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Emergency booking failed",
      error,
    });
  }
};

export const verifyTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingCode } = req.body;

    const booking = await Booking.findOne({ bookingCode });

    if (!booking) return res.status(404).json({ message: "Invalid ticket" });

    if (booking.bookingStatus !== "CONFIRMED") {
      return res.status(400).json({ message: "Ticket is not active" });
    }

    if (booking.checkInStatus === "CHECKED_IN") {
      return res.status(400).json({ message: "Ticket already checked in" });
    }

    booking.checkInStatus = "CHECKED_IN";
    await booking.save();

    return res.json({
      message: "Ticket verified successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Ticket verification failed",
      error,
    });
  }
};

export const markNoShowBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.bookingStatus === "CANCELLED") {
      return res.status(400).json({ message: "Cancelled booking cannot be marked no-show" });
    }

    if (booking.bookingStatus === "COMPLETED") {
      return res.status(400).json({ message: "Completed booking cannot be marked no-show" });
    }

    booking.checkInStatus = "NO_SHOW";
    await booking.save();

    return res.json({
      message: "Booking marked as no-show",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      message: "No-show update failed",
      error,
    });
  }
};

export const completeBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.bookingStatus === "CANCELLED") {
      return res.status(400).json({ message: "Cancelled booking cannot be completed" });
    }

    if (booking.checkInStatus !== "CHECKED_IN") {
      return res.status(400).json({
        message: "Passenger must be checked-in before completing booking",
      });
    }

    booking.bookingStatus = "COMPLETED";
    await booking.save();

    return res.json({
      message: "Booking completed successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Booking completion failed",
      error,
    });
  }
};

export const rescheduleBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { newSlotId } = req.body;
    const bookingId = req.params.id;

    if (!newSlotId) {
      return res.status(400).json({ message: "newSlotId is required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.bookingStatus === "CANCELLED" || booking.bookingStatus === "COMPLETED") {
      return res.status(400).json({ message: "Cannot reschedule cancelled or completed bookings" });
    }

    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }

    const maxReschedules = settings.maxReschedules ?? 3;
    if ((booking.rescheduleCount || 0) >= maxReschedules) {
      return res.status(400).json({ message: `Maximum reschedule limit of ${maxReschedules} reached` });
    }

    const oldSlot = await Slot.findById(booking.slotId);
    const newSlot: any = await Slot.findById(newSlotId).populate({
      path: "scheduleId",
      populate: { path: "routeId" }
    });

    if (!newSlot) {
      return res.status(404).json({ message: "New slot not found" });
    }

    if (newSlot.status !== "OPEN") {
      return res.status(400).json({ message: "Selected new slot is not available for bookings" });
    }

    const availableSeats = newSlot.onlineSeats - newSlot.bookedOnlineSeats;
    if (availableSeats < booking.seatsBooked) {
      return res.status(400).json({ message: "Not enough seats available in selected slot" });
    }

    const fee = settings.rescheduleFee ?? 50;
    if (fee > 0) {
      const customer = await User.findById(booking.customerId);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      let wallet = await Wallet.findOne({ userId: booking.customerId });
      if (!wallet) {
        wallet = await Wallet.create({ userId: booking.customerId, balance: 0 });
      }

      if (wallet.balance < fee) {
        return res.status(400).json({ message: `Insufficient wallet balance to pay reschedule fee of ₹${fee}. Current balance: ₹${wallet.balance}` });
      }

      wallet.balance -= fee;
      await wallet.save();

      customer.walletBalance = wallet.balance;
      await customer.save();

      await WalletTransaction.create({
        userId: booking.customerId,
        amount: fee,
        type: "DEBIT",
        purpose: "BOOKING_PAYMENT",
        status: "SUCCESS",
        bookingId: booking._id,
        title: "Reschedule Fee",
        description: `Charged ₹${fee} reschedule fee for booking ${booking.bookingCode || booking._id}`
      });
    }

    if (oldSlot) {
      if (booking.bookingType === "ONLINE") {
        oldSlot.bookedOnlineSeats = Math.max(0, oldSlot.bookedOnlineSeats - booking.seatsBooked);
      } else if (booking.bookingType === "OFFLINE") {
        oldSlot.bookedOfflineSeats = Math.max(0, oldSlot.bookedOfflineSeats - booking.seatsBooked);
      } else if (booking.bookingType === "EMERGENCY") {
        oldSlot.bookedEmergencySeats = Math.max(0, oldSlot.bookedEmergencySeats - booking.seatsBooked);
      }
      if (oldSlot.status === "FULL") oldSlot.status = "OPEN";
      await oldSlot.save();
    }

    newSlot.bookedOnlineSeats += booking.seatsBooked;
    if (newSlot.bookedOnlineSeats >= newSlot.onlineSeats) {
      newSlot.status = "FULL";
    }
    await newSlot.save();

    booking.slotId = newSlotId;
    booking.rescheduleCount = (booking.rescheduleCount || 0) + 1;
    await booking.save();
    await createQrCode(booking);

    return res.status(200).json({
      message: "Booking rescheduled successfully",
      booking
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Rescheduling booking failed",
      error: error.message
    });
  }
};

export const getPendingRefunds = async (req: AuthRequest, res: Response) => {
  try {
    let query: any = { refundStatus: "PENDING" };
    if (req.user.role === "SUPER_ADMIN") {
      query = { refundStatus: { $in: ["VERIFIED", "APPROVED", "PROCESSING"] } };
    }
    const refunds = await Booking.find(query)
      .populate("customerId", "name email phone")
      .populate({
        path: "slotId",
        populate: {
          path: "scheduleId",
          populate: [
            { path: "boatId", select: "boatName ownerId", populate: { path: "ownerId", select: "name" } },
            { path: "routeId", populate: [{ path: "sourceGhatId", select: "name" }, { path: "destinationGhatId", select: "name" }] }
          ]
        }
      })
      .sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, refunds });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch pending refunds", error: error.message });
  }
};

export const approveRefund = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const { refundAmount, remark, action } = req.body;

    if (refundAmount !== undefined) {
      booking.refundAmount = Number(refundAmount);
      booking.refundPercentage = Math.round((Number(refundAmount) / (booking.totalAmount || 1)) * 100);
    }

    if (req.user.role === "CITY_AUTHORITY") {
      if (booking.refundStatus !== "PENDING") {
        return res.status(400).json({ message: "Refund is not pending authority review" });
      }
      booking.refundStatus = "VERIFIED";
      booking.authorityRemark = remark || "Verified and approved by City Authority";
    } else if (req.user.role === "SUPER_ADMIN") {
      const targetAction = action || (booking.refundStatus === "VERIFIED" ? "FINAL_APPROVE" : booking.refundStatus === "APPROVED" ? "PROCESS" : "COMPLETE");
      
      if (targetAction === "FINAL_APPROVE") {
        booking.refundStatus = "APPROVED";
        booking.authorityRemark = remark || booking.authorityRemark || "Final approved by Super Admin";
      } else if (targetAction === "PROCESS") {
        booking.refundStatus = "PROCESSING";
      } else if (targetAction === "COMPLETE") {
        booking.refundStatus = "COMPLETED";
        booking.paymentStatus = "REFUNDED";
        booking.refundProcessedAt = new Date();

        const customer = await User.findById(booking.customerId);
        if (customer) {
          customer.walletBalance = (customer.walletBalance || 0) + (booking.refundAmount || 0);
          await customer.save();

          let wallet = await Wallet.findOne({ userId: booking.customerId });
          if (!wallet) {
            wallet = await Wallet.create({ userId: booking.customerId, balance: 0 });
          }
          wallet.balance = customer.walletBalance;
          await wallet.save();

          const transaction = await WalletTransaction.create({
            userId: booking.customerId,
            amount: booking.refundAmount || 0,
            type: "REFUND",
            purpose: "REFUND",
            bookingId: booking._id,
            title: "Booking Refund Success",
            description: remark || booking.authorityRemark || `Super Admin processed refund of ₹${booking.refundAmount} for booking ${booking.bookingCode || booking._id}`,
            status: "SUCCESS"
          });

          booking.walletTransactionId = transaction._id.toString();
        }
      } else {
        return res.status(400).json({ message: `Invalid refund action: ${targetAction}` });
      }
    } else {
      return res.status(453).json({ message: "Unauthorized role for refund approvals" });
    }

    await booking.save();
    return res.status(200).json({ message: "Refund processed successfully", booking });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to process refund approval", error: error.message });
  }
};

export const rejectRefund = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const { reason = "Refund request rejected" } = req.body;
    booking.refundStatus = "REJECTED";
    booking.authorityRemark = reason;
    booking.refundReason = reason;
    await booking.save();

    return res.status(200).json({ message: "Refund rejected successfully", booking });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to reject refund", error: error.message });
  }
};

export const getCancellationLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await Booking.find({ bookingStatus: "CANCELLED" })
      .populate("customerId", "name email phone")
      .populate({
        path: "slotId",
        populate: {
          path: "scheduleId",
          populate: [
            { path: "boatId", select: "boatName" },
            { path: "routeId", populate: [{ path: "sourceGhatId", select: "name" }, { path: "destinationGhatId", select: "name" }] }
          ]
        }
      })
      .sort({ cancelledAt: -1 });

    return res.status(200).json({ success: true, logs });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch cancellation logs", error: error.message });
  }
};

export const getRefundLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await Booking.find({ refundStatus: { $in: ["COMPLETED", "FAILED"] } })
      .populate("customerId", "name email phone")
      .populate({
        path: "slotId",
        populate: {
          path: "scheduleId",
          populate: [
            { path: "boatId", select: "boatName" },
            { path: "routeId", populate: [{ path: "sourceGhatId", select: "name" }, { path: "destinationGhatId", select: "name" }] }
          ]
        }
      })
      .sort({ refundProcessedAt: -1 });

    return res.status(200).json({ success: true, logs });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch refund logs", error: error.message });
  }
};

export const ownerRespondCancellation = async (req: AuthRequest, res: Response) => {
  try {
    const { approve, remark, cancelledBy } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.bookingStatus !== "CANCELLED" || booking.refundStatus !== "PENDING") {
      return res.status(400).json({ message: "Booking does not have a pending cancellation request" });
    }

    booking.ownerRemark = remark || (approve ? "Approved by owner" : "Rejected by owner");
    booking.ownerRespondedAt = new Date();

    if (approve) {
      booking.refundStatus = "UNDER_REVIEW";
      if (cancelledBy && ["WEATHER", "BREAKDOWN", "OWNER"].includes(cancelledBy)) {
        booking.cancelledBy = cancelledBy;
        booking.refundAmount = booking.totalAmount; // Emergency is 100% refund
        booking.refundPercentage = 100;
      }
    } else {
      booking.refundStatus = "REJECTED";
    }

    await booking.save();
    return res.status(200).json({ message: "Owner response saved successfully", booking });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to save owner response", error: error.message });
  }
};

export const getOwnerRefundRequests = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = await getOwnerId(req);
    if (!ownerId) {
      return res.status(403).json({ message: "Owner not linked" });
    }

    const boats = await Boat.find({ ownerId }).select("_id");
    const queryBoatIds = boats.map((boat) => boat._id);

    const schedules = await Schedule.find({
      boatId: { $in: queryBoatIds },
    }).select("_id");
    const scheduleIds = schedules.map((schedule) => schedule._id);

    const slots = await Slot.find({
      scheduleId: { $in: scheduleIds },
    }).select("_id");
    const slotIds = slots.map((slot) => slot._id);

    const requests = await Booking.find({
      slotId: { $in: slotIds },
      bookingStatus: "CANCELLED",
      refundStatus: "PENDING"
    })
      .populate("customerId", "name email phone")
      .populate({
        path: "slotId",
        populate: {
          path: "scheduleId",
          populate: [
            { path: "boatId", select: "boatName" },
            { path: "routeId", populate: [{ path: "sourceGhatId", select: "name" }, { path: "destinationGhatId", select: "name" }] }
          ]
        }
      })
      .sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, requests });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch owner refund requests", error: error.message });
  }
};