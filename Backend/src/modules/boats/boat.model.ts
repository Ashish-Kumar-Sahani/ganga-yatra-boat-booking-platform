import mongoose from "mongoose";

const boatSchema = new mongoose.Schema(
  {
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

    boatName: {
      type: String,
      required: true,
      trim: true,
    },

    boatNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    boatType: {
      type: String,
      enum: ["MANUAL", "MOTOR", "LUXURY", "CRUISE", "WATER_TAXI"],
      default: "MOTOR",
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    image: {
      type: String,
      default: null,
    },

    price: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      default: "",
    },

    permitVerified: {
      type: Boolean,
      default: false,
    },

    documents: {
      registrationNumber: {
        type: String,
        default: null,
        trim: true,
      },
      insuranceNumber: {
        type: String,
        default: null,
        trim: true,
      },
      permitNumber: {
        type: String,
        default: null,
        trim: true,
      },
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"],
      default: "PENDING",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

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

boatSchema.index({ ownerId: 1 });
boatSchema.index({ cityId: 1 });
boatSchema.index({ status: 1 });
boatSchema.index({ boatType: 1 });

export const Boat = mongoose.model("Boat", boatSchema);