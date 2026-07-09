import mongoose from "mongoose";

const inspectionSchema = new mongoose.Schema(
  {
    boatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    inspectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    inspectorName: {
      type: String,
      required: true,
      trim: true,
    },
    checklist: {
      lifeJacketsAvailable: { type: Boolean, default: false },
      fireExtinguisherAvailable: { type: Boolean, default: false },
      firstAidKitAvailable: { type: Boolean, default: false },
      boatFitnessCondition: { type: Boolean, default: false },
      engineCondition: { type: Boolean, default: false },
      navigationLight: { type: Boolean, default: false },
      overloadingRisk: { type: Boolean, default: false },
      emergencyContactVisible: { type: Boolean, default: false },
      crewLicenseVerified: { type: Boolean, default: false },
      insuranceVerified: { type: Boolean, default: false },
      permitVerified: { type: Boolean, default: false },
    },
    result: {
      type: String,
      enum: ["PASS", "WARNING", "FAIL"],
      default: "PASS",
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    remarks: {
      type: String,
      default: "",
    },
    nextInspectionDueDate: {
      type: Date,
      required: true,
    },
    photoUrl: {
      type: String,
      default: null,
    },
    certificateUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

inspectionSchema.index({ boatId: 1 });
inspectionSchema.index({ cityId: 1 });
inspectionSchema.index({ result: 1 });

export const Inspection = mongoose.model("Inspection", inspectionSchema);
export default Inspection;
