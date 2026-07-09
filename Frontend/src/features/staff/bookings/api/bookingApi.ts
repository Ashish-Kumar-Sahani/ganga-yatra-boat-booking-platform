import API from "@/api/axiosInstance";
import type { StaffBooking } from "../types/booking.types";

export const getStaffBookings = async (): Promise<StaffBooking[]> => {
  const res = await API.get("/bookings/owner");
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const cancelStaffBooking = async (
  bookingId: string,
  reason = "Cancelled by staff"
) => {
  const res = await API.patch(`/bookings/cancel/${bookingId}`, { reason });
  return res.data;
};

export const checkInStaffBooking = async (bookingCode: string) => {
  const res = await API.patch(`/bookings/check-in/${bookingCode}`);
  return res.data;
};