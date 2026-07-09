import express from "express";

import {
  startTrip,
  updateTripLocation,
  getLiveTrip,
  completeTrip,
  activateSOS,
  getOwnerTrips,
  cancelTrip,
} from "./trip.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/owner",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "DRIVER", "CAPTAIN", "HELPER", "SUPER_ADMIN"),
  getOwnerTrips
);

router.get(
  "/:id",
  protect,
  allowRoles("CUSTOMER", "BOAT_OWNER", "MANAGER", "DRIVER", "SUPER_ADMIN"),
  getLiveTrip
);

router.post(
  "/start",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "DRIVER", "SUPER_ADMIN"),
  startTrip
);

router.patch(
  "/location",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "DRIVER", "SUPER_ADMIN"),
  updateTripLocation
);

router.patch(
  "/:id/complete",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "DRIVER", "SUPER_ADMIN"),
  completeTrip
);

router.patch(
  "/:id/cancel",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "SUPER_ADMIN"),
  cancelTrip
);

router.patch(
  "/:id/sos",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "DRIVER", "SUPER_ADMIN"),
  activateSOS
);

export default router;