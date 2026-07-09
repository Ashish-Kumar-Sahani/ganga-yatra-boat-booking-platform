import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "BOOKING",
        "PAYMENT",
        "SCHEDULE",
        "ROUTE",
        "SYSTEM"
      ],
      default: "SYSTEM",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    priority: {
      type: String,
      enum: ["LOW", "HIGH", "EMERGENCY"],
      default: "LOW",
    }
  },
  { timestamps: true }
);

export const Notification = mongoose.model(
    "Notification",
    notificationSchema
);