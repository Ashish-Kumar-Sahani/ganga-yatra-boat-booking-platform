import type { StaffPaymentBooking } from "../types/payment.types";

type Props = {
  bookings?: StaffPaymentBooking[];
};

const money = (value: number) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function PaymentTable({ bookings = [] }: Props) {
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-4">Booking</th>
              <th>Passenger</th>
              <th>Boat</th>
              <th>Route</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Booking</th>
            </tr>
          </thead>

          <tbody>
            {safeBookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-500">
                  No payment records found.
                </td>
              </tr>
            ) : (
              safeBookings.map((booking) => {
                const schedule = booking.slotId?.scheduleId;
                const boat = schedule?.boatId;
                const route = schedule?.routeId;

                return (
                  <tr key={booking._id} className="border-t hover:bg-slate-50">
                    <td className="p-4 font-bold text-blue-950">
                      {booking.bookingCode || booking._id.slice(-6)}
                    </td>

                    <td>
                      {booking.passengerName || "-"}
                      <p className="text-xs text-slate-500">
                        {booking.passengerPhone || ""}
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

                    <td>{booking.bookingType}</td>

                    <td className="font-black text-blue-950">
                      {money(booking.totalAmount)}
                    </td>

                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          booking.paymentStatus === "PAID"
                            ? "bg-green-100 text-green-700"
                            : booking.paymentStatus === "FAILED"
                            ? "bg-red-100 text-red-700"
                            : booking.paymentStatus === "REFUNDED"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>

                    <td>{booking.bookingStatus}</td>
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