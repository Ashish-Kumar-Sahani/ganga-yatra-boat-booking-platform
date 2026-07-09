import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import {
  getWalletMe,
  getTransactions,
  createAddMoneyOrder,
  verifyAddMoney,
  payBooking,
} from "./wallet.controller.js";

const router = express.Router();

router.use(protect);
router.use(allowRoles("CUSTOMER"));

router.get("/me", getWalletMe);
router.get("/transactions", getTransactions);
router.post("/create-add-money-order", createAddMoneyOrder);
router.post("/verify-add-money", verifyAddMoney);
router.post("/pay-booking", payBooking);

export default router;
