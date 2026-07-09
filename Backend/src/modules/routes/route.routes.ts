import express from "express";
import {
  createRoute,
  getRoutes,
  getRoutesByCity,
  approveRoute,
  rejectRoute,
  updateRoute,
  deleteRoute,
} from "./route.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import { allowPermissions } from "../../middlewares/rbac.middleware.js";

const router = express.Router();

router.get("/", getRoutes);

router.get(
  "/owner",
  protect,
  allowPermissions("boat.view"),
  getRoutes
);

router.get("/city/:cityId", getRoutesByCity);

router.post(
  "/",
  protect,
  allowPermissions("authority.route.approve"),
  createRoute
);

router.patch(
  "/:id/approve",
  protect,
  allowPermissions("authority.route.approve"),
  approveRoute
);

router.patch(
  "/:id/reject",
  protect,
  allowPermissions("authority.route.approve"),
  rejectRoute
);

router.put(
  "/:id",
  protect,
  allowPermissions("authority.route.approve"),
  updateRoute
);

router.delete(
  "/:id",
  protect,
  allowPermissions("authority.route.approve"),
  deleteRoute
);

export default router;