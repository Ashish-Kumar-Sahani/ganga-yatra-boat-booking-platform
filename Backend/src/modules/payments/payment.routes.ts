import express from "express";

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getPaymentByBooking,
  getTransactions,
} from "./payment.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  allowRoles("SUPER_ADMIN"),
  getTransactions
);

router.post(
  "/create-order",
  protect,
  allowRoles("CUSTOMER"),
  createRazorpayOrder
);

router.post(
  "/verify",
  protect,
  allowRoles("CUSTOMER"),
  verifyRazorpayPayment
);

router.get(
  "/booking/:bookingId",
  protect,
  allowRoles("CUSTOMER", "BOAT_OWNER", "MANAGER", "SUPER_ADMIN"),
  getPaymentByBooking
);

export default router;