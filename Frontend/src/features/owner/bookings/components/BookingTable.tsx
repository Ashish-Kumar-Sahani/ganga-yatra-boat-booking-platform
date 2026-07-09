import {
  cancelBooking,
  checkInBooking,
  completeBooking,
  markNoShowBooking,
} from "@/features/owner/bookings/api/bookingApi";

import type { Booking } from "@/features/owner/bookings/types/booking.types";

type BookingTableProps = {
  bookings?: Booking[];
  onRefresh?: () => Promise<void>;
};

export default function BookingTable({
  bookings = [],
  onRefresh,
}: BookingTableProps) {
  const handleCheckIn = async (bookingCode?: string) => {
    try {
      if (!bookingCode) {
        alert("Booking code missing");
        return;
      }

      await checkInBooking(bookingCode);
      alert("Passenger checked-in successfully");
      await onRefresh?.();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Check-in failed");
    }
  };

  const handleNoShow = async (id: string) => {
    try {
      await markNoShowBooking(id);
      alert("Booking marked as no-show");
      await onRefresh?.();
    } catch (error: any) {
      alert(error?.response?.data?.message || "No-show update failed");
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await completeBooking(id);
      alert("Booking completed successfully");
      await onRefresh?.();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Complete failed");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const choice = window.prompt(
        "Select cancellation reason:\n1. Weather Conditions (100% Refund)\n2. Boat Breakdown (100% Refund)\n3. Other Reason (100% Refund)\n\nEnter 1, 2, or 3:",
        "1"
      );

      if (!choice) return;

      let cancelledBy = "OWNER";
      let reason = "Cancelled by owner";

      if (choice === "1") {
        cancelledBy = "WEATHER";
        reason = "Bad weather conditions";
      } else if (choice === "2") {
        cancelledBy = "BREAKDOWN";
        reason = "Boat breakdown / maintenance issue";
      } else if (choice === "3") {
        const customReason = window.prompt("Enter cancellation reason:", "Cancelled by owner");
        if (!customReason) return;
        cancelledBy = "OWNER";
        reason = customReason;
      } else {
        alert("Invalid selection. Cancellation aborted.");
        return;
      }

      await cancelBooking(id, reason, cancelledBy);
      alert("Booking cancelled successfully!");
      await onRefresh?.();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Cancel failed");
    }
  };

  const getPaymentBadge = (status?: string) => {
    if (status === "PAID") return "bg-green-100 text-green-700";
    if (status === "FAILED") return "bg-red-100 text-red-700";
    if (status === "REFUNDED") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const getBookingBadge = (status?: string) => {
    if (status === "COMPLETED") return "bg-blue-100 text-blue-700";
    if (status === "CONFIRMED") return "bg-green-100 text-green-700";
    if (status === "CANCELLED") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const getCheckInBadge = (status?: string) => {
    if (status === "CHECKED_IN") return "bg-green-100 text-green-700";
    if (status === "NO_SHOW") return "bg-orange-100 text-orange-700";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-slate-900">
        Owner Bookings
      </h3>

      {bookings.length === 0 ? (
        <p className="text-sm text-slate-500">No bookings found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-3">Code</th>
                <th>Passenger</th>
                <th>Phone</th>
                <th>Boat</th>
                <th>Route</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Check-In</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => {
                const schedule = booking.slotId?.scheduleId;
                const boat = schedule?.boatId;
                const route = schedule?.routeId;

                const isCancelled = booking.bookingStatus === "CANCELLED";
                const isCompleted = booking.bookingStatus === "COMPLETED";
                const isConfirmed = booking.bookingStatus === "CONFIRMED";
                const isPendingCheckIn = booking.checkInStatus === "PENDING";
                const isCheckedIn = booking.checkInStatus === "CHECKED_IN";
                const isNoShow = booking.checkInStatus === "NO_SHOW";

                return (
                  <tr key={booking._id} className="border-b last:border-0">
                    <td className="py-3 font-semibold text-blue-950">
                      {booking.bookingCode || booking._id.slice(-6)}
                    </td>

                    <td>{booking.passengerName || "N/A"}</td>
                    <td>{booking.passengerPhone || "N/A"}</td>
                    <td>{boat?.boatName || "N/A"}</td>

                    <td>
                      {route?.sourceGhatId?.name || "N/A"} →{" "}
                      {route?.destinationGhatId?.name || "N/A"}
                    </td>

                    <td>{booking.seatsBooked || 0}</td>

                    <td className="font-semibold">
                      ₹{booking.totalAmount || 0}
                    </td>

                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentBadge(
                          booking.paymentStatus
                        )}`}
                      >
                        {booking.paymentStatus || "PENDING"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getBookingBadge(
                          booking.bookingStatus
                        )}`}
                      >
                        {booking.bookingStatus || "PENDING"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getCheckInBadge(
                          booking.checkInStatus
                        )}`}
                      >
                        {booking.checkInStatus || "PENDING"}
                      </span>
                    </td>

                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        {isConfirmed && isPendingCheckIn && (
                          <>
                            <button
                              onClick={() =>
                                handleCheckIn(booking.bookingCode)
                              }
                              className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                            >
                              Check-In
                            </button>

                            <button
                              onClick={() => handleNoShow(booking._id)}
                              className="rounded-lg bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700"
                            >
                              No Show
                            </button>
                          </>
                        )}

                        {isConfirmed && isCheckedIn && (
                          <button
                            onClick={() => handleComplete(booking._id)}
                            className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
                          >
                            Complete
                          </button>
                        )}

                        {!isCancelled && !isCompleted && !isNoShow && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="rounded-lg bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
                          >
                            Cancel
                          </button>
                        )}

                        {isCompleted && (
                          <span className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Completed
                          </span>
                        )}

                        {isCancelled && (
                          <span className="rounded-lg bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            Cancelled
                          </span>
                        )}

                        {isNoShow && !isCancelled && (
                          <span className="rounded-lg bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                            No Show
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}