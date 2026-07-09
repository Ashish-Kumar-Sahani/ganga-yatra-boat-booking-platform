import { Request, Response } from "express";
import { Route } from "./route.model.js";

export const createRoute = async (req: Request, res: Response) => {
  try {
    const route = await Route.create(req.body);
    res.status(201).json({ message: "Route created", route });
  } catch (error) {
    res.status(500).json({ message: "Route creation failed", error });
  }
};

export const getRoutes = async (req: Request, res: Response) => {
  try {
    const routes = await Route.find()
      .populate("cityId", "name state riverName")
      .populate("sourceGhatId", "name location")
      .populate("destinationGhatId", "name location")
      .sort({ createdAt: -1 });

    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: "Routes fetch failed", error });
  }
};

export const getRoutesByCity = async (req: Request, res: Response) => {
  try {
    const routes = await Route.find({ cityId: req.params.cityId })
      .populate("sourceGhatId", "name location")
      .populate("destinationGhatId", "name location");

    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: "City routes fetch failed", error });
  }
};

export const approveRoute = async (req: Request, res: Response) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: "APPROVED", isActive: true },
      { new: true }
    );

    res.json({ message: "Route approved", route });
  } catch (error) {
    res.status(500).json({ message: "Route approval failed", error });
  }
};

export const rejectRoute = async (req: Request, res: Response) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: "REJECTED", isActive: false },
      { new: true }
    );

    res.json({ message: "Route rejected", route });
  } catch (error) {
    res.status(500).json({ message: "Route rejection failed", error });
  }
};

export const updateRoute = async (req: Request, res: Response) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    res.json({ message: "Route updated", route });
  } catch (error) {
    res.status(500).json({ message: "Route update failed", error });
  }
};

export const deleteRoute = async (req: Request, res: Response) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    res.json({ message: "Route deleted" });
  } catch (error) {
    res.status(500).json({ message: "Route deletion failed", error });
  }
};