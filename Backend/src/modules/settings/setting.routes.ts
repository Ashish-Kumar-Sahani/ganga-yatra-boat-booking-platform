import express from "express";
import { getSettings, updateSettings } from "./setting.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", protect, getSettings);
router.put("/", protect, allowRoles("SUPER_ADMIN"), updateSettings);

export default router;
