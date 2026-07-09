import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },

    sourceGhatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ghat",
      required: true,
    },

    destinationGhatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ghat",
      required: true,
    },

    distanceKm: { type: Number, required: true },
    estimatedDurationMinutes: { type: Number, required: true },

    baseFare: { type: Number, required: true },
    nightFare: { type: Number, default: 0 },
    weekendFare: { type: Number, default: 0 },
    festivalFare: { type: Number, default: 0 },

    approvalStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"],
      default: "PENDING",
    },

    isActive: { type: Boolean, default: true },
    safetyNote: { type: String, default: "" },
    approvalNote: { type: String, default: "" },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    suspendedReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Route = mongoose.model("Route", routeSchema);