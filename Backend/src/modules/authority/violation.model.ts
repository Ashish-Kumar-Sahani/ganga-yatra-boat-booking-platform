import mongoose from "mongoose";

const violationSchema = new mongoose.Schema(
  {
    boatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      default: null,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    violationType: {
      type: String,
      enum: [
        "OVER_CAPACITY",
        "INVALID_PERMIT",
        "UNSAFE_OPERATION",
        "ROUTE_VIOLATION",
        "NIGHT_OPERATION_WITHOUT_PERMISSION",
        "DOCUMENT_EXPIRED",
        "STAFF_LICENSE_INVALID",
        "CUSTOMER_COMPLAINT",
        "EMERGENCY_RULE_BREACH",
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },
    status: {
      type: String,
      enum: ["OPEN", "UNDER_REVIEW", "RESOLVED", "PENALTY_ISSUED", "CLOSED"],
      default: "OPEN",
    },
    penaltyAmount: {
      type: Number,
      default: 0,
    },
    penaltyPaid: {
      type: Boolean,
      default: false,
    },
    reportedBy: {
      type: String,
      default: "City Authority",
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolutionNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

violationSchema.index({ boatId: 1 });
violationSchema.index({ cityId: 1 });
violationSchema.index({ status: 1 });
violationSchema.index({ violationType: 1 });

export const Violation = mongoose.model("Violation", violationSchema);
export default Violation;
