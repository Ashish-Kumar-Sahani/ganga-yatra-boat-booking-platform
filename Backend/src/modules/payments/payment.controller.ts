import type { Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { Booking } from "../bookings/booking.model.js";
import { getRazorpayInstance } from "../../config/razorpay.js";
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID || "",
//   key_secret: process.env.RAZORPAY_KEY_SECRET || "",
// });

export const createRazorpayOrder = async (
  req: AuthRequest,
  res: Response
) => {
  const razorpay = getRazorpayInstance();
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "bookingId is required" });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      customerId: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.bookingStatus === "CANCELLED") {
      return res.status(400).json({
        message: "Cancelled booking cannot be paid",
      });
    }

    if (booking.paymentStatus === "PAID") {
      return res.status(400).json({
        message: "Booking already paid",
      });
    }

    const amountInPaise = Math.round(Number(booking.totalAmount || 0) * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: String(booking.bookingCode || booking._id).slice(0, 40),
      notes: {
        bookingId: String(booking._id),
        bookingCode: booking.bookingCode || "",
      },
    });

    return res.status(200).json({
      key: process.env.RAZORPAY_KEY_ID,
      order,
      booking: {
        _id: booking._id,
        bookingCode: booking.bookingCode,
        passengerName: booking.passengerName,
        passengerPhone: booking.passengerPhone,
        totalAmount: booking.totalAmount,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Razorpay order creation failed",
      error: error.message,
    });
  }
};

export const verifyRazorpayPayment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !bookingId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message: "Missing Razorpay payment verification fields",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Invalid payment signature",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      customerId: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.paymentStatus = "PAID";
    booking.bookingStatus = "CONFIRMED";
    await booking.save();

    return res.status(200).json({
      message: "Payment verified successfully",
      bookingCode: booking.bookingCode,
      booking,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

export const getPaymentByBooking = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.json({
      bookingId: booking._id,
      bookingCode: booking.bookingCode,
      amount: booking.totalAmount,
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.bookingStatus,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Payment fetch failed",
      error: error.message,
    });
  }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const { search, status, page = "1", limit = "10" } = req.query;

    const query: any = {};

    if (status) {
      if (status === "REFUND_PENDING") {
        query.refundStatus = "PENDING";
      } else if (status === "REFUND_VERIFIED") {
        query.refundStatus = "VERIFIED";
      } else if (status === "REFUND_APPROVED") {
        query.refundStatus = "APPROVED";
      } else if (status === "REFUND_PROCESSING") {
        query.refundStatus = "PROCESSING";
      } else if (status === "REFUND_COMPLETED") {
        query.refundStatus = "COMPLETED";
      } else {
        query.paymentStatus = status;
      }
    }
    if (search) {
      query.$or = [
        { bookingCode: { $regex: search, $options: "i" } },
        { passengerName: { $regex: search, $options: "i" } },
        { passengerPhone: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;

    const bookings = await Booking.find(query)
      .populate("customerId", "name email phone")
      .populate({
        path: "slotId",
        populate: {
          path: "scheduleId",
          populate: { path: "boatId", select: "boatName" }
        }
      })
      .sort({ createdAt: -1 })
      .skip(skipNum)
      .limit(limitNum);

    const total = await Booking.countDocuments(query);

    const allBookings = await Booking.find();
    const paidBookings = allBookings.filter((b) => b.paymentStatus === "PAID");
    const pendingBookings = allBookings.filter((b) => b.paymentStatus === "PENDING");
    const refundedBookings = allBookings.filter((b) => b.paymentStatus === "REFUNDED");

    const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const pendingRevenue = pendingBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const refundedRevenue = refundedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const methodSplits = {
      online: allBookings
        .filter((b) => b.bookingType === "ONLINE" && b.paymentStatus === "PAID")
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
      offline: allBookings
        .filter((b) => b.bookingType === "OFFLINE" && b.paymentStatus === "PAID")
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
      emergency: allBookings
        .filter((b) => b.bookingType === "EMERGENCY" && b.paymentStatus === "PAID")
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
    };

    res.json({
      success: true,
      transactions: bookings,
      analytics: {
        totalRevenue,
        pendingRevenue,
        refundedRevenue,
        paidCount: paidBookings.length,
        pendingCount: pendingBookings.length,
        refundedCount: refundedBookings.length,
        methodSplits,
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Transactions fetch failed",
      error: error.message,
    });
  }
};