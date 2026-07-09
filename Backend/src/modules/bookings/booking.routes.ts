import express from "express";
import { 
  createBooking,
  getMyBookings,
  checkInBooking,
  cancelBooking,
  getBookingById,
  getAllBookings,
  getOwnerBookings,
  createOfflineBooking,
  createEmergencyBooking,
  verifyTicket,
  markNoShowBooking,
  completeBooking,
  rescheduleBooking,
  getPendingRefunds,
  approveRefund,
  rejectRefund,
  getCancellationLogs,
  getRefundLogs,
  ownerRespondCancellation,
  getOwnerRefundRequests,
} from "./booking.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("CUSTOMER"),
  createBooking
);

router.get(
  "/my-bookings",
  protect,
  allowRoles("CUSTOMER"),
  getMyBookings
);
router.patch(
  "/check-in/:bookingCode",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "DRIVER", "SUPER_ADMIN"),
  checkInBooking
);
router.patch(
  "/cancel/:id",
  protect,
  allowRoles(
    "CUSTOMER",
    "BOAT_OWNER",
    "MANAGER",
    "SUPER_ADMIN"
  ),
  cancelBooking
);
router.get(
  "/all",
  protect,
  allowRoles("SUPER_ADMIN", "BOAT_OWNER", "MANAGER"),
  getAllBookings
);

router.get(
  "/owner",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "DRIVER", "CAPTAIN", "HELPER", "SUPER_ADMIN"),
  getOwnerBookings
);
router.get(
  "/:id",
  protect,
  allowRoles("CUSTOMER", "BOAT_OWNER", "MANAGER", "SUPER_ADMIN", "CITY_AUTHORITY"),
  getBookingById
);
router.post(
  "/offline",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "DRIVER", "SUPER_ADMIN"),
  createOfflineBooking
);
router.post(
  "/emergency",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "DRIVER", "SUPER_ADMIN"),
  createEmergencyBooking
);
router.post(
  "/verify-ticket",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "DRIVER", "SUPER_ADMIN"),
  verifyTicket
);
router.patch(
  "/:id/no-show",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "DRIVER", "SUPER_ADMIN"),
  markNoShowBooking
);

router.patch(
  "/:id/complete",
  protect,
  allowRoles("BOAT_OWNER", "MANAGER", "DRIVER", "SUPER_ADMIN"),
  completeBooking
);

router.patch(
  "/:id/reschedule",
  protect,
  allowRoles("CUSTOMER"),
  rescheduleBooking
);

router.get(
  "/refunds/pending",
  protect,
  allowRoles("SUPER_ADMIN", "CITY_AUTHORITY"),
  getPendingRefunds
);

router.patch(
  "/refunds/:id/approve",
  protect,
  allowRoles("SUPER_ADMIN", "CITY_AUTHORITY"),
  approveRefund
);

router.patch(
  "/refunds/:id/reject",
  protect,
  allowRoles("SUPER_ADMIN", "CITY_AUTHORITY"),
  rejectRefund
);

router.get(
  "/cancellations/logs",
  protect,
  allowRoles("SUPER_ADMIN", "BOAT_OWNER", "MANAGER", "CITY_AUTHORITY"),
  getCancellationLogs
);

router.get(
  "/refunds/logs",
  protect,
  allowRoles("SUPER_ADMIN", "CITY_AUTHORITY"),
  getRefundLogs
);

router.patch(
  "/owner-respond/:id",
  protect,
  allowRoles("BOAT_OWNER"),
  ownerRespondCancellation
);

router.get(
  "/owner/refund-requests",
  protect,
  allowRoles("BOAT_OWNER"),
  getOwnerRefundRequests
);

export default router;