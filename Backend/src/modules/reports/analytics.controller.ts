import { Request, Response } from "express";
import { Booking } from "../bookings/booking.model.js";
import { Slot } from "../slots/slot.model.js";
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
      error: error.message
    });
  }
};
