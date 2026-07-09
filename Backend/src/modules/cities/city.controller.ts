import { Request, Response } from "express";
import { City } from "./city.model.js";

export const createCity = async (req: Request, res: Response) => {
  try {
    const city = await City.create(req.body);
    res.status(201).json({ message: "City created", city });
  } catch (error) {
    res.status(500).json({ message: "City creation failed", error });
  }
};

export const getCities = async (req: Request, res: Response) => {
  try {
    const cities = await City.find().sort({ createdAt: -1 });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: "Cities fetch failed", error });
  }
};

export const updateCity = async (req: Request, res: Response) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    res.json({ message: "City updated", city });
  } catch (error) {
    res.status(500).json({ message: "City update failed", error });
  }
};

export const deleteCity = async (req: Request, res: Response) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    res.json({ message: "City deleted" });
  } catch (error) {
    res.status(500).json({ message: "City deletion failed", error });
  }
};