import type { RequestHandler } from "express";
import { Boat } from "./boat.model.js";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";
import { getOwnerId } from "../../utils/getOwnerId.js";

type MulterRequest = AuthRequest & {
  file?: Express.Multer.File;
};

export const createBoat: RequestHandler = async (req, res) => {
  try {
    const authReq = req as MulterRequest;

    if (!authReq.user?._id) {
      return res.status(401).json({ message: "Unauthorized owner" });
    }

    const {
      cityId,
      boatName,
      boatNumber,
      boatType = "MOTOR",
      capacity,
      registrationNumber,
      insuranceNumber,
      permitNumber,
    } = req.body;

    if (!cityId || !boatName || !boatNumber || !capacity) {
      return res.status(400).json({
        message: "cityId, boatName, boatNumber and capacity are required",
      });
    }

    let imageUrl = null;

    if (authReq.file?.path) {
      const uploaded = await uploadToCloudinary(authReq.file.path, "boats");
      imageUrl = uploaded.secure_url;
    }

    const ownerId = await getOwnerId(authReq);
    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized owner context" });
    }

    const boat = await Boat.create({
      ownerId,
      cityId,
      boatName,
      boatNumber: String(boatNumber).toUpperCase(),
      boatType,
      capacity: Number(capacity),
      image: imageUrl,
      documents: {
        registrationNumber: registrationNumber || null,
        insuranceNumber: insuranceNumber || null,
        permitNumber: permitNumber || null,
      },
    });

    return res.status(201).json({
      message: "Boat created successfully",
      boat,
    });
  } catch (error: any) {
    console.error("Boat creation error:", error);

    return res.status(500).json({
      message: "Boat creation failed",
      errorMessage: error?.message,
    });
  }
};

export const getBoats: RequestHandler = async (_req, res) => {
  try {
    const boats = await Boat.find()
      .populate("ownerId", "name email phone")
      .populate("cityId", "name state riverName")
      .sort({ createdAt: -1 });

    res.json(boats);
  } catch (error) {
    res.status(500).json({ message: "Boats fetch failed", error });
  }
};

export const getMyBoats: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const ownerId = await getOwnerId(authReq);

    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized owner" });
    }

    let query: any = {};
    if (["DRIVER", "CAPTAIN", "HELPER"].includes(authReq.user.role)) {
      if (authReq.user.assignedBoatId) {
        query = { _id: authReq.user.assignedBoatId };
      } else {
        return res.json([]);
      }
    } else {
      query = { ownerId };
    }

    const boats = await Boat.find(query)
      .populate("cityId", "name state riverName")
      .sort({ createdAt: -1 });

    return res.json(boats);
  } catch (error) {
    return res.status(500).json({ message: "My boats fetch failed", error });
  }
};

export const getBoatById: RequestHandler = async (req, res) => {
  try {
    const boat = await Boat.findById(req.params.id)
      .populate("ownerId", "name email phone")
      .populate("cityId", "name state riverName");

    if (!boat) {
      res.status(404).json({ message: "Boat not found" });
      return;
    }

    res.json(boat);
  } catch (error) {
    res.status(500).json({ message: "Boat fetch failed", error });
  }
};

export const updateMyBoat: RequestHandler = async (req, res) => {
  try {
    const authReq = req as MulterRequest;
    const ownerId = await getOwnerId(authReq);

    const updateData = { ...req.body };

    if (authReq.file) {
      let imageUrl = null;
      const hasCloudinary =
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET;

      if (hasCloudinary) {
        try {
          const uploaded = await uploadToCloudinary(authReq.file.path, "boats");
          imageUrl = uploaded.secure_url;
        } catch (cloudinaryError) {
          console.error("Cloudinary upload error during edit:", cloudinaryError);
        }
      }

      if (!imageUrl) {
        imageUrl = authReq.file.path.replace(/\\/g, "/");
      }
      updateData.image = imageUrl;
    }

    if (updateData.capacity !== undefined) {
      updateData.capacity = Number(updateData.capacity);
    }
    if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price);
    }
    if (updateData.isAvailable !== undefined) {
      updateData.isAvailable = updateData.isAvailable === "true" || updateData.isAvailable === true;
    }

    if (
      req.body.registrationNumber !== undefined ||
      req.body.insuranceNumber !== undefined ||
      req.body.permitNumber !== undefined
    ) {
      updateData.documents = {
        registrationNumber: req.body.registrationNumber || null,
        insuranceNumber: req.body.insuranceNumber || null,
        permitNumber: req.body.permitNumber || null,
      };
      delete updateData.registrationNumber;
      delete updateData.insuranceNumber;
      delete updateData.permitNumber;
    }

    const boat = await Boat.findOneAndUpdate(
      {
        _id: req.params.id,
        ownerId,
      },
      updateData,
      { new: true, runValidators: true }
    );

    if (!boat) {
      res.status(404).json({ message: "Boat not found" });
      return;
    }

    res.json({ message: "Boat updated", boat });
  } catch (error) {
    res.status(500).json({ message: "Boat update failed", error });
  }
};

export const toggleBoatAvailability: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const ownerId = await getOwnerId(authReq);

    const boat = await Boat.findOne({
      _id: req.params.id,
      ownerId,
    });

    if (!boat) {
      res.status(404).json({ message: "Boat not found" });
      return;
    }

    boat.isAvailable = !boat.isAvailable;
    await boat.save();

    res.json({
      message: "Boat availability updated",
      boat,
    });
  } catch (error) {
    res.status(500).json({
      message: "Boat availability update failed",
      error,
    });
  }
};

export const deleteMyBoat: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const ownerId = await getOwnerId(authReq);

    const boat = await Boat.findOneAndDelete({
      _id: req.params.id,
      ownerId,
    });

    if (!boat) {
      res.status(404).json({ message: "Boat not found" });
      return;
    }

    res.json({ message: "Boat deleted" });
  } catch (error) {
    res.status(500).json({ message: "Boat delete failed", error });
  }
};

export const adminUpdateBoat: RequestHandler = async (req, res) => {
  try {
    const { cityId, boatName, boatNumber, boatType, capacity, isAvailable } = req.body;

    const boat = await Boat.findByIdAndUpdate(
      req.params.id,
      { cityId, boatName, boatNumber: boatNumber ? String(boatNumber).toUpperCase() : undefined, boatType, capacity, isAvailable },
      { new: true, runValidators: true }
    );

    if (!boat) {
      res.status(404).json({ message: "Boat not found" });
      return;
    }

    res.json({ message: "Boat updated successfully", boat });
  } catch (error: any) {
    res.status(500).json({ message: "Boat update failed", error: error.message });
  }
};

export const adminDeleteBoat: RequestHandler = async (req, res) => {
  try {
    const boat = await Boat.findByIdAndDelete(req.params.id);

    if (!boat) {
      res.status(404).json({ message: "Boat not found" });
      return;
    }

    res.json({ message: "Boat deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Boat deletion failed", error: error.message });
  }
};

export const adminUpdateBoatStatus: RequestHandler = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["PENDING", "APPROVED", "REJECTED", "SUSPENDED"].includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    const boat = await Boat.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!boat) {
      res.status(404).json({ message: "Boat not found" });
      return;
    }

    res.json({ message: `Boat status updated to ${status}`, boat });
  } catch (error: any) {
    res.status(500).json({ message: "Boat status update failed", error: error.message });
  }
};
