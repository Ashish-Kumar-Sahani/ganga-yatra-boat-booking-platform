import { create } from "zustand";

import { getMyBookings } from "../api/bookingApi";

import type { Booking } from "../types/booking.types";

type BookingStore = {
  bookings: Booking[];

  loading: boolean;

  error: string | null;

  fetchBookings: () => Promise<void>;
};

export const useBookingStore =
  create<BookingStore>((set) => ({
    bookings: [],

    loading: false,

    error: null,

    fetchBookings: async () => {
      try {
        set({
          loading: true,
          error: null,
        });

        const bookings =
          await getMyBookings();

        set({
          bookings,
          loading: false,
        });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error?.response?.data?.message ||
            "Failed to load bookings",
        });
      }
    },
  }));