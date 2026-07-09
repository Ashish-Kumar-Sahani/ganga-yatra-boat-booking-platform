import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { Boat } from "../boats/boat.model.js";
import { Permit } from "../permits/permit.model.js";
import { Route } from "../routes/route.model.js";
import { Inspection } from "./inspection.model.js";
import { Violation } from "./violation.model.js";
import { Complaint } from "./complaint.model.js";
import { Trip } from "../trips/trip.model.js";
import { Notification } from "../notifications/notification.model.js";
import { Booking } from "../bookings/booking.model.js";

// Helper to get city filter
const getCityFilter = (req: AuthRequest) => {
  if (!req.user) return { _id: null };
  if (req.user.role === "SUPER_ADMIN") {
    // If super admin, allow passing cityId in query
    if (req.query.cityId) {
      return { cityId: req.query.cityId };
    }
    return {};
  }
  if (req.user.cityId) {
    return { cityId: req.user.cityId };
  }
  return { cityId: null }; // Default to no city data
};

// ========================
// AUTHORITY DASHBOARD
// ========================

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const cityFilter = getCityFilter(req);

    // Boats
    const [totalBoats, approvedBoats, pendingBoats, rejectedBoats, suspendedBoats] = await Promise.all([
      Boat.countDocuments(cityFilter),
      Boat.countDocuments({ ...cityFilter, status: "APPROVED" }),
      Boat.countDocuments({ ...cityFilter, status: "PENDING" }),
      Boat.countDocuments({ ...cityFilter, status: "REJECTED" }),
      Boat.countDocuments({ ...cityFilter, status: "SUSPENDED" }),
    ]);

    // Permits
    const [pendingPermits, approvedPermits, expiredPermits] = await Promise.all([
      Permit.countDocuments({ ...cityFilter, status: "PENDING" }),
      Permit.countDocuments({ ...cityFilter, status: "APPROVED" }),
      Permit.countDocuments({ ...cityFilter, status: "EXPIRED" }),
    ]);

    // Routes (Route uses cityId and approvalStatus)
    const [pendingRoutes, approvedRoutes] = await Promise.all([
      Route.countDocuments({ ...cityFilter, approvalStatus: "PENDING" }),
      Route.countDocuments({ ...cityFilter, approvalStatus: "APPROVED" }),
    ]);

    // Safety Inspections (e.g. PASS, WARNING, FAIL)
    const inspectionsCount = await Inspection.countDocuments(cityFilter);
    const safetyInspectionsDue = await Boat.countDocuments({
      ...cityFilter,
      status: "APPROVED",
      permitVerified: false // Just a proxy metric if no inspection recorded
    });

    // Active complaints and violations
    const activeComplaints = await Complaint.countDocuments({
      ...cityFilter,
      status: { $in: ["OPEN", "IN_REVIEW"] }
    });
    const openViolations = await Violation.countDocuments({
      ...cityFilter,
      status: { $in: ["OPEN", "UNDER_REVIEW", "PENALTY_ISSUED"] }
    });

    // Live Trips & Today's trips
    const boatsInCity = await Boat.find(cityFilter).distinct("_id");
    const liveTrips = await Trip.countDocuments({
      boatId: { $in: boatsInCity },
      tripStatus: { $in: ["STARTED", "IN_PROGRESS"] }
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayTripCount = await Trip.countDocuments({
      boatId: { $in: boatsInCity },
      createdAt: { $gte: startOfToday }
    });

    // Emergency alerts (sosActive trips)
    const emergencyAlerts = await Trip.countDocuments({
      boatId: { $in: boatsInCity },
      sosActive: true
    });

    // Refund stats
    const [
      pendingRefundRequests,
      todaysRefundRequests,
      approvedRefunds,
      rejectedRefunds,
      highValueRefunds,
      refundQueue
    ] = await Promise.all([
      Booking.countDocuments({ refundStatus: "PENDING" }),
      Booking.countDocuments({
        cancellationRequestedAt: { $gte: startOfToday }
      }),
      Booking.countDocuments({ refundStatus: { $in: ["VERIFIED", "APPROVED", "COMPLETED"] } }),
      Booking.countDocuments({ refundStatus: "REJECTED" }),
      Booking.countDocuments({
        refundStatus: { $in: ["PENDING", "UNDER_REVIEW", "VERIFIED", "APPROVED", "PROCESSING"] },
        refundAmount: { $gte: 1000 }
      }),
      Booking.countDocuments({
        refundStatus: { $in: ["PENDING", "UNDER_REVIEW", "VERIFIED", "APPROVED", "PROCESSING"] }
      })
    ]);

    res.json({
      success: true,
      stats: {
        totalBoats,
        verifiedBoats: approvedBoats,
        pendingBoatVerification: pendingBoats,
        rejectedBoats,
        suspendedBoats,
        pendingPermitRequests: pendingPermits,
        approvedPermits,
        expiredPermits,
        pendingRouteApprovals: pendingRoutes,
        approvedRoutes,
        safetyInspectionsDue,
        activeComplaints,
        openViolations,
        emergencyAlerts,
        liveTrips,
        todayTripCount,
        inspectionsCount,
        // Refund Stats
        pendingRefundRequests,
        todaysRefundRequests,
        approvedRefunds,
        rejectedRefunds,
        highValueRefunds,
        refundQueue
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
  }
};

// ========================
// BOAT VERIFICATION
// ========================

export const getBoats = async (req: AuthRequest, res: Response) => {
  try {
    const cityFilter = getCityFilter(req);
    const { status, search } = req.query;

    let query: any = { ...cityFilter };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { boatName: { $regex: search, $options: "i" } },
        { boatNumber: { $regex: search, $options: "i" } },
        { "documents.registrationNumber": { $regex: search, $options: "i" } },
      ];
    }

    const boats = await Boat.find(query)
      .populate("ownerId", "name email phone")
      .populate("cityId", "name state riverName")
      .sort({ createdAt: -1 });

    res.json(boats);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch boats", error: error.message });
  }
};

export const getBoatById = async (req: AuthRequest, res: Response) => {
  try {
    const boat = await Boat.findById(req.params.id)
      .populate("ownerId", "name email phone")
      .populate("cityId", "name state riverName");

    if (!boat) {
      return res.status(404).json({ message: "Boat not found" });
    }

    res.json(boat);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch boat", error: error.message });
  }
};

export const approveBoat = async (req: AuthRequest, res: Response) => {
  try {
    const { reviewNote } = req.body;

    const boat = await Boat.findByIdAndUpdate(
      req.params.id,
      {
        status: "APPROVED",
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
        reviewNote: reviewNote || "Approved by authority",
        rejectionReason: "",
        suspendedReason: ""
      },
      { new: true }
    );

    if (!boat) {
      return res.status(404).json({ message: "Boat not found" });
    }

    // Create system notification for boat owner
    await Notification.create({
      userId: boat.ownerId,
      title: "Boat Approved 🚤",
      message: `Your boat "${boat.boatName}" (${boat.boatNumber}) has been approved by the City Authority.`,
      type: "SYSTEM",
      priority: "HIGH"
    });

    res.json({ message: "Boat verified and approved successfully", boat });
  } catch (error: any) {
    res.status(500).json({ message: "Boat approval failed", error: error.message });
  }
};

export const rejectBoat = async (req: AuthRequest, res: Response) => {
  try {
    const { rejectionReason, reviewNote } = req.body;
    if (!rejectionReason) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    const boat = await Boat.findByIdAndUpdate(
      req.params.id,
      {
        status: "REJECTED",
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
        reviewNote: reviewNote || "Rejected by authority",
        rejectionReason,
        suspendedReason: ""
      },
      { new: true }
    );

    if (!boat) {
      return res.status(404).json({ message: "Boat not found" });
    }

    // Notify owner
    await Notification.create({
      userId: boat.ownerId,
      title: "Boat Verification Rejected ❌",
      message: `Your boat "${boat.boatName}" was rejected. Reason: ${rejectionReason}`,
      type: "SYSTEM",
      priority: "HIGH"
    });

    res.json({ message: "Boat registration rejected", boat });
  } catch (error: any) {
    res.status(500).json({ message: "Boat rejection failed", error: error.message });
  }
};

export const suspendBoat = async (req: AuthRequest, res: Response) => {
  try {
    const { suspendedReason, reviewNote } = req.body;
    if (!suspendedReason) {
      return res.status(400).json({ message: "Suspension reason is required" });
    }

    const boat = await Boat.findByIdAndUpdate(
      req.params.id,
      {
        status: "SUSPENDED",
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
        reviewNote: reviewNote || "Suspended by authority",
        suspendedReason
      },
      { new: true }
    );

    if (!boat) {
      return res.status(404).json({ message: "Boat not found" });
    }

    // Notify owner
    await Notification.create({
      userId: boat.ownerId,
      title: "Boat Suspended ⚠️",
      message: `Your boat "${boat.boatName}" has been suspended. Reason: ${suspendedReason}`,
      type: "SYSTEM",
      priority: "EMERGENCY"
    });

    res.json({ message: "Boat suspended successfully", boat });
  } catch (error: any) {
    res.status(500).json({ message: "Boat suspension failed", error: error.message });
  }
};

// ========================
// PERMIT APPROVAL
// ========================

export const getPermits = async (req: AuthRequest, res: Response) => {
  try {
    const cityFilter = getCityFilter(req);
    const { status, type } = req.query;

    let query: any = { ...cityFilter };

    if (status) query.status = status;
    if (type) query.permitType = type;

    const permits = await Permit.find(query)
      .populate("boatId", "boatName boatNumber image status capacity")
      .populate("ownerId", "name email phone")
      .populate("cityId", "name state")
      .populate("allowedRoutes")
      .sort({ createdAt: -1 });

    res.json(permits);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch permits", error: error.message });
  }
};

export const getPermitById = async (req: AuthRequest, res: Response) => {
  try {
    const permit = await Permit.findById(req.params.id)
      .populate("boatId", "boatName boatNumber status capacity")
      .populate("ownerId", "name email phone")
      .populate("cityId", "name state")
      .populate("allowedRoutes");

    if (!permit) {
      return res.status(404).json({ message: "Permit not found" });
    }

    res.json(permit);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch permit", error: error.message });
  }
};

export const approvePermit = async (req: AuthRequest, res: Response) => {
  try {
    const { reviewNote, validFrom, validTill } = req.body;

    const updateFields: any = {
      status: "APPROVED",
      reviewedBy: req.user._id,
      reviewedAt: new Date(),
      reviewNote: reviewNote || "Permit approved",
      rejectionReason: "",
      suspendedReason: ""
    };

    if (validFrom) updateFields.validFrom = new Date(validFrom);
    if (validTill) updateFields.validTill = new Date(validTill);

    const permit = await Permit.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!permit) {
      return res.status(404).json({ message: "Permit not found" });
    }

    // Sync permit verification on boat if this is a boat permit
    if (permit.permitType === "BOAT_PERMIT" || permit.permitType === "SAFETY_CLEARANCE") {
      await Boat.findByIdAndUpdate(permit.boatId, { permitVerified: true });
    }

    // Notify owner
    await Notification.create({
      userId: permit.ownerId,
      title: "Permit Approved ✅",
      message: `Your permit request (${permit.permitNumber}) has been approved.`,
      type: "SYSTEM",
      priority: "HIGH"
    });

    res.json({ message: "Permit approved successfully", permit });
  } catch (error: any) {
    res.status(500).json({ message: "Permit approval failed", error: error.message });
  }
};

