import { useEffect } from "react";

import BookingStats from "../components/BookingStats";
import BookingTable from "../components/BookingTable";

import {
  useBookingStore,
} from "../store/bookingStore";

export default function Bookings() {
  const {
    bookings,
    loading,
    fetchBookings,
  } = useBookingStore();

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div>
        Loading Bookings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">
          Booking Management
        </h1>

        <p className="text-slate-500">
          Manage all customer bookings
        </p>
      </div>

      <BookingStats
        bookings={bookings}
      />

      <BookingTable
        bookings={bookings}
      />
    </div>
  );
}