import mongoose from "mongoose";

const permitSchema = new mongoose.Schema(
  {
    boatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    permitNumber: { type: String, required: true },
    allowedRoutes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route",
      },
    ],
    permitType: {
      type: String,
      enum: [
        "BOAT_PERMIT",
        "ROUTE_PERMIT",
        "FESTIVAL_PERMIT",
        "TEMPORARY_PERMIT",
        "NIGHT_OPERATION_PERMIT",
        "SAFETY_CLEARANCE",
      ],
      default: "BOAT_PERMIT",
    },
    validFrom: { type: Date, required: true },
    validTill: { type: Date, required: true },
    status: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "EXPIRED",
        "SUSPENDED",
        "RENEWAL_REQUIRED",
      ],
      default: "PENDING",
    },
    documentUrl: { type: String, default: null },
    remarks: { type: String, default: null },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewNote: {
      type: String,
      default: "",
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

export const Permit = mongoose.model("Permit", permitSchema);