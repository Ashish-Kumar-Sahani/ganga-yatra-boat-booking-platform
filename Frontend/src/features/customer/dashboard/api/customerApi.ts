import API from "@/api/axiosInstance";

/* =========================
   PROFILE
========================= */

export const getCustomerProfile = async () => {
  const res = await API.get("/customer/profile");
  return res.data;
};

export const updateCustomerProfile = async (data: any) => {
  const res = await API.put("/customer/profile", data);
  return res.data;
};

/* =========================
   REVIEWS
========================= */

export const getCustomerReviews = async () => {
  const res = await API.get("/customer/reviews");
  return res.data;
};

export const createCustomerReview = async (data: {
  bookingId: string;
  rating: number;
  comment: string;
}) => {
  const res = await API.post("/customer/reviews", data);
  return res.data;
};

export const updateCustomerReview = async (
  reviewId: string,
  data: {
    rating: number;
    comment: string;
  }
) => {
  const res = await API.put(`/customer/reviews/${reviewId}`, data);
  return res.data;
};

export const deleteCustomerReview = async (reviewId: string) => {
  const res = await API.delete(`/customer/reviews/${reviewId}`);
  return res.data;
};

/* =========================
   BOOKINGS
========================= */

export const getMyBookings = async () => {
  const res = await API.get("/bookings/my-bookings");
  return res.data;
};

export const getBookingById = async (bookingId: string) => {
  const res = await API.get(`/bookings/${bookingId}`);
  return res.data;
};

export const getTicketByBookingId = async (bookingId: string) => {
  const res = await API.get(`/tickets/${bookingId}`);
  return res.data;
};

export const getBookingHistory = async () => {
  const res = await API.get("/bookings/my-bookings");
  return res.data;
};

export const cancelBooking = async (
  bookingId: string,
  reason?: string,
  refundMethod?: string
) => {
  const res = await API.patch(`/bookings/cancel/${bookingId}`, {
    reason,
    refundMethod,
  });

  return res.data;
};

/* =========================
   WALLET
========================= */

export const getWallet = async () => {
  const res = await API.get("/customer/wallet");
  return res.data;
};

export const getWalletTransactions = async () => {
  const res = await API.get("/customer/wallet/transactions");
  return res.data;
};

export const getCustomerWallet = async () => {
  const res = await API.get("/customer/wallet");
  return res.data;
};

export const getCustomerWalletTransactions = async () => {
  const res = await API.get("/customer/wallet/transactions");
  return res.data;
};

/* =========================
   LIVE TRACKING
========================= */

export const getLiveTrip = async (bookingId: string) => {
  const res = await API.get(`/customer/live-tracking/${bookingId}`);
  return res.data;
};

/* =========================
   CUSTOMER DASHBOARD
========================= */

export const getCustomerDashboard = async () => {
  const res = await API.get("/customer/dashboard");
  return res.data;
};
export const getAvailableCustomerSlots = async (params: {
  sourceGhatId: string;
  destinationGhatId: string;
  date: string;
  passengers: number;
}) => {
  const res = await API.get("/customer/available-slots", {
    params,
  });

  return res.data;
};

export const searchCustomerTrips = async (params: {
  cityId?: string;
  sourceGhatId: string;
  destinationGhatId: string;
  date: string;
  passengers: number;
}) => {
  const res = await API.get("/customer/search-trips", {
    params,
  });

  return res.data;
};

export const rechargeCustomerWallet = async (amount: number) => {
  const res = await API.post("/customer/wallet/recharge", { amount });
  return res.data;
};

export const payBookingWithWallet = async (bookingId: string) => {
  const res = await API.post("/customer/wallet/pay", { bookingId });
  return res.data;
};

export const rescheduleBooking = async (bookingId: string, newSlotId: string) => {
  const res = await API.patch(`/bookings/${bookingId}/reschedule`, { newSlotId });
  return res.data;
};

export const getSystemSettings = async () => {
  const res = await API.get("/settings");
  return res.data;
};