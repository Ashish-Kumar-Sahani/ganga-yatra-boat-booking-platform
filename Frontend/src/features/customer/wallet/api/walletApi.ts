import axiosInstance from "@/api/axiosInstance";
import type { WalletData, WalletTransaction } from "../types/wallet.types";

export const getWalletMe = async (): Promise<WalletData> => {
  const res = await axiosInstance.get("/wallet/me");
  return res.data;
};

export const getWalletTransactions = async (): Promise<WalletTransaction[]> => {
  const res = await axiosInstance.get("/wallet/transactions");
  return res.data;
};

export const createAddMoneyOrder = async (amount: number): Promise<{ key: string; order: any }> => {
  const res = await axiosInstance.post("/wallet/create-add-money-order", { amount });
  return res.data;
};

export const verifyAddMoney = async (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<{ message: string; balance: number }> => {
  const res = await axiosInstance.post("/wallet/verify-add-money", data);
  return res.data;
};

export const payBookingWithWallet = async (bookingId: string): Promise<{ message: string; balance: number; booking: any }> => {
  const res = await axiosInstance.post("/wallet/pay-booking", { bookingId });
  return res.data;
};
