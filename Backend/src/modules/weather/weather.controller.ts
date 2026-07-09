import { Request, Response } from "express";
import { WeatherAlert } from "./weather.model.js";
import { Slot } from "../slots/slot.model.js";
import { Schedule } from "../schedules/schedule.model.js";
export const createWeatherAlert = async (req: Request, res: Response) => {
  try {
    const alert = await WeatherAlert.create(req.body);
    res.status(201).json({ message: "Weather alert created", alert });
  } catch (error) {
    res.status(500).json({ message: "Weather alert creation failed", error });
  }
};

export const getActiveWeatherAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await WeatherAlert.find({ isActive: true })
      .populate("cityId", "name state")
      .sort({ createdAt: -1 });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: "Weather alerts fetch failed", error });
  }
};

export const deactivateWeatherAlert = async (req: Request, res: Response) => {
  try {
    const alert = await WeatherAlert.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    res.json({ message: "Weather alert deactivated", alert });
  } catch (error) {
    res.status(500).json({ message: "Weather alert update failed", error });
  }
};
export const pauseSlotsByCity = async (req: Request, res: Response) => {
  try {
    const { cityId, date, reason } = req.body;

    const schedules = await Schedule.find().populate("routeId");

    const citySchedules = schedules.filter((schedule: any) => {
      return schedule.routeId?.cityId?.toString() === cityId;
    });

    const scheduleIds = citySchedules.map((schedule) => schedule._id);

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const result = await Slot.updateMany(
      {
        scheduleId: { $in: scheduleIds },
        slotDate: { $gte: startDate, $lte: endDate },
      },
      {
        status: "CANCELLED",
        cancellationReason: reason || "Weather alert",
      }
    );

    res.json({
      message: "Slots paused successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Slots pause failed",
      error,
    });
  }
};
export const resumeSlotsByCity = async (req: Request, res: Response) => {
  try {
    const { cityId, date } = req.body;

    const schedules = await Schedule.find().populate("routeId");

    const citySchedules = schedules.filter((schedule: any) => {
      return schedule.routeId?.cityId?.toString() === cityId;
    });

    const scheduleIds = citySchedules.map((schedule) => schedule._id);

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const result = await Slot.updateMany(
      {
        scheduleId: { $in: scheduleIds },
        slotDate: { $gte: startDate, $lte: endDate },
        status: "CANCELLED",
      },
      {
        status: "OPEN",
        cancellationReason: null,
      }
    );

    res.json({
      message: "Slots resumed successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Slots resume failed",
      error,
    });
  }
};