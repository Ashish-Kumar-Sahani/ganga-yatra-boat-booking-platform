import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    boatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      default: null,
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      default: null,
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    complaintType: {
      type: String,
      enum: [
        "SAFETY",
        "OVERCHARGING",
        "STAFF_BEHAVIOR",
        "BOAT_CONDITION",
        "ROUTE_PROBLEM",
        "PAYMENT",
        "EMERGENCY",
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "IN_REVIEW", "RESOLVED", "REJECTED"],
      default: "OPEN",
    },
    authorityNote: {
      type: String,
      default: "",
    },
    linkedViolationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Violation",
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

complaintSchema.index({ boatId: 1 });
complaintSchema.index({ cityId: 1 });
complaintSchema.index({ status: 1 });

export const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
