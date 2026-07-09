import type { RequestHandler } from "express";
import { Booking } from "../bookings/booking.model.js";

export const getTicket: RequestHandler = async (req, res) => {
  try {
    const { bookingCode } = req.params;

    const booking = await Booking.findOne({ bookingCode })
      .populate("customerId", "name email phone")
      .populate({
        path: "slotId",
        populate: {
          path: "scheduleId",
          populate: [
            {
              path: "boatId",
              select: "boatName boatNumber capacity",
            },
            {
              path: "routeId",
              populate: [
                {
                  path: "sourceGhatId",
                  select: "name location",
                },
                {
                  path: "destinationGhatId",
                  select: "name location",
                },
              ],
            },
          ],
        },
      });

    if (!booking) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    return res.json(booking);
  } catch (error) {
    return res.status(500).json({
      message: "Ticket fetch failed",
      error,
    });
  }
};