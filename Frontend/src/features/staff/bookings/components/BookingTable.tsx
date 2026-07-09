import type { StaffBooking } from "../types/booking.types";
import { cancelStaffBooking, checkInStaffBooking } from "../api/bookingApi";

type Props = {
  bookings?: StaffBooking[];
  onRefresh?: () => Promise<void>;
};

export default function BookingTable({ bookings = [], onRefresh }: Props) {
  const handleCancel = async (bookingId: string) => {
    if (!confirm("Cancel this booking?")) return;

    try {
      await cancelStaffBooking(bookingId);
      await onRefresh?.();
      alert("Booking cancelled successfully");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Cancel failed");
    }
  };

  const handleCheckIn = async (bookingCode?: string) => {
    if (!bookingCode) {
      alert("Booking code not found");
      return;
    }

    try {
      await checkInStaffBooking(bookingCode);
      await onRefresh?.();
      alert("Passenger checked in successfully");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Check-in failed");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1150px] text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-4">Code</th>
              <th>Passenger</th>
              <th>Boat</th>
              <th>Route</th>
              <th>Seats</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Check-In</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={11} className="p-6 text-center text-slate-500">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => {
                const schedule = booking.slotId?.scheduleId;
                const boat = schedule?.boatId;
                const route = schedule?.routeId;

                return (
                  <tr key={booking._id} className="border-t hover:bg-slate-50">
                    <td className="p-4 font-bold text-blue-950">
                      {booking.bookingCode || booking._id.slice(-8)}
                    </td>

                    <td>
                      <p className="font-semibold text-blue-950">
                        {booking.passengerName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {booking.passengerPhone}
                      </p>
                    </td>

                    <td>
                      {boat?.boatName || "N/A"}
                      <p className="text-xs text-slate-500">
                        {boat?.boatNumber || ""}
                      </p>
                    </td>

                    <td>
                      {route?.sourceGhatId?.name || "Source"} →{" "}
                      {route?.destinationGhatId?.name || "Destination"}
                    </td>

                    <td>{booking.seatsBooked}</td>

                    <td>
                      ₹{Number(booking.totalAmount || 0).toLocaleString("en-IN")}
                    </td>

                    <td>
                      <Badge value={booking.bookingType} />
                    </td>

                    <td>
                      <Badge value={booking.paymentStatus} />
                    </td>

                    <td>
                      <Badge value={booking.bookingStatus} />
                    </td>

                    <td>
                      <Badge value={booking.checkInStatus} />
                    </td>

                    <td>
                      <div className="flex gap-2">
                        {booking.checkInStatus !== "CHECKED_IN" &&
                          booking.bookingStatus !== "CANCELLED" && (
                            <button
                              onClick={() =>
                                handleCheckIn(booking.bookingCode)
                              }
                              className="rounded bg-green-600 px-3 py-1 text-xs font-bold text-white"
                            >
                              Check In
                            </button>
                          )}

                        {booking.bookingStatus !== "CANCELLED" &&
                          booking.bookingStatus !== "COMPLETED" && (
                            <button
                              onClick={() => handleCancel(booking._id)}
                              className="rounded bg-red-500 px-3 py-1 text-xs font-bold text-white"
                            >
                              Cancel
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Badge({ value }: { value: string }) {
  const style =
    value === "PAID" ||
    value === "CONFIRMED" ||
    value === "CHECKED_IN" ||
    value === "COMPLETED"
      ? "bg-green-100 text-green-700"
      : value === "CANCELLED" || value === "FAILED" || value === "NO_SHOW"
      ? "bg-red-100 text-red-700"
      : value === "EMERGENCY"
      ? "bg-orange-100 text-orange-700"
      : "bg-blue-100 text-blue-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${style}`}>
      {value}
    </span>
  );
}