import express from "express";

import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

import {
  getCustomerDashboard,
  getCustomerWallet,
  rechargeWallet,
  payWithWallet,
  getLiveTrip,
  getCustomerProfile,
  updateCustomerProfile,
  getAvailableCustomerSlots,
  getWishlist,
  toggleWishlist,
  getCustomerReviews,
  createCustomerReview,
  searchTrips,
} from "./customer.controller.js";

import { getMyBookings } from "../bookings/booking.controller.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  allowRoles("CUSTOMER"),
  getCustomerDashboard
);

router.get(
  "/bookings",
  protect,
  allowRoles("CUSTOMER"),
  getMyBookings
);

router.get(
  "/wallet",
  protect,
  allowRoles("CUSTOMER"),
  getCustomerWallet
);

router.post(
  "/wallet/recharge",
  protect,
  allowRoles("CUSTOMER"),
  rechargeWallet
);

router.post(
  "/wallet/pay",
  protect,
  allowRoles("CUSTOMER"),
  payWithWallet
);

router.get(
  "/live-tracking/:bookingId",
  protect,
  allowRoles("CUSTOMER"),
  getLiveTrip
);

router.get(
  "/wishlist",
  protect,
  allowRoles("CUSTOMER"),
  getWishlist
);

router.post(
  "/wishlist/toggle",
  protect,
  allowRoles("CUSTOMER"),
  toggleWishlist
);

router.get(
  "/reviews",
  protect,
  allowRoles("CUSTOMER"),
  getCustomerReviews
);

router.post(
  "/reviews",
  protect,
  allowRoles("CUSTOMER"),
  createCustomerReview
);

router.get(
  "/profile",
  protect,
  allowRoles("CUSTOMER"),
  getCustomerProfile
);

router.put(
  "/profile",
  protect,
  allowRoles("CUSTOMER"),
  updateCustomerProfile
);

router.get(
  "/available-slots",
  protect,
  allowRoles("CUSTOMER"),
  getAvailableCustomerSlots
);

router.get(
  "/search-trips",
  protect,
  allowRoles("CUSTOMER"),
  searchTrips
);

export default router;