import { User } from "../modules/users/user.model.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

export const getOwnerId = async (req: AuthRequest) => {
  const userId = req.user?._id || req.user?.id;

  if (!userId) return null;

  const user = await User.findById(userId);

  if (!user) return null;

  if (user.role === "BOAT_OWNER") {
    return user._id;
  }

  return user.ownerId;
};