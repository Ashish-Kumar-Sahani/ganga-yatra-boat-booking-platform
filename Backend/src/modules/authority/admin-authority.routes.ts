import express from "express";
import {
  getAuthorities,
  getAuthorityById,
  createAuthority,
  updateAuthority,
  updateAuthorityStatus,
  updateAuthorityPassword,
  deleteAuthority,
} from "./admin-authority.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";

const router = express.Router();

// Apply auth middleware to all admin authority routes
router.use(protect);
router.use(allowRoles("SUPER_ADMIN"));

router.get("/", getAuthorities);
router.get("/:id", getAuthorityById);
router.post("/", upload.single("profileImage"), createAuthority);
router.put("/:id", upload.single("profileImage"), updateAuthority);
router.patch("/:id/status", updateAuthorityStatus);
router.patch("/:id/password", updateAuthorityPassword);
router.delete("/:id", deleteAuthority);

export default router;
