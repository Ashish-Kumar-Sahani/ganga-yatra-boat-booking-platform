import express from "express";
import {
  checkIn,
  checkOut,
  getTodayStatus,
  getOwnerAttendance,
} from "./attendance.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/check-in",
  protect,
  allowRoles("DRIVER", "CAPTAIN", "HELPER", "MANAGER"),
  checkIn
);

router.post(
  "/check-out",
  protect,
  allowRoles("DRIVER", "CAPTAIN", "HELPER", "MANAGER"),
  checkOut
);

router.get(
  "/today",
  protect,
  allowRoles("DRIVER", "CAPTAIN", "HELPER", "MANAGER"),
  getTodayStatus
);

router.get(
  "/owner",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "SUPER_ADMIN"),
  getOwnerAttendance
);

export default router;
