import express from "express";
import {
  createGhat,
  getGhats,
  getGhatsByCity,
  updateGhat,
  deleteGhat,
} from "./ghat.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", getGhats);
router.get("/city/:cityId", getGhatsByCity);

router.post(
  "/",
  protect,
  allowRoles("SUPER_ADMIN", "CITY_AUTHORITY"),
  createGhat
);

router.put(
  "/:id",
  protect,
  allowRoles("SUPER_ADMIN", "CITY_AUTHORITY"),
  updateGhat
);

router.delete(
  "/:id",
  protect,
  allowRoles("SUPER_ADMIN", "CITY_AUTHORITY"),
  deleteGhat
);

export default router;