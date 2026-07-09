import { Request, Response } from "express";
import { User } from "./user.model.js";
import { Booking } from "../bookings/booking.model.js";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const getCustomerProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select(
      "name email phone city address role cityId isActive createdAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch profile",
      error,
    });
  }
};

export const updateCustomerProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, phone, city, address } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone, city, address },
      { new: true, runValidators: true }
    ).select("name email phone city address role cityId isActive createdAt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update profile",
      error,
    });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bookings = await Booking.find({ customerId: userId })
      .populate({
        path: "slotId",
        populate: [
          { path: "boatId", select: "name boatName image imageUrl" },
          { path: "routeId", select: "name routeName startGhat endGhat" },
        ],
      })
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({
      message: "Bookings fetch failed",
      error,
    });
  }
};

export const getBookingHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bookings = await Booking.find({
      customerId: userId,
      bookingStatus: { $in: ["COMPLETED", "CANCELLED"] },
    })
      .populate({
        path: "slotId",
        populate: [
          { path: "boatId", select: "name boatName image imageUrl" },
          { path: "routeId", select: "name routeName startGhat endGhat" },
        ],
      })
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({
      message: "Booking history fetch failed",
      error,
    });
  }
};
export const getUsers = async (req: Request, res: Response) => {
  try {
    const { search, role, status, sortBy = "createdAt", sortOrder = "desc", page = "1", limit = "10" } = req.query;

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    if (status) {
      query.isActive = status === "active";
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;

    const sortObj: any = {};
    sortObj[sortBy as string] = sortOrder === "asc" ? 1 : -1;

    const users = await User.find(query)
      .select("-password")
      .sort(sortObj)
      .skip(skipNum)
      .limit(limitNum);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Users fetch failed", error });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    ).select("-password");

    res.json({ message: "User status updated", user });
  } catch (error) {
    res.status(500).json({ message: "User update failed", error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "User update failed", error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "User deletion failed", error });
  }
};

export const bulkUpdateStatus = async (req: Request, res: Response) => {
  try {
    const { userIds, isActive } = req.body;
    if (!Array.isArray(userIds)) {
      return res.status(400).json({ message: "userIds must be an array" });
    }

    await User.updateMany(
      { _id: { $in: userIds } },
      { isActive }
    );

    res.json({ message: "Users status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Bulk status update failed", error });
  }
};

export const bulkDeleteUsers = async (req: Request, res: Response) => {
  try {
    const { userIds } = req.body;
    if (!Array.isArray(userIds)) {
      return res.status(400).json({ message: "userIds must be an array" });
    }

    await User.deleteMany({ _id: { $in: userIds } });

    res.json({ message: "Users deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Bulk deletion failed", error });
  }
};