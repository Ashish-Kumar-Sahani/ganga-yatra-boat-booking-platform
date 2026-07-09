import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },

    slotDate: {
      type: Date,
      required: true,
    },

    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },

    onlineSeats: {
      type: Number,
      required: true,
      min: 0,
    },

    offlineSeats: {
      type: Number,
      required: true,
      min: 0,
    },

    emergencySeats: {
      type: Number,
      default: 0,
      min: 0,
    },

    bookedOnlineSeats: {
      type: Number,
      default: 0,
      min: 0,
    },

    bookedOfflineSeats: {
      type: Number,
      default: 0,
      min: 0,
    },

    bookedEmergencySeats: {
      type: Number,
      default: 0,
      min: 0,
    },

    autoOfflineEnabled: {
      type: Boolean,
      default: true,
    },

    offlineTransferAfterHours: {
      type: Number,
      default: 6,
    },

    transferredOnlineToOfflineSeats: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["OPEN", "FULL", "CANCELLED", "EXPIRED"],
      default: "OPEN",
    },

    cancellationReason: {
      type: String,
      default: null,
    },

    expiredAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

slotSchema.index({ scheduleId: 1 });
slotSchema.index({ slotDate: 1 });
slotSchema.index({ status: 1 });
slotSchema.index({ scheduleId: 1, slotDate: 1 }, { unique: true });

export const Slot = mongoose.model("Slot", slotSchema);