export const rejectPermit = async (req: AuthRequest, res: Response) => {
  try {
    const { rejectionReason, reviewNote } = req.body;
    if (!rejectionReason) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    const permit = await Permit.findByIdAndUpdate(
      req.params.id,
      {
        status: "REJECTED",
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
        reviewNote: reviewNote || "Permit rejected",
        rejectionReason,
        suspendedReason: ""
      },
      { new: true }
    );

    if (!permit) {
      return res.status(404).json({ message: "Permit not found" });
    }

    // Notify owner
    await Notification.create({
      userId: permit.ownerId,
      title: "Permit Rejected ❌",
      message: `Your permit request (${permit.permitNumber}) was rejected. Reason: ${rejectionReason}`,
      type: "SYSTEM",
      priority: "HIGH"
    });

    res.json({ message: "Permit rejected successfully", permit });
  } catch (error: any) {
    res.status(500).json({ message: "Permit rejection failed", error: error.message });
  }
};

export const suspendPermit = async (req: AuthRequest, res: Response) => {
  try {
    const { suspendedReason, reviewNote } = req.body;
    if (!suspendedReason) {
      return res.status(400).json({ message: "Suspension reason is required" });
    }

    const permit = await Permit.findByIdAndUpdate(
      req.params.id,
      {
        status: "SUSPENDED",
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
        reviewNote: reviewNote || "Permit suspended",
        suspendedReason
      },
      { new: true }
    );

    if (!permit) {
      return res.status(404).json({ message: "Permit not found" });
    }

    // Notify owner
    await Notification.create({
      userId: permit.ownerId,
      title: "Permit Suspended ⚠️",
      message: `Your permit (${permit.permitNumber}) was suspended. Reason: ${suspendedReason}`,
      type: "SYSTEM",
      priority: "EMERGENCY"
    });

    res.json({ message: "Permit suspended successfully", permit });
  } catch (error: any) {
    res.status(500).json({ message: "Permit suspension failed", error: error.message });
  }
};

