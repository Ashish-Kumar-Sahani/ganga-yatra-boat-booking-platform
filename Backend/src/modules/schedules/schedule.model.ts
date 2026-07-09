import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    boatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
    },

    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },

    departureTime: {
      type: String,
      required: true,
      trim: true,
    },

    arrivalTime: {
      type: String,
      required: true,
      trim: true,
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

    scheduleType: {
      type: String,
      enum: ["DAILY", "WEEKLY", "SPECIAL"],
      default: "DAILY",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    weekDays: {
      type: [Number], // 0 = Sunday, 1 = Monday ... 6 = Saturday
      default: [],
    },

    specialDate: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

scheduleSchema.index({ boatId: 1 });
scheduleSchema.index({ routeId: 1 });
scheduleSchema.index({ startDate: 1, endDate: 1 });
scheduleSchema.index({ isActive: 1 });

export const Schedule = mongoose.model("Schedule", scheduleSchema);