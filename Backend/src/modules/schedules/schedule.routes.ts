import express from "express";

import {
  createSchedule,
  getSchedules,
  getSchedulesByRoute,
  updateScheduleStatus,
  updateSchedule,
  getOwnerSchedules,
  deleteSchedule,
} from "./schedule.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import { validatePermit } from "../../middlewares/permit.middleware.js";

const router = express.Router();

router.get("/", getSchedules);

router.get(
  "/owner",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER","DRIVER","CAPTAIN","HELPER", "SUPER_ADMIN"),
  getOwnerSchedules
);

router.get("/route/:routeId", getSchedulesByRoute);

router.post(
  "/",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "SUPER_ADMIN"),
  // validatePermit,
  createSchedule
);

router.put(
  "/:id",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "SUPER_ADMIN"),
  updateSchedule
);

router.patch(
  "/:id/status",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "SUPER_ADMIN"),
  updateScheduleStatus
);

router.delete(
  "/:id",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "SUPER_ADMIN"),
  deleteSchedule
);

export default router;