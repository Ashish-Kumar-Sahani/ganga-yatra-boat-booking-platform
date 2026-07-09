import express from "express";
import {
  createPermitRequest,
  getPermitRequests,
  approvePermit,
  rejectPermit,
} from "./permit.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import { allowPermissions } from "../../middlewares/rbac.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowPermissions("boat.view"),
  createPermitRequest
);

router.get(
  "/",
  protect,
  allowPermissions("authority.permit.approve"),
  getPermitRequests
);

router.patch(
  "/:id/approve",
  protect,
  allowPermissions("authority.permit.approve"),
  approvePermit
);

router.patch(
  "/:id/reject",
  protect,
  allowPermissions("authority.permit.approve"),
  rejectPermit
);

export default router;