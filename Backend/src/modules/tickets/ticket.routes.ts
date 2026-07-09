import express from "express";
import { getTicket } from "./ticket.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/:bookingCode",
  protect,
  allowRoles(
    "CUSTOMER",
    "BOAT_OWNER",
    "MANAGER",
    "DRIVER",
    "SUPER_ADMIN"
  ),
  getTicket
);

export default router;