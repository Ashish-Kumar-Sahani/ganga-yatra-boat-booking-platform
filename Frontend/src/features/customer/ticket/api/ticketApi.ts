import API from "@/api/axiosInstance";

export const getBookingTicket =
  async (bookingId: string) => {
    const res = await API.get(
      `/bookings/${bookingId}`
    );

    return res.data;
  };

  export const getTicketByBookingId = async (bookingCode: string) => {
  const res = await API.get(`/tickets/${bookingCode}`);
  return res.data;
};