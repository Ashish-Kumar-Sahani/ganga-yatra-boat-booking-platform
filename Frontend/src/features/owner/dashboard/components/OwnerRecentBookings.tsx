import type { OwnerDashboardData } from "../types/owner.types";

type Props = {
  dashboard: OwnerDashboardData | null;
};

export default function OwnerRecentBookings({ dashboard }: Props) {
  const bookings = dashboard?.recentBookings || [];

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-blue-950">Recent Bookings</h2>
        <button className="text-sm font-semibold text-blue-600">View All</button>
      </div>

      <div className="mt-5 space-y-4">
        {bookings.length === 0 ? (
          <p className="text-sm text-slate-500">No recent bookings found.</p>
        ) : (
          bookings.map((booking: any) => (
            <div
              key={booking._id}
              className="flex items-center justify-between border-b pb-4 last:border-none"
            >
              <div>
                <h4 className="font-semibold text-blue-950">
                  {booking.passengerName}
                </h4>
                <p className="text-xs text-slate-500">
                  Seats: {booking.seatsBooked} • {booking.bookingType}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-500">
                  {new Date(booking.createdAt).toLocaleDateString("en-IN")}
                </p>

                <b className="text-blue-950">₹{booking.totalAmount}</b>

                <p className="mt-1 rounded-lg bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                  {booking.bookingStatus}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}