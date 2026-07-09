import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: { type: String, trim: true, default: "" },

    city: { type: String, trim: true, default: "" },

    address: { type: String, trim: true, default: "" },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: [
  "CUSTOMER",
  "BOAT_OWNER",
  "MANAGER",
  "DRIVER",
  "CAPTAIN",
  "HELPER",
  "CITY_AUTHORITY",
  "SUPER_ADMIN",
],
      default: "CUSTOMER",
    },

    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      default: null,
    },
    resetOtp: String,
    resetOtpExpire: Date,
    resetOtpVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: Date,
    otpHash: {
      type: String,
      select: false,
    },
    otpExpire: Date,
    otpAttempts: {
      type: Number,
      default: 0,
    },
    passwordChangedAt: Date,
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    // Links MANAGER, DRIVER, CAPTAIN, HELPER to their parent BOAT_OWNER
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Links DRIVER, CAPTAIN, HELPER to their specific assigned boat for access restrictions
    assignedBoatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      default: null,
    },

    profileImage: { type: String, default: "" },

    isActive: { type: Boolean, default: true },

    walletBalance: { type: Number, default: 0 },
    rewardPoints: { type: Number, default: 0 },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Boat", default: [] }],

    department: { type: String, default: "" },
    designation: { type: String, default: "" },
    employeeCode: { type: String, default: "" },
    permissions: { type: [String], default: [] },
  },
  { timestamps: true }
);


export const User = mongoose.model("User", userSchema);