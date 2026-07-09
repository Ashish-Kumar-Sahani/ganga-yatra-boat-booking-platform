import express from "express";
import {
  createNotification,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "./notification.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/my-notifications",
  protect,
  getMyNotifications
);

router.get(
  "/",
  protect,
  getMyNotifications
);

router.post(
  "/",
  protect,
  allowRoles("SUPER_ADMIN", "CITY_AUTHORITY"),
  createNotification
);

router.patch(
  "/read-all",
  protect,
  markAllAsRead
);

router.patch(
  "/:id/read",
  protect,
  markAsRead
);

router.patch(
  "/mark-all-read",
  protect,
  markAllAsRead
);

router.delete(
  "/:id",
  protect,
  deleteNotification
);

export default router;