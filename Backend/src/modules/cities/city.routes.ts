import express from "express";
import { createCity, getCities, updateCity, deleteCity } from "./city.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", getCities);

router.post(
  "/",
  protect,
  allowRoles("SUPER_ADMIN"),
  createCity
);

router.put(
  "/:id",
  protect,
  allowRoles("SUPER_ADMIN"),
  updateCity
);

router.delete(
  "/:id",
  protect,
  allowRoles("SUPER_ADMIN"),
  deleteCity
);

export default router;