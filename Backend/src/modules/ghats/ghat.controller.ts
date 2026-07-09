import { Request, Response } from "express";
import { Ghat } from "./ghat.model.js";

export const createGhat = async (req: Request, res: Response) => {
  try {
    const ghat = await Ghat.create(req.body);
    res.status(201).json({ message: "Ghat created", ghat });
  } catch (error) {
    res.status(500).json({ message: "Ghat creation failed", error });
  }
};

export const getGhats = async (req: Request, res: Response) => {
  try {
    const ghats = await Ghat.find()
      .populate("cityId", "name state riverName")
      .sort({ createdAt: -1 });

    res.json(ghats);
  } catch (error) {
    res.status(500).json({ message: "Ghats fetch failed", error });
  }
};

export const getGhatsByCity = async (req: Request, res: Response) => {
  try {
    const ghats = await Ghat.find({ cityId: req.params.cityId }).sort({
      createdAt: -1,
    });

    res.json(ghats);
  } catch (error) {
    res.status(500).json({ message: "City ghats fetch failed", error });
  }
};

export const updateGhat = async (req: Request, res: Response) => {
  try {
    const ghat = await Ghat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!ghat) {
      return res.status(404).json({ message: "Ghat not found" });
    }
    res.json({ message: "Ghat updated", ghat });
  } catch (error) {
    res.status(500).json({ message: "Ghat update failed", error });
  }
};

export const deleteGhat = async (req: Request, res: Response) => {
  try {
    const ghat = await Ghat.findByIdAndDelete(req.params.id);
    if (!ghat) {
      return res.status(404).json({ message: "Ghat not found" });
    }
    res.json({ message: "Ghat deleted" });
  } catch (error) {
    res.status(500).json({ message: "Ghat deletion failed", error });
  }
};