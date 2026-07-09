import { Request, Response } from "express";
import { Setting } from "./setting.model.js";

export const getSettings = async (req: Request, res: Response) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({});
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: "Settings fetch failed", error });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create(req.body);
    } else {
      setting = await Setting.findByIdAndUpdate(setting._id, req.body, {
        new: true,
        runValidators: true,
      });
    }
    res.json({ message: "Settings updated successfully", settings: setting });
  } catch (error) {
    res.status(500).json({ message: "Settings update failed", error });
  }
};
