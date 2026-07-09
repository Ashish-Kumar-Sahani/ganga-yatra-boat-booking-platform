import axiosInstance from "@/api/axiosInstance";

export const getPendingRefunds = async () => {
  const res = await axiosInstance.get("/bookings/refunds/pending");
  return res.data;
};

export const getBookingById = async (id: string) => {
  const res = await axiosInstance.get(`/bookings/${id}`);
  return res.data;
};

export const approveRefund = async (id: string, payload: { refundAmount?: number; remark?: string }) => {
  const res = await axiosInstance.patch(`/bookings/refunds/${id}/approve`, payload);
  return res.data;
};

export const rejectRefund = async (id: string, payload: { reason: string }) => {
  const res = await axiosInstance.patch(`/bookings/refunds/${id}/reject`, payload);
  return res.data;
};

export const getRefundLogs = async () => {
  const res = await axiosInstance.get("/bookings/refunds/logs");
  return res.data;
};
