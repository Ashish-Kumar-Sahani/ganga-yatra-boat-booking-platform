import API from "@/api/axiosInstance";
import type { StaffPaymentBooking } from "../types/payment.types";

const normalizeBookings = (payload: any): StaffPaymentBooking[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.bookings)) return payload.bookings;
  if (Array.isArray(payload?.payments)) return payload.payments;
  return [];
};

export const getStaffPaymentBookings = async (): Promise<StaffPaymentBooking[]> => {
  const res = await API.get("/bookings/owner");

  console.log("Payment API raw:", res.data);

  return normalizeBookings(res.data);
};