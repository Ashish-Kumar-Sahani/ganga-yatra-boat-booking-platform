import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    // Links the staff profile to the BOAT_OWNER
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Links the staff profile to the login User account
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    permissions: {
      type: [String],
      default: [],
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

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    role: {
      type: String,
      enum: ["MANAGER", "DRIVER", "CAPTAIN", "HELPER"],
      default: "DRIVER",
    },

    assignedBoatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      default: null,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

staffSchema.index({ ownerId: 1 });
staffSchema.index({ assignedBoatId: 1 });

export const Staff = mongoose.model("Staff", staffSchema);