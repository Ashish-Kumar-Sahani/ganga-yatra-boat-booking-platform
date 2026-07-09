import express from "express";

import {
  createStaff,
  getOwnerStaff,
  updateStaff,
  deleteStaff,
} from "./staff.controller.js";

import { getStaffDashboard } from "../reports/dashboard.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import { allowPermissions } from "../../middlewares/rbac.middleware.js";

const router = express.Router();

router.get("/dashboard", protect, getStaffDashboard);

router.get(
  "/owner",
  protect,
  allowPermissions("staff.view"),
  getOwnerStaff
);

router.post(
  "/",
  protect,
  allowPermissions("staff.create"),
  createStaff
);

router.put(
  "/:id",
  protect,
  allowPermissions("staff.edit"),
  updateStaff
);

router.delete(
  "/:id",
  protect,
  allowPermissions("staff.delete"),
  deleteStaff
);

export default router;