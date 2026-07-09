import { create } from "zustand";
import { getStaffBookings } from "../api/bookingApi";
import type { StaffBooking } from "../types/booking.types";

interface BookingState {
  bookings: StaffBooking[];
  loading: boolean;
  fetchBookings: () => Promise<void>;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  loading: false,

  fetchBookings: async () => {
    set({ loading: true });
    try {
      const data = await getStaffBookings();
      set({
        bookings: data,
        loading: false,
      });
    } catch {
      set({
        loading: false,
      });
    }
  },
}));