import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    systemName: { type: String, default: "GangaYatra" },
    systemEmail: { type: String, default: "support@gangayatra.com" },
    systemPhone: { type: String, default: "+91 99999 99999" },
    maintenanceMode: { type: Boolean, default: false },

    taxPercentage: { type: Number, default: 5 },
    serviceFee: { type: Number, default: 10 },
    refundPercentage: { type: Number, default: 80 },

    freeCancellationHours: { type: Number, default: 12 },
    partialRefundHours: { type: Number, default: 2 },
    partialRefundPercentage: { type: Number, default: 50 },
    noRefundWindow: { type: Number, default: 2 },
    walletRefundEnabled: { type: Boolean, default: true },
    originalPaymentRefundEnabled: { type: Boolean, default: true },
    maxReschedules: { type: Number, default: 3 },
    rescheduleFee: { type: Number, default: 50 },
    weatherPolicy: { type: String, default: "100% refund in case of bad weather conditions." },
    ownerCancellationPolicy: { type: String, default: "100% refund if the owner cancels the booking due to boat issues." },

    smtpHost: { type: String, default: "smtp.mailtrap.io" },
    smtpPort: { type: Number, default: 2525 },
    smtpUser: { type: String, default: "" },
    smtpPass: { type: String, default: "" },

    smsApiKey: { type: String, default: "" },
    smsSenderId: { type: String, default: "" },

    razorpayKeyId: { type: String, default: "" },
    razorpayKeySecret: { type: String, default: "" },

    cloudinaryCloudName: { type: String, default: "" },
    cloudinaryApiKey: { type: String, default: "" },
    cloudinaryApiSecret: { type: String, default: "" },

    primaryColor: { type: String, default: "#2563EB" },
    sidebarTheme: { type: String, enum: ["light", "dark"], default: "light" },
  },
  { timestamps: true }
);

export const Setting = mongoose.model("Setting", settingSchema);
