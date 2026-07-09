import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    boatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
    },

    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },

    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
    sosActive: {
    type: Boolean,
    default: false
},

    currentLatitude: Number,
    currentLongitude: Number,

    tripStatus: {
      type: String,
      enum: [
        "NOT_STARTED",
        "STARTED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED"
      ],
      default: "NOT_STARTED",
    },

    startedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

export const Trip = mongoose.model(
  "Trip",
  tripSchema
);