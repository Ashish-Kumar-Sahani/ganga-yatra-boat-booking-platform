import express from "express";
import { getOwnerDashboard, getStaffDashboard, getAdminDashboard } from "./dashboard.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/admin",
  protect,
  allowRoles("SUPER_ADMIN"),
  getAdminDashboard
);

router.get(
  "/owner",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "SUPER_ADMIN"),
  getOwnerDashboard
);

router.get(
  "/staff",
  protect,
  allowRoles("DRIVER", "CAPTAIN", "HELPER"),
  getStaffDashboard
);

export default router;