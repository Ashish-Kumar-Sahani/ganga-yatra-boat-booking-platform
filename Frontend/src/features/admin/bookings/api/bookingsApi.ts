import axiosInstance from "@/api/axiosInstance";

export const getAllBookingsAdmin = async (params?: any) => {
  const response = await axiosInstance.get("/bookings/all", { params });
  return response.data;
};

export const updateBookingStatusAdmin = async (id: string, bookingStatus: string) => {
  if (bookingStatus === "CANCELLED") {
    const response = await axiosInstance.patch(`/bookings/cancel/${id}`);
    return response.data;
  }
  if (bookingStatus === "COMPLETED") {
    const response = await axiosInstance.patch(`/bookings/${id}/complete`);
    return response.data;
  }
  throw new Error(`Unsupported status transition: ${bookingStatus}`);
};

export const getPendingRefundsAdmin = async () => {
  const response = await axiosInstance.get("/bookings/refunds/pending");
  return response.data;
};

export const approveRefundAdmin = async (id: string, payload?: any) => {
  const response = await axiosInstance.patch(`/bookings/refunds/${id}/approve`, payload);
  return response.data;
};

export const rejectRefundAdmin = async (id: string, reason: string) => {
  const response = await axiosInstance.patch(`/bookings/refunds/${id}/reject`, { reason });
  return response.data;
};

export const getCancellationLogsAdmin = async () => {
  const response = await axiosInstance.get("/bookings/cancellations/logs");
  return response.data;
};

export const getRefundLogsAdmin = async () => {
  const response = await axiosInstance.get("/bookings/refunds/logs");
  return response.data;
};
