import express from "express";

import {
  createBoat,
  getBoats,
  getMyBoats,
  getBoatById,
  updateMyBoat,
  toggleBoatAvailability,
  deleteMyBoat,
  adminUpdateBoat,
  adminDeleteBoat,
  adminUpdateBoatStatus,
} from "./boat.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import {
  allowPermissions,
  allowBoatAccess,
  allowOwnerAccess,
} from "../../middlewares/rbac.middleware.js";
import { upload }  from "../../middlewares/upload.middleware.js";
const router = express.Router();

router.get("/", getBoats);

router.get(
  "/my-boats",
  protect,
  allowPermissions("boat.view"),
  allowBoatAccess(),
  getMyBoats
);
router.get(
  "/:id",
  protect,
  allowPermissions("boat.view"),
  allowBoatAccess(),
  getBoatById
);
router.post(
  "/",
  protect,
  allowPermissions("boat.create"),
  upload.single("image"),
  createBoat
);
router.put(
  "/:id",
  protect,
  allowPermissions("boat.edit"),
  allowBoatAccess(),
  allowOwnerAccess(),
  upload.single("image"),
  updateMyBoat
);

router.patch(
  "/:id/toggle-availability",
  protect,
  allowPermissions("boat.edit"),
  allowBoatAccess(),
  allowOwnerAccess(),
  toggleBoatAvailability
);

router.delete(
  "/:id",
  protect,
  allowPermissions("boat.delete"),
  allowBoatAccess(),
  allowOwnerAccess(),
  deleteMyBoat
);

// Admin endpoints
router.put(
  "/admin/:id",
  protect,
  allowRoles("SUPER_ADMIN"),
  adminUpdateBoat
);

router.delete(
  "/admin/:id",
  protect,
  allowRoles("SUPER_ADMIN"),
  adminDeleteBoat
);

router.patch(
  "/admin/:id/status",
  protect,
  allowRoles("SUPER_ADMIN"),
  adminUpdateBoatStatus
);

export default router;