import express from "express";
import {
  createWeatherAlert,
  getActiveWeatherAlerts,
  deactivateWeatherAlert,
    pauseSlotsByCity,
    resumeSlotsByCity,
} from "./weather.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/active", getActiveWeatherAlerts);

router.post(
  "/",
  protect,
  allowRoles("SUPER_ADMIN", "CITY_AUTHORITY"),
  createWeatherAlert
);

router.patch(
  "/:id/deactivate",
  protect,
  allowRoles("SUPER_ADMIN", "CITY_AUTHORITY"),
  deactivateWeatherAlert
);
router.patch(
  "/pause-slots",
  protect,
  allowRoles("SUPER_ADMIN", "CITY_AUTHORITY"),
  pauseSlotsByCity
);
router.patch(
  "/resume-slots",
  protect,
  allowRoles("SUPER_ADMIN", "CITY_AUTHORITY"),
  resumeSlotsByCity
);

export default router;