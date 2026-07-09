import { Request, Response } from "express";
import { Offer } from "./offer.model.js";

export const createOffer = async (req: Request, res: Response) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json({ message: "Offer created", offer });
  } catch (error) {
    res.status(500).json({ message: "Offer creation failed", error });
  }
};

export const getOffers = async (req: Request, res: Response) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: "Offers fetch failed", error });
  }
};

export const updateOffer = async (req: Request, res: Response) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    res.json({ message: "Offer updated", offer });
  } catch (error) {
    res.status(500).json({ message: "Offer update failed", error });
  }
};

export const deleteOffer = async (req: Request, res: Response) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    res.json({ message: "Offer deleted" });
  } catch (error) {
    res.status(500).json({ message: "Offer deletion failed", error });
  }
};

export const validateOffer = async (req: Request, res: Response) => {
  try {
    const { code, bookingAmount } = req.body;

    const offer = await Offer.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!offer) return res.status(404).json({ message: "Invalid coupon" });

    const now = new Date();

    if (now < offer.validFrom || now > offer.validTill) {
      return res.status(400).json({ message: "Coupon expired or not active" });
    }

    if (bookingAmount < offer.minBookingAmount) {
      return res.status(400).json({
        message: `Minimum booking amount should be ${offer.minBookingAmount}`,
      });
    }

    let discount = 0;

    if (offer.discountType === "PERCENTAGE") {
      discount = (bookingAmount * offer.discountValue) / 100;

      if (offer.maxDiscountAmount > 0) {
        discount = Math.min(discount, offer.maxDiscountAmount);
      }
    } else {
      discount = offer.discountValue;
    }

    const finalAmount = bookingAmount - discount;

    res.json({
      message: "Coupon applied",
      offerCode: offer.code,
      bookingAmount,
      discount,
      finalAmount,
    });
  } catch (error) {
    res.status(500).json({ message: "Coupon validation failed", error });
  }
};
