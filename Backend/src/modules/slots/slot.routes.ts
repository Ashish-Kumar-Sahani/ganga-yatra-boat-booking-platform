import express from "express";

import {
  createSlot,
  getSlots,
  generateSlots,
  getSlotSeatSummary,
  updateSlotStatus,
  getSlotById,
  getOwnerSlots,
  getMonthlySlotAvailability,
  getOwnerMonthlySlots,
updateSlot,
shiftSlotDate,
getSlotPassengers,
} from "./slot.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", getSlots);

router.get("/monthly", getMonthlySlotAvailability);

router.get(
  "/owner",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "SUPER_ADMIN"),
  getOwnerSlots
);

router.post(
  "/",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "SUPER_ADMIN"),
  createSlot
);

router.post(
  "/generate",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "SUPER_ADMIN"),
  generateSlots
);
router.get(
  "/owner/monthly",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "SUPER_ADMIN"),
  getOwnerMonthlySlots
);

router.put(
  "/:id",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "SUPER_ADMIN"),
  updateSlot
);

router.patch(
  "/:id/shift-date",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "SUPER_ADMIN"),
  shiftSlotDate
);

router.get("/:id/seat-summary", getSlotSeatSummary);

router.patch(
  "/:id/status",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "SUPER_ADMIN"),
  updateSlotStatus
);
router.get(
  "/:id/passengers",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "DRIVER", "SUPER_ADMIN"),
  getSlotPassengers
);

router.get("/:id", getSlotById);

export default router;