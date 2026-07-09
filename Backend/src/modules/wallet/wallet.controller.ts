import { Response } from "express";
import crypto from "crypto";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { Wallet } from "./wallet.model.js";
import { WalletTransaction } from "../customer/walletTransaction.model.js";
import { User } from "../users/user.model.js";
import { Booking } from "../bookings/booking.model.js";
import { getRazorpayInstance } from "../../config/razorpay.js";

// Helper to ensure user has a wallet
const getOrCreateWallet = async (userId: string) => {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = await Wallet.create({ userId, balance: 0 });
  }
  return wallet;
};

export const getWalletMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const wallet = await getOrCreateWallet(userId);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Sync user's walletBalance with wallet database record
    if (user.walletBalance !== wallet.balance) {
      user.walletBalance = wallet.balance;
      await user.save();
    }

    // Calculate total spent on booking payments
    const transactions = await WalletTransaction.find({ userId, status: "SUCCESS" });
    const totalSpent = transactions
      .filter((t) => t.type === "DEBIT" && t.purpose === "BOOKING_PAYMENT")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return res.status(200).json({
      balance: wallet.balance,
      rewardPoints: user.rewardPoints || 0,
      totalSpent,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch wallet details",
      error: error.message,
    });
  }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const transactions = await WalletTransaction.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(transactions);
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};

export const createAddMoneyOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const razorpay = getRazorpayInstance();
    const amountInPaise = Math.round(Number(amount) * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `wallet_topup_${Date.now()}`,
    });

    // Create a pending transaction
    await WalletTransaction.create({
      userId,
      amount: Number(amount),
      type: "CREDIT",
      purpose: "ADD_MONEY",
      status: "PENDING",
      razorpayOrderId: order.id,
      title: "Wallet Top-up",
      description: `Recharging wallet with ₹${amount}`,
    });

    return res.status(200).json({
      key: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to create Razorpay order for wallet",
      error: error.message,
    });
  }
};

export const verifyAddMoney = async (req: AuthRequest, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing required verification fields" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      await WalletTransaction.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "FAILED", description: "Payment verification signature mismatch" }
      );
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const transaction = await WalletTransaction.findOne({
      razorpayOrderId: razorpay_order_id,
      status: "PENDING",
    });

    if (!transaction) {
      return res.status(404).json({ message: "Pending wallet transaction not found" });
    }

    // Mark transaction successful
    transaction.status = "SUCCESS";
    transaction.razorpayPaymentId = razorpay_payment_id;
    transaction.description = `Successfully added ₹${transaction.amount} via Razorpay`;
    await transaction.save();

    // Increment wallet balance
    const wallet = await getOrCreateWallet(userId);
    wallet.balance += transaction.amount;
    await wallet.save();

    // Increment user balance and reward points
    const user = await User.findById(userId);
    if (user) {
      user.walletBalance = wallet.balance;
      const points = Math.floor(transaction.amount / 100);
      user.rewardPoints = (user.rewardPoints || 0) + points;
      await user.save();
    }

    return res.status(200).json({
      message: "Wallet recharged successfully",
      balance: wallet.balance,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

export const payBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!bookingId) {
      return res.status(400).json({ message: "bookingId is required" });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      customerId: userId,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.bookingStatus === "CANCELLED") {
      return res.status(400).json({ message: "Cannot pay for a cancelled booking" });
    }

    if (booking.paymentStatus === "PAID") {
      return res.status(400).json({ message: "Booking is already paid" });
    }

    const wallet = await getOrCreateWallet(userId);
    const fare = booking.totalAmount || 0;

    if (wallet.balance < fare) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // Deduct from wallet
    wallet.balance -= fare;
    await wallet.save();

    // Update user balance & reward points
    const user = await User.findById(userId);
    if (user) {
      user.walletBalance = wallet.balance;
      const points = Math.floor(fare / 10);
      user.rewardPoints = (user.rewardPoints || 0) + points;
      await user.save();
    }

    // Create DEBIT transaction
    await WalletTransaction.create({
      userId,
      amount: fare,
      type: "DEBIT",
      purpose: "BOOKING_PAYMENT",
      status: "SUCCESS",
      bookingId: booking._id,
      title: "Ride Payment",
      description: `Debited ₹${fare} for booking code ${booking.bookingCode || booking._id}`,
    });

    // Update booking status
    booking.paymentStatus = "PAID";
    booking.bookingStatus = "CONFIRMED";
    await booking.save();

    return res.status(200).json({
      message: "Payment successful using wallet",
      balance: wallet.balance,
      booking,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Wallet payment failed",
      error: error.message,
    });
  }
};