export const markPermitRenewalRequired = async (req: AuthRequest, res: Response) => {
  try {
    const { reviewNote } = req.body;

    const permit = await Permit.findByIdAndUpdate(
      req.params.id,
      {
        status: "RENEWAL_REQUIRED",
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
        reviewNote: reviewNote || "Renewal notification flagged"
      },
      { new: true }
    );

    if (!permit) {
      return res.status(404).json({ message: "Permit not found" });
    }

    // Notify owner
    await Notification.create({
      userId: permit.ownerId,
      title: "Permit Renewal Required 🔄",
      message: `Your permit (${permit.permitNumber}) requires renewal. Please upload renewed documents.`,
      type: "SYSTEM",
      priority: "HIGH"
    });

    res.json({ message: "Permit flagged for renewal", permit });
  } catch (error: any) {
    res.status(500).json({ message: "Flagging permit renewal failed", error: error.message });
  }
};

// ========================
// ROUTE APPROVAL
// ========================

export const getRoutes = async (req: AuthRequest, res: Response) => {
  try {
    const cityFilter = getCityFilter(req);
    const { status } = req.query;

    let query: any = { ...cityFilter };
    if (status) {
      query.approvalStatus = status;
    }

    const routes = await Route.find(query)
      .populate("cityId", "name state")
      .populate("sourceGhatId", "name")
      .populate("destinationGhatId", "name")
      .sort({ createdAt: -1 });

    res.json(routes);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch routes", error: error.message });
  }
};

export const getRouteById = async (req: AuthRequest, res: Response) => {
  try {
    const route = await Route.findById(req.params.id)
      .populate("cityId", "name state")
      .populate("sourceGhatId", "name")
      .populate("destinationGhatId", "name");

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.json(route);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch route", error: error.message });
  }
};

export const approveRoute = async (req: AuthRequest, res: Response) => {
  try {
    const { approvalNote, safetyNote } = req.body;

    const route = await Route.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: "APPROVED",
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
        approvalNote: approvalNote || "Approved route",
        safetyNote: safetyNote || "Routes checks passed",
        rejectionReason: "",
        suspendedReason: ""
      },
      { new: true }
    );

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.json({ message: "Route approved successfully", route });
  } catch (error: any) {
    res.status(500).json({ message: "Route approval failed", error: error.message });
  }
};

export const rejectRoute = async (req: AuthRequest, res: Response) => {
  try {
    const { rejectionReason, approvalNote } = req.body;
    if (!rejectionReason) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    const route = await Route.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: "REJECTED",
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
        approvalNote: approvalNote || "Route registration rejected",
        rejectionReason,
        suspendedReason: ""
      },
      { new: true }
    );

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.json({ message: "Route rejected successfully", route });
  } catch (error: any) {
    res.status(500).json({ message: "Route rejection failed", error: error.message });
  }
};

export const suspendRoute = async (req: AuthRequest, res: Response) => {
  try {
    const { suspendedReason, approvalNote } = req.body;
    if (!suspendedReason) {
      return res.status(400).json({ message: "Suspension reason is required" });
    }

    const route = await Route.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: "SUSPENDED",
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
        approvalNote: approvalNote || "Suspended route",
        suspendedReason
      },
      { new: true }
    );

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.json({ message: "Route suspended successfully", route });
  } catch (error: any) {
    res.status(500).json({ message: "Route suspension failed", error: error.message });
  }
};

// ========================
// SAFETY INSPECTIONS
// ========================

export const getInspections = async (req: AuthRequest, res: Response) => {
  try {
    const cityFilter = getCityFilter(req);
    const inspections = await Inspection.find(cityFilter)
      .populate("boatId", "boatName boatNumber")
      .populate("inspectorId", "name email")
      .sort({ createdAt: -1 });

    res.json(inspections);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch inspections", error: error.message });
  }
};

export const createInspection = async (req: AuthRequest, res: Response) => {
  try {
    const cityFilter = getCityFilter(req);
    const {
      boatId,
      checklist,
      result,
      remarks,
      nextInspectionDueDate,
      photoUrl,
      certificateUrl
    } = req.body;

    if (!boatId || !nextInspectionDueDate) {
      return res.status(400).json({ message: "boatId and nextInspectionDueDate are required" });
    }

    // Get the boat to verify it is in authority's city
    const boat = await Boat.findById(boatId);
    if (!boat) {
      return res.status(404).json({ message: "Boat not found" });
    }

    const cityId = boat.cityId;

    // Calculate score based on checklist items passed
    const items = Object.values(checklist || {});
    const passedCount = items.filter(val => val === true).length;
    const score = items.length > 0 ? Math.round((passedCount / items.length) * 100) : 0;

    const inspection = await Inspection.create({
      boatId,
      cityId,
      inspectorId: req.user._id,
      inspectorName: req.user.name,
      checklist,
      result: result || (score > 80 ? "PASS" : score > 50 ? "WARNING" : "FAIL"),
      score,
      remarks,
      nextInspectionDueDate: new Date(nextInspectionDueDate),
      photoUrl,
      certificateUrl
    });

    // Update boat with permitVerified if result is PASS
    if (inspection.result === "PASS") {
      await Boat.findByIdAndUpdate(boatId, { permitVerified: true });
    } else if (inspection.result === "FAIL") {
      await Boat.findByIdAndUpdate(boatId, { permitVerified: false });
      // Proactively open a Violation if inspection fails
      await Violation.create({
        boatId,
        ownerId: boat.ownerId,
        cityId,
        violationType: "UNSAFE_OPERATION",
        description: `Boat failed safety inspection with score ${score}%. Remarks: ${remarks}`,
        severity: "HIGH",
        status: "OPEN",
        reportedBy: `Inspector: ${req.user.name}`
      });
    }

    res.status(201).json({ message: "Inspection recorded successfully", inspection });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to record safety inspection", error: error.message });
  }
};

export const getInspectionById = async (req: AuthRequest, res: Response) => {
  try {
    const inspection = await Inspection.findById(req.params.id)
      .populate("boatId", "boatName boatNumber capacity status")
      .populate("inspectorId", "name email");

    if (!inspection) {
      return res.status(404).json({ message: "Inspection not found" });
    }

    res.json(inspection);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch inspection", error: error.message });
  }
};

export const updateInspectionResult = async (req: AuthRequest, res: Response) => {
  try {
    const { result, remarks } = req.body;

    if (!["PASS", "WARNING", "FAIL"].includes(result)) {
      return res.status(400).json({ message: "Invalid result value" });
    }

    const inspection = await Inspection.findByIdAndUpdate(
      req.params.id,
      { result, remarks },
      { new: true }
    );

    if (!inspection) {
      return res.status(404).json({ message: "Inspection not found" });
    }

    res.json({ message: "Inspection result updated", inspection });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update inspection", error: error.message });
  }
};

// ========================
// VIOLATIONS
// ========================

export const getViolations = async (req: AuthRequest, res: Response) => {
  try {
    const cityFilter = getCityFilter(req);
    const violations = await Violation.find(cityFilter)
      .populate("boatId", "boatName boatNumber")
      .populate("ownerId", "name email phone")
      .populate("routeId", "sourceGhatId destinationGhatId")
      .sort({ createdAt: -1 });

    res.json(violations);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch violations", error: error.message });
  }
};

export const createViolation = async (req: AuthRequest, res: Response) => {
  try {
    const {
      boatId,
      routeId,
      violationType,
      description,
      severity,
      penaltyAmount
    } = req.body;

    if (!violationType || !description) {
      return res.status(400).json({ message: "violationType and description are required" });
    }

    let cityId = req.user.cityId;
    let ownerId = null;

    if (boatId) {
      const boat = await Boat.findById(boatId);
      if (boat) {
        cityId = boat.cityId;
        ownerId = boat.ownerId;
      }
    }

    const violation = await Violation.create({
      boatId,
      ownerId,
      routeId,
      cityId,
      violationType,
      description,
      severity: severity || "MEDIUM",
      status: penaltyAmount > 0 ? "PENALTY_ISSUED" : "OPEN",
      penaltyAmount: penaltyAmount || 0,
      reportedBy: req.user.name
    });

    // Notify boat owner if any
    if (ownerId) {
      await Notification.create({
        userId: ownerId,
        title: "Compliance Violation Logged ⚠️",
        message: `A violation of type "${violationType}" has been logged for your boat. Severity: ${severity || "MEDIUM"}. Penalty: ₹${penaltyAmount || 0}`,
        type: "SYSTEM",
        priority: "HIGH"
      });
    }

    res.status(201).json({ message: "Violation reported successfully", violation });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create violation", error: error.message });
  }
};

export const updateViolationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status, resolutionNotes } = req.body;

    if (!["OPEN", "UNDER_REVIEW", "RESOLVED", "PENALTY_ISSUED", "CLOSED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updateFields: any = { status };
    if (status === "RESOLVED" || status === "CLOSED") {
      updateFields.resolvedBy = req.user._id;
      updateFields.resolvedAt = new Date();
      updateFields.resolutionNotes = resolutionNotes || "Resolved by authority";
    }

    const violation = await Violation.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!violation) {
      return res.status(404).json({ message: "Violation not found" });
    }

    res.json({ message: "Violation status updated", violation });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update violation status", error: error.message });
  }
};

export const updateViolationPenalty = async (req: AuthRequest, res: Response) => {
  try {
    const { penaltyAmount, penaltyPaid } = req.body;

    const updateFields: any = {};
    if (penaltyAmount !== undefined) {
      updateFields.penaltyAmount = penaltyAmount;
      updateFields.status = "PENALTY_ISSUED";
    }
    if (penaltyPaid !== undefined) {
      updateFields.penaltyPaid = penaltyPaid;
      if (penaltyPaid) updateFields.status = "RESOLVED";
    }

    const violation = await Violation.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!violation) {
      return res.status(404).json({ message: "Violation not found" });
    }

    res.json({ message: "Violation penalty updated", violation });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update violation penalty", error: error.message });
  }
};

// ========================
// COMPLAINTS
// ========================

export const getComplaints = async (req: AuthRequest, res: Response) => {
  try {
    const cityFilter = getCityFilter(req);
    const complaints = await Complaint.find(cityFilter)
      .populate("boatId", "boatName boatNumber")
      .populate("customerId", "name email phone")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch complaints", error: error.message });
  }
};

export const updateComplaintStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status, authorityNote } = req.body;

    if (!["OPEN", "IN_REVIEW", "RESOLVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updateFields: any = { status };
    if (authorityNote !== undefined) {
      updateFields.authorityNote = authorityNote;
    }
    if (status === "RESOLVED" || status === "REJECTED") {
      updateFields.resolvedAt = new Date();
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Complaint status updated", complaint });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update complaint status", error: error.message });
  }
};

export const updateComplaintNote = async (req: AuthRequest, res: Response) => {
  try {
    const { authorityNote, linkedViolationId } = req.body;

    const updateFields: any = { authorityNote };
    if (linkedViolationId) {
      updateFields.linkedViolationId = linkedViolationId;
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Complaint authority note updated", complaint });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update complaint note", error: error.message });
  }
};

// ========================
// REPORTS & SUMMARIES
// ========================

export const getReportsSummary = async (req: AuthRequest, res: Response) => {
  try {
    const cityFilter = getCityFilter(req);
    const { startDate, endDate } = req.query;

    let dateRangeQuery: any = {};
    if (startDate && endDate) {
      dateRangeQuery.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const reportFilter = { ...cityFilter, ...dateRangeQuery };

    // Run aggregations for reports
    const [boatsList, permitsList, routesList, inspectionsList, violationsList, complaintsList] = await Promise.all([
      Boat.find(cityFilter).populate("ownerId", "name email").populate("cityId", "name"),
      Permit.find(reportFilter).populate("boatId", "boatName boatNumber").populate("ownerId", "name"),
      Route.find(cityFilter).populate("sourceGhatId", "name").populate("destinationGhatId", "name"),
      Inspection.find(reportFilter).populate("boatId", "boatName boatNumber"),
      Violation.find(reportFilter).populate("boatId", "boatName boatNumber").populate("ownerId", "name"),
      Complaint.find(reportFilter).populate("boatId", "boatName boatNumber")
    ]);

    res.json({
      success: true,
      reports: {
        boats: boatsList,
        permits: permitsList,
        routes: routesList,
        inspections: inspectionsList,
        violations: violationsList,
        complaints: complaintsList
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to aggregate report data", error: error.message });
  }
};
