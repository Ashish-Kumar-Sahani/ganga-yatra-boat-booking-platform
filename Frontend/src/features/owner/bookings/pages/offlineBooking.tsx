import { useEffect, useMemo, useState } from "react";

import OfflineBookingForm from "../components/OfflineBookingForm";
import OfflineBookingStats from "../components/OfflineBookingStats";

import { getOwnerSlots } from "@/features/owner/slots/api/slotApi";
import { getOwnerBookings } from "../api/bookingApi";

import type { Slot } from "@/features/owner/slots/types/slot.types";
import type { Booking } from "../types/booking.types";

export default function OfflineBooking() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [slotData, bookingData] = await Promise.all([
        getOwnerSlots(),
        getOwnerBookings(),
      ]);

      setSlots(Array.isArray(slotData) ? slotData : []);
      setBookings(Array.isArray(bookingData) ? bookingData : []);
    } catch (error) {
      console.error("Offline booking data error:", error);
      setSlots([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const offlineAndEmergencyBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.bookingType === "OFFLINE" ||
          booking.bookingType === "EMERGENCY"
      ),
    [bookings]
  );

  const availableSlots = useMemo(
    () =>
      slots.filter((slot) => {
        const offlineAvailable =
          (slot.offlineSeats || 0) - (slot.bookedOfflineSeats || 0);

        const emergencyAvailable =
          (slot.emergencySeats || 0) - (slot.bookedEmergencySeats || 0);

        return (
          slot.status === "OPEN" &&
          (offlineAvailable > 0 || emergencyAvailable > 0)
        );
      }),
    [slots]
  );

  return (
    <div className="space-y-6 p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">
            Offline & Emergency Booking
          </h1>

          <p className="text-slate-500">
            Create walk-in and emergency bookings for owner/manager operations
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="w-fit rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <OfflineBookingStats bookings={offlineAndEmergencyBookings} />

      {loading ? (
        <div className="rounded-2xl bg-white p-6 text-center font-semibold">
          Loading booking data...
        </div>
      ) : (
        <OfflineBookingForm
          slots={availableSlots}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}