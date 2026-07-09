import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },

    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FLAT"],
      required: true,
    },

    discountValue: { type: Number, required: true },

    maxDiscountAmount: { type: Number, default: 0 },

    minBookingAmount: { type: Number, default: 0 },

    validFrom: { type: Date, required: true },
    validTill: { type: Date, required: true },

    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      default: null,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Offer = mongoose.model("Offer", offerSchema);