import express from "express";
import {
  createOffer,
  getOffers,
  validateOffer,
  updateOffer,
  deleteOffer,
} from "./offer.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", getOffers);
router.post("/validate", validateOffer);

router.post("/", protect, allowRoles("SUPER_ADMIN"), createOffer);
router.put("/:id", protect, allowRoles("SUPER_ADMIN"), updateOffer);
router.delete("/:id", protect, allowRoles("SUPER_ADMIN"), deleteOffer);

export default router;