import mongoose from "mongoose";

const weatherAlertSchema = new mongoose.Schema(
  {
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    alertType: {
      type: String,
      enum: ["RAIN", "STORM", "FLOOD", "HIGH_WATER_LEVEL", "OTHER"],
      required: true,
    },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "LOW",
    },
    message: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const WeatherAlert = mongoose.model(
  "WeatherAlert",
  weatherAlertSchema
);