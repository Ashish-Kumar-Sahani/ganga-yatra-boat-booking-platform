import express from "express";
import { createReview, getBoatReviews } from "./review.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", protect, allowRoles("CUSTOMER"), createReview);

router.get("/boat/:boatId", getBoatReviews);

export default router;