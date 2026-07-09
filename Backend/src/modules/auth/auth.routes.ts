import express from "express";
import {
  login,
  register,
  forgotPassword,
  verifyOtp,
  resetPassword,
  updateProfile,
  updateProfileImage,
  changePassword,
} from "./auth.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { rateLimiter } from "../../middlewares/rateLimit.middleware.js";

const router = express.Router();

// Define limiters for sensitive endpoints (5 requests per minute, verify-otp allows 10)
const authLimiter = rateLimiter(5, 60 * 1000);
const otpLimiter = rateLimiter(10, 60 * 1000);

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/verify-otp", otpLimiter, verifyOtp);
router.post("/reset-password", authLimiter, resetPassword);

router.get("/me", protect, (req: any, res) => {
  const user = req.user;
  res.json({
    message: "Profile fetched",
    user: {
      id: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      cityId: user.cityId,
      ownerId: user.ownerId,
      assignedBoatId: user.assignedBoatId,
      profileImage: user.profileImage,
      isActive: user.isActive,
      permissions: user.permissions,
    },
  });
});

router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.patch("/profile-image", protect, upload.single("image"), updateProfileImage);

export default router;