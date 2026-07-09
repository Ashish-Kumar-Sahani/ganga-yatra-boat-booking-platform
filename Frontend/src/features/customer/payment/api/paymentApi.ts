import API from "@/api/axiosInstance";

export const createRazorpayOrder = async (bookingId: string) => {
  const res = await API.post("/payments/create-order", {
    bookingId,
  });

  return res.data;
};

export const verifyRazorpayPayment = async (data: {
  bookingId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const res = await API.post("/payments/verify", data);
  return res.data;
};

export const getPaymentByBooking = async (bookingId: string) => {
  const res = await API.get(`/payments/booking/${bookingId}`);
  return res.data;
};