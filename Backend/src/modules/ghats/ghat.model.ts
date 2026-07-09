import mongoose from "mongoose";

const ghatSchema = new mongoose.Schema(
  {
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },

    name: { type: String, required: true },

    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Ghat = mongoose.model("Ghat", ghatSchema);