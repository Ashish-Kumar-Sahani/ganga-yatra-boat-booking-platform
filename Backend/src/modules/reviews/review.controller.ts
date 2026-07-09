import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { Review } from "./review.model.js";
import { Booking } from "../bookings/booking.model.js";

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking: any = await Booking.findById(bookingId).populate({
      path: "slotId",
      populate: {
        path: "scheduleId",
        populate: { path: "boatId" },
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const boatId = booking.slotId.scheduleId.boatId._id;

    const review = await Review.create({
      customerId: req.user._id,
      bookingId,
      boatId,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: "Review failed", error });
  }
};

export const getBoatReviews = async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await Review.find({ boatId: req.params.boatId })
      .populate("customerId", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Reviews fetch failed", error });
  }
};