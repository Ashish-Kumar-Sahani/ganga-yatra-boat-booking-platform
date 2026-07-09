import axiosInstance from "@/api/axiosInstance";

export const getMyBookings = async () => {
  const res = await axiosInstance.get("/bookings/my-bookings");
  return res.data;
};

export const cancelBooking = async (
  bookingId: string,
  reason: string
) => {
  const res = await axiosInstance.patch(
    `/bookings/cancel/${bookingId}`,
    {
      reason,
    }
  );

  return res.data;
};