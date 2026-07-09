import express from "express";
import {
  getDashboardStats,
  getBoats,
  getBoatById,
  approveBoat,
  rejectBoat,
  suspendBoat,
  getPermits,
  getPermitById,
  approvePermit,
  rejectPermit,
  suspendPermit,
  markPermitRenewalRequired,
  getRoutes,
  getRouteById,
  approveRoute,
  rejectRoute,
  suspendRoute,
  getInspections,
  createInspection,
  getInspectionById,
  updateInspectionResult,
  getViolations,
  createViolation,
  updateViolationStatus,
  updateViolationPenalty,
  getComplaints,
  updateComplaintStatus,
  updateComplaintNote,
  getReportsSummary
} from "./authority.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

// Apply auth middleware to all authority routes
router.use(protect);
router.use(allowRoles("CITY_AUTHORITY", "SUPER_ADMIN"));

// Dashboard Stats
router.get("/dashboard/stats", getDashboardStats);
router.get("/reports/summary", getReportsSummary);

// Boats Verification
router.get("/boats", getBoats);
router.get("/boats/:id", getBoatById);
router.patch("/boats/:id/approve", approveBoat);
router.patch("/boats/:id/reject", rejectBoat);
router.patch("/boats/:id/suspend", suspendBoat);

// Permits Approval
router.get("/permits", getPermits);
router.get("/permits/:id", getPermitById);
router.patch("/permits/:id/approve", approvePermit);
router.patch("/permits/:id/reject", rejectPermit);
router.patch("/permits/:id/suspend", suspendPermit);
router.patch("/permits/:id/renewal-required", markPermitRenewalRequired);

// Routes Approval
router.get("/routes", getRoutes);
router.get("/routes/:id", getRouteById);
router.patch("/routes/:id/approve", approveRoute);
router.patch("/routes/:id/reject", rejectRoute);
router.patch("/routes/:id/suspend", suspendRoute);

// Inspections
router.get("/inspections", getInspections);
router.post("/inspections", createInspection);
router.get("/inspections/:id", getInspectionById);
router.patch("/inspections/:id/result", updateInspectionResult);

// Violations
router.get("/violations", getViolations);
router.post("/violations", createViolation);
router.patch("/violations/:id/status", updateViolationStatus);
router.patch("/violations/:id/penalty", updateViolationPenalty);

// Complaints
router.get("/complaints", getComplaints);
router.patch("/complaints/:id/status", updateComplaintStatus);
router.patch("/complaints/:id/note", updateComplaintNote);

export default router;
