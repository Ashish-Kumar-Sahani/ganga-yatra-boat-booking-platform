import { Request, Response } from "express";
import { Booking } from "../bookings/booking.model.js";
import { Payment } from "../payments/payment.model.js";
import { Slot } from "../slots/slot.model.js";
import { Boat } from "../boats/boat.model.js";
import { Schedule } from "../schedules/schedule.model.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { getOwnerId } from "../../utils/getOwnerId.js";
import { RevenueService } from "../../services/revenue.service.js";

export const getSystemAnalytics = async (req: Request, res: Response) => {
  try {
    const revData = await RevenueService.calculateRevenue({});

    res.json({
      totalBookings: revData.summary.bookingCount,
      confirmedBookings: revData.summary.completedTrips,
      cancelledBookings: await Booking.countDocuments({ bookingStatus: "CANCELLED" }),
      totalPayments: revData.summary.bookingCount,
      totalRevenue: revData.summary.totalRevenue,
      totalSlots: await Slot.countDocuments(),
      summary: revData.summary,
      charts: revData.charts,
      breakdown: revData.breakdown
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Analytics fetch failed",
      error: error.message,
    });
  }
};

export const getOwnerReports = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = await getOwnerId(req);
    if (!ownerId) {
      return res.status(403).json({ message: "Owner not linked" });
    }

    const year = req.query.year ? Number(req.query.year) : undefined;
    const month = req.query.month ? Number(req.query.month) : undefined;

    const revData = await RevenueService.calculateRevenue({ ownerId, year, month });

    return res.json({
      revenue: {
        todayRevenue: revData.summary.todayRevenue,
        weeklyRevenue: revData.summary.thisWeekRevenue,
        monthlyRevenue: revData.summary.thisMonthRevenue,
        yearlyRevenue: revData.summary.thisYearRevenue,
        yesterdayRevenue: revData.summary.yesterdayRevenue,
        thisWeekRevenue: revData.summary.thisWeekRevenue,
        lastWeekRevenue: revData.summary.lastWeekRevenue,
        thisMonthRevenue: revData.summary.thisMonthRevenue,
        prevMonthRevenue: revData.summary.prevMonthRevenue,
        thisYearRevenue: revData.summary.thisYearRevenue,
        lifetimeRevenue: revData.summary.lifetimeRevenue,
        grossRevenue: revData.summary.grossRevenue,
        netRevenue: revData.summary.netRevenue,
        refundAmount: revData.summary.refundAmount,
        cancelledAmount: revData.summary.cancelledAmount,
        averageTicketSize: revData.summary.averageTicketSize,
        bookingCount: revData.summary.bookingCount,
        completedTrips: revData.summary.completedTrips
      },
      charts: revData.charts,
      topBoats: revData.breakdown.byBoat,
      routes: revData.breakdown.byRoute,
      breakdown: revData.breakdown
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Owner reports fetch failed",
      error: error.message
    });
  }
};