import { Response } from "express";
import os from "os";
import mongoose from "mongoose";
import { Booking } from "../bookings/booking.model.js";
import { Slot } from "../slots/slot.model.js";
import { Boat } from "../boats/boat.model.js";
import { Schedule } from "../schedules/schedule.model.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { User } from "../users/user.model.js";
import { Attendance } from "../attendance/attendance.model.js";
import { getOwnerId } from "../../utils/getOwnerId.js";
import { Notification } from "../notifications/notification.model.js";
import { City } from "../cities/city.model.js";
import { Ghat } from "../ghats/ghat.model.js";
import { Route } from "../routes/route.model.js";
import { Permit } from "../permits/permit.model.js";
import { RevenueService } from "../../services/revenue.service.js";

export const getOwnerDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?._id || req.user?.id;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized owner",
      });
    }

    const boats = await Boat.find({ ownerId });
    const boatIds = boats.map((boat) => boat._id);

    const schedules = await Schedule.find({
      boatId: { $in: boatIds },
    });

    const scheduleIds = schedules.map((schedule) => schedule._id);

    const slots = await Slot.find({
      scheduleId: { $in: scheduleIds },
    });

    const slotIds = slots.map((slot) => slot._id);

    const allBookings = await Booking.find({
      slotId: { $in: slotIds },
    })
      .populate("customerId", "name email phone")
      .populate({
        path: "slotId",
        populate: {
          path: "scheduleId",
          populate: [
            { path: "boatId", select: "boatName boatNumber capacity" },
            {
              path: "routeId",
              populate: [
                { path: "sourceGhatId", select: "name" },
                { path: "destinationGhatId", select: "name" },
              ],
            },
          ],
        },
      })
      .sort({ createdAt: -1 });

    const revData = await RevenueService.calculateRevenue({ ownerId });

    const totalEarnings = revData.summary.lifetimeRevenue;
    const todayEarnings = revData.summary.todayRevenue;
    const onlineEarnings = revData.summary.onlineRevenue;
    const offlineEarnings = revData.summary.offlineRevenue;
    const emergencyEarnings = revData.summary.emergencyRevenue;

    const totalPassengers = allBookings.reduce(
      (sum: number, booking: any) => sum + Number(booking.seatsBooked || 0),
      0
    );

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todaySlots = slots.filter((slot: any) => {
      const slotDate = new Date(slot.slotDate);
      return slotDate >= todayStart && slotDate <= todayEnd;
    }).length;

    const todayBookings = allBookings.filter((booking: any) => {
      const createdAt = new Date(booking.createdAt);
      return createdAt >= todayStart && createdAt <= todayEnd;
    }).length;

    const recentBookings = allBookings.slice(0, 5);

    return res.status(200).json({
      totalBoats: boats.length,
      approvedBoats: boats.filter((boat: any) => boat.status === "APPROVED").length,
      pendingBoats: boats.filter((boat: any) => boat.status === "PENDING").length,
      rejectedBoats: boats.filter((boat: any) => boat.status === "REJECTED").length,
      suspendedBoats: boats.filter((boat: any) => boat.status === "SUSPENDED").length,
      availableBoats: boats.filter((boat: any) => boat.isAvailable === true).length,
      totalSchedules: schedules.length,
      activeSchedules: schedules.filter((schedule: any) => schedule.isActive === true).length,
      totalSlots: slots.length,
      todaySlots,
      totalBookings: allBookings.length,
      todayBookings,
      totalPassengers,
      confirmedBookings: allBookings.filter((booking: any) => booking.bookingStatus === "CONFIRMED").length,
      completedBookings: allBookings.filter((booking: any) => booking.bookingStatus === "COMPLETED").length,
      cancelledBookings: allBookings.filter((booking: any) => booking.bookingStatus === "CANCELLED").length,
      onlineBookings: allBookings.filter((booking: any) => booking.bookingType === "ONLINE").length,
      offlineBookings: allBookings.filter((booking: any) => booking.bookingType === "OFFLINE").length,
      emergencyBookings: allBookings.filter((booking: any) => booking.bookingType === "EMERGENCY").length,
      
      // Centralized revenue metrics
      totalEarnings,
      todayEarnings,
      onlineEarnings,
      offlineEarnings,
      emergencyEarnings,
      yesterdayEarnings: revData.summary.yesterdayRevenue,
      thisWeekEarnings: revData.summary.thisWeekRevenue,
      lastWeekEarnings: revData.summary.lastWeekRevenue,
      thisMonthEarnings: revData.summary.thisMonthRevenue,
      prevMonthEarnings: revData.summary.prevMonthRevenue,
      thisYearEarnings: revData.summary.thisYearRevenue,
      lifetimeEarnings: revData.summary.lifetimeRevenue,
      grossRevenue: revData.summary.grossRevenue,
      netRevenue: revData.summary.netRevenue,
      refundAmount: revData.summary.refundAmount,
      cancelledAmount: revData.summary.cancelledAmount,
      averageTicketSize: revData.summary.averageTicketSize,

      recentBookings,
      boatStatus: {
        approved: boats.filter((boat: any) => boat.status === "APPROVED").length,
        pending: boats.filter((boat: any) => boat.status === "PENDING").length,
        rejected: boats.filter((boat: any) => boat.status === "REJECTED").length,
        suspended: boats.filter((boat: any) => boat.status === "SUSPENDED").length,
      },
      boatTypes: {
        manual: boats.filter((boat: any) => boat.boatType === "MANUAL").length,
        motor: boats.filter((boat: any) => boat.boatType === "MOTOR").length,
        luxury: boats.filter((boat: any) => boat.boatType === "LUXURY").length,
        cruise: boats.filter((boat: any) => boat.boatType === "CRUISE").length,
        waterTaxi: boats.filter((boat: any) => boat.boatType === "WATER_TAXI").length,
      },
      bookingChart: revData.charts.dailyRevenue.map((item: any) => ({
        date: item.date,
        bookings: item.bookings,
      })),
      earningsChart: revData.charts.dailyRevenue.map((item: any) => ({
        date: item.date,
        earnings: item.revenue,
      })),
      reviews: [],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Owner dashboard fetch failed",
      error: error.message,
    });
  }
};

export const getStaffDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let boats: any[] = [];
    const isManager = user.role === "MANAGER";
    let revData;

    if (isManager) {
      const ownerId = await getOwnerId(req);
      if (ownerId) {
        boats = await Boat.find({ ownerId });
        revData = await RevenueService.calculateRevenue({ ownerId });
      } else {
        revData = await RevenueService.calculateRevenue({});
      }
    } else {
      if (user.assignedBoatId) {
        const assigned = await Boat.findById(user.assignedBoatId);
        if (assigned) {
          boats = [assigned];
        }
        revData = await RevenueService.calculateRevenue({ boatId: user.assignedBoatId.toString() });
      } else {
        revData = await RevenueService.calculateRevenue({});
      }
    }

    const boatIds = boats.map((b) => b._id);
    const schedules = await Schedule.find({ boatId: { $in: boatIds } });
    const scheduleIds = schedules.map((s) => s._id);
    const slots = await Slot.find({ scheduleId: { $in: scheduleIds } });
    const slotIds = slots.map((s) => s._id);

    const bookings = await Booking.find({ slotId: { $in: slotIds } })
      .populate("customerId", "name email phone")
      .populate({
        path: "slotId",
        populate: {
          path: "scheduleId",
          populate: [
            { path: "boatId", select: "boatName boatNumber capacity" },
            {
              path: "routeId",
              populate: [
                { path: "sourceGhatId", select: "name" },
                { path: "destinationGhatId", select: "name" },
              ],
            },
          ],
        },
      })
      .sort({ createdAt: -1 });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayBookings = bookings.filter((b: any) => {
      const d = new Date(b.createdAt);
      return d >= todayStart && d <= todayEnd;
    }).length;

    const totalBookings = bookings.length;
    const activeBoats = boats.filter((b: any) => b.isAvailable === true).length;
    const recentBookings = bookings.slice(0, 5);

    const notificationsCount = await Notification.countDocuments({ userId });
    const unreadNotifications = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    let assignedBoat = null;
    let todaySchedules: any[] = [];
    let todayBookingsCount = 0;

    if (!isManager && user.assignedBoatId) {
      assignedBoat = boats[0] || null;
      const todaySlots = slots.filter((slot: any) => {
        const slotDate = new Date(slot.slotDate);
        return slotDate >= todayStart && slotDate <= todayEnd;
      });
      const todaySlotIds = todaySlots.map((s) => s._id);

      todayBookingsCount = bookings.filter((b: any) => {
        const slotIdStr = b.slotId?._id?.toString() || b.slotId?.toString();
        return todaySlotIds.map((id) => id.toString()).includes(slotIdStr);
      }).length;

      todaySchedules = await Slot.find({
        _id: { $in: todaySlotIds },
      }).populate({
        path: "scheduleId",
        populate: [
          { path: "boatId", select: "boatName boatNumber" },
          {
            path: "routeId",
            populate: [
              { path: "sourceGhatId", select: "name" },
              { path: "destinationGhatId", select: "name" },
            ],
          },
        ],
      });
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const attendance = await Attendance.findOne({ userId, date: todayStr });

    return res.json({
      todayBookings,
      activeBoats,
      totalBookings,
      totalEarnings: revData.summary.lifetimeRevenue,
      todayCollection: revData.summary.todayCollection,
      shiftCollection: revData.summary.shiftCollection,
      offlineCollection: revData.summary.offlineCollection,
      cashCollection: revData.summary.cashCollection,
      upiCollection: revData.summary.upiCollection,
      completedTripsCount: revData.summary.completedTripsCount,
      weeklyBookingAnalytics: revData.charts.dailyRevenue.map((d: any) => ({
        date: d.date,
        bookings: d.bookings
      })),
      recentBookings,
      boatStatus: boats,
      earningsSplit: {
        online: revData.summary.onlineRevenue,
        offline: revData.summary.offlineRevenue,
        emergency: revData.summary.emergencyRevenue
      },
      notificationsCount,
      unreadNotifications,
      user,
      assignedBoat,
      todaySchedules,
      todayBookingsCount,
      attendance,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Staff dashboard fetch failed",
      error: error.message,
    });
  }
};

export const getAdminDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const year = req.query.year ? Number(req.query.year) : undefined;
    const revData = await RevenueService.calculateRevenue({ year });

    const totalUsers = await User.countDocuments();
    const customersCount = await User.countDocuments({ role: "CUSTOMER" });
    const ownersCount = await User.countDocuments({ role: "BOAT_OWNER" });
    const staffCount = await User.countDocuments({
      role: { $in: ["MANAGER", "DRIVER", "CAPTAIN", "HELPER"] },
    });

    const citiesCount = await City.countDocuments();
    const ghatsCount = await Ghat.countDocuments();
    const routesCount = await Route.countDocuments();
    const boatsCount = await Boat.countDocuments();

    const onlineBoats = await Boat.countDocuments({
      isAvailable: true,
      status: "APPROVED",
    });
    const offlineBoats = await Boat.countDocuments({
      $or: [{ isAvailable: false }, { status: { $ne: "APPROVED" } }],
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayBookingsCount = await Booking.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    const pendingPermitsCount = await Permit.countDocuments({
      status: "PENDING",
    });

    const pendingBoatApprovals = await Boat.countDocuments({ status: "PENDING" });
    const pendingRouteApprovals = await Route.countDocuments({ approvalStatus: "PENDING" });
    const pendingApprovalsCount = pendingBoatApprovals + pendingRouteApprovals;

    const cancelledBookingsCount = await Booking.countDocuments({
      bookingStatus: "CANCELLED",
    });
    const completedTripsCount = await Booking.countDocuments({
      bookingStatus: "COMPLETED",
    });

    const latestBookings = await Booking.find()
      .populate("customerId", "name email phone")
      .populate({
        path: "slotId",
        populate: {
          path: "scheduleId",
          populate: [
            { path: "boatId", select: "boatName boatNumber" },
            {
              path: "routeId",
              populate: [
                { path: "sourceGhatId", select: "name" },
                { path: "destinationGhatId", select: "name" },
              ],
            },
          ],
        },
      })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find({ role: { $ne: "SUPER_ADMIN" } })
      .select("name email role isActive createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentNotifications = await Notification.find({ userId: req.user?._id })
      .sort({ createdAt: -1 })
      .limit(5);

    const cpuLoad = os.loadavg()[0];
    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const memUsagePercent = Math.round(((totalMem - freeMem) / totalMem) * 100);

    const systemHealth = {
      cpuUsage: Math.round(cpuLoad * 10) || 12,
      memoryUsage: memUsagePercent,
      databaseStatus:
        mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED",
      uptime: Math.round(process.uptime()),
      apiStatus: "UP",
    };

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        customers: customersCount,
        owners: ownersCount,
        staff: staffCount,
        cities: citiesCount,
        ghats: ghatsCount,
        routes: routesCount,
        boats: boatsCount,
        todayBookings: todayBookingsCount,
        
        // Upgraded centralized metrics
        todayRevenue: revData.summary.todayRevenue,
        monthlyRevenue: revData.summary.thisMonthRevenue,
        yearlyRevenue: revData.summary.thisYearRevenue,
        overallRevenue: revData.summary.lifetimeRevenue,
        currentMonthRevenue: revData.summary.thisMonthRevenue,
        currentYearRevenue: revData.summary.thisYearRevenue,
        dailyRevenue: revData.summary.todayRevenue,
        weeklyRevenue: revData.summary.thisWeekRevenue,
        monthlyRevenueValue: revData.summary.thisMonthRevenue,
        totalRefund: revData.summary.refundAmount,
        netRevenue: revData.summary.netRevenue,
        grossRevenue: revData.summary.grossRevenue,

        pendingPermits: pendingPermitsCount,
        pendingApprovals: pendingApprovalsCount,
        onlineBoats,
        offlineBoats,
        cancelledBookings: cancelledBookingsCount,
        completedTrips: completedTripsCount,
      },
      weeklyBookingChart: revData.charts.dailyRevenue.map((d: any) => ({
        date: d.date,
        bookings: d.bookings
      })),
      monthlyRevenueChart: revData.charts.monthlyRevenue.map((m: any) => ({
        month: m.month,
        revenue: m.revenue
      })),
      topCities: revData.breakdown.byCity.map((c: any) => ({ name: c.cityName, boatsCount: c.bookings })),
      topGhats: [], // ghat performance is deprecated or route performance suffices
      topBoatOwners: revData.breakdown.byOwner.map((o: any) => ({ name: o.ownerName, revenue: o.revenue, bookings: o.bookings })),
      topBoats: revData.breakdown.byBoat.map((b: any) => ({ boatName: b.boatName, ownerName: b.ownerName, trips: b.bookings, revenue: b.revenue })),
      latestBookings,
      recentUsers,
      systemHealth,
      recentNotifications,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Admin dashboard fetch failed",
      error: error.message,
    });
  }
};