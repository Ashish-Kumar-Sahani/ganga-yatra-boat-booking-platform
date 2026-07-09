import axiosInstance from "@/api/axiosInstance";
import type { Booking } from "@/features/owner/bookings/types/booking.types";

export const createBooking = async (payload: {
  slotId: string;
  seatsBooked: number;
  passengerName: string;
  passengerPhone: string;
}) => {
  const res = await axiosInstance.post("/bookings", payload);
  return res.data;
};

export const createOfflineBooking = async (payload: {
  slotId: string;
  seatsBooked: number;
  passengerName: string;
  passengerPhone: string;
}): Promise<Booking> => {
  const res = await axiosInstance.post("/bookings/offline", payload);
  return res.data.booking;
};
export const createEmergencyBooking = async (payload: {
  slotId: string;
  seatsBooked: number;
  passengerName: string;
  passengerPhone: string;
  reason: string;
}): Promise<Booking> => {
  const res = await axiosInstance.post("/bookings/emergency", payload);
  return res.data.booking;
};

export const getMyBookings = async (): Promise<Booking[]> => {
  const res = await axiosInstance.get("/bookings/my-bookings");
  return res.data;
};

export const getOwnerBookings = async (): Promise<Booking[]> => {
  const res = await axiosInstance.get<Booking[]>("/bookings/owner");
  return res.data;
};

export const getAllBookings = async (): Promise<Booking[]> => {
  const res = await axiosInstance.get("/bookings/all");
  return res.data;
};

export const getBookingById = async (id: string): Promise<Booking> => {
  const res = await axiosInstance.get(`/bookings/${id}`);
  return res.data;
};

export const cancelBooking = async (
  id: string,
  reason?: string,
  cancelledBy?: string
): Promise<Booking> => {
  const res = await axiosInstance.patch(`/bookings/cancel/${id}`, {
    reason,
    cancelledBy,
  });

  return res.data.booking;
};

export const checkInBooking = async (
  bookingCode: string
): Promise<Booking> => {
  const res = await axiosInstance.patch(
    `/bookings/check-in/${bookingCode}`
  );

  return res.data.booking;
};

export const verifyTicket = async (
  bookingCode: string
): Promise<Booking> => {
  const res = await axiosInstance.post("/bookings/verify-ticket", {
    bookingCode,
  });
  
  return res.data.booking;
};
export const markNoShowBooking = async (id: string): Promise<Booking> => {
  const res = await axiosInstance.patch(`/bookings/${id}/no-show`);
  return res.data.booking;
};

export const completeBooking = async (id: string): Promise<Booking> => {
  const res = await axiosInstance.patch(`/bookings/${id}/complete`);
  return res.data.booking;
};

export const getOwnerRefundRequests = async () => {
  const res = await axiosInstance.get("/bookings/owner/refund-requests");
  return res.data.requests || res.data;
};

export const ownerRespondCancellation = async (id: string, payload: { approve: boolean; remark: string; cancelledBy?: string }) => {
  const res = await axiosInstance.patch(`/bookings/owner-respond/${id}`, payload);
  return res.data;
};