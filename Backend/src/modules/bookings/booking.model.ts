import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },

    seatsBooked: {
      type: Number,
      required: true,
      min: 1,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    bookingStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
      default: "CONFIRMED",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
    },

    bookingCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    passengerName: {
      type: String,
      required: true,
      trim: true,
    },

    passengerPhone: {
      type: String,
      required: true,
      trim: true,
    },

    checkInStatus: {
      type: String,
      enum: ["PENDING", "CHECKED_IN", "NO_SHOW"],
      default: "PENDING",
    },

    cancellationReason: {
      type: String,
      default: null,
      trim: true,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    bookingType: {
      type: String,
      enum: ["ONLINE", "OFFLINE", "EMERGENCY"],
      default: "ONLINE",
    },

    qrCode: {
      type: String,
      default: null,
    },

    refundStatus: {
      type: String,
      enum: ["NONE", "PENDING", "UNDER_REVIEW", "VERIFIED", "APPROVED", "REJECTED", "PROCESSING", "COMPLETED", "FAILED"],
      default: "NONE",
    },

    refundAmount: {
      type: Number,
      default: 0,
    },

    refundReason: {
      type: String,
      default: null,
      trim: true,
    },

    cancelledBy: {
      type: String,
      enum: ["CUSTOMER", "OWNER", "ADMIN", "WEATHER", "BREAKDOWN"],
      default: null,
    },

    refundProcessedAt: {
      type: Date,
      default: null,
    },

    rescheduleCount: {
      type: Number,
      default: 0,
    },

    ownerRemark: {
      type: String,
      default: null,
      trim: true,
    },

    authorityRemark: {
      type: String,
      default: null,
      trim: true,
    },

    refundPercentage: {
      type: Number,
      default: 0,
    },

    expectedRefundDate: {
      type: Date,
      default: null,
    },

    walletTransactionId: {
      type: String,
      default: null,
      trim: true,
    },

    cancellationRequestedAt: {
      type: Date,
      default: null,
    },

    ownerRespondedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

bookingSchema.index({ customerId: 1, createdAt: -1 });
bookingSchema.index({ slotId: 1 });
bookingSchema.index({ bookingStatus: 1 });
bookingSchema.index({ paymentStatus: 1 });

export const Booking = mongoose.model("Booking", bookingSchema);