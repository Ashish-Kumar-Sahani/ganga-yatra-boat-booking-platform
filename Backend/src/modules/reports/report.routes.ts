import express from "express";
import { getSystemAnalytics } from "./analytics.controller.js";
import { getOwnerReports } from "./report.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/analytics",
  protect,
  allowRoles("SUPER_ADMIN", "CITY_AUTHORITY"),
  getSystemAnalytics
);

router.get(
  "/owner",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "DRIVER", "CAPTAIN", "HELPER", "SUPER_ADMIN"),
  getOwnerReports
);

export default router;