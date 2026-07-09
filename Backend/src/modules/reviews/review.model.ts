import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },

    boatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    boatRating: {
      type: Number,
      default: 5,
    },

    captainRating: {
      type: Number,
      default: 5,
    },

    tripRating: {
      type: Number,
      default: 5,
    },

    ownerRating: {
      type: Number,
      default: 5,
    },

    comment: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);