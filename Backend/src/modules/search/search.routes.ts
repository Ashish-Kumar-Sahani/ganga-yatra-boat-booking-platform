import express from "express";
import { globalSearch, publicSearchRoutes } from "./search.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", protect, allowRoles("SUPER_ADMIN"), globalSearch);
router.get("/routes", publicSearchRoutes);

export default router;
