import express from "express";
import {
  getCustomerProfile,
  updateCustomerProfile,
  getMyBookings,
  getBookingHistory,
  getUsers,
  updateUserStatus,
  updateUser,
  deleteUser,
  bulkUpdateStatus,
  bulkDeleteUsers
} from "./user.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
const router = express.Router();
router.get(
  "/",
  protect,
  allowRoles("SUPER_ADMIN", "CITY_AUTHORITY"),
  getUsers
);

router.patch(
  "/bulk-status",
  protect,
  allowRoles("SUPER_ADMIN"),
  bulkUpdateStatus
);

router.post(
  "/bulk-delete",
  protect,
  allowRoles("SUPER_ADMIN"),
  bulkDeleteUsers
);

router.patch(
  "/:id/status",
  protect,
  allowRoles("SUPER_ADMIN"),
  updateUserStatus
);

router.put(
  "/:id",
  protect,
  allowRoles("SUPER_ADMIN"),
  updateUser
);

router.delete(
  "/:id",
  protect,
  allowRoles("SUPER_ADMIN"),
  deleteUser
);

router.get("/profile", protect, getCustomerProfile);
router.put("/profile", protect, updateCustomerProfile);

router.get("/bookings", protect, getMyBookings);
router.get("/bookings/history", protect, getBookingHistory);

export default router;