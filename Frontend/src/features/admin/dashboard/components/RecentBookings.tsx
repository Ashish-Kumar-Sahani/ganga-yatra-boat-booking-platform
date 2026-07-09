import { useAdminDashboardStore } from "../store/dashboardStore";

export default function RecentBookings() {
  const data = useAdminDashboardStore((state) => state.data);
  const loading = useAdminDashboardStore((state) => state.loading);

  if (loading || !data) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow h-[310px] animate-pulse flex items-center justify-center text-slate-400">
        Loading recent bookings...
      </div>
    );
  }

  const list = data.latestBookings || [];

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-lg font-bold text-blue-950">Recent Bookings</h2>

      <div className="mt-5 space-y-4">
        {list.map((booking: any) => {
          const customerName = booking.passengerName || booking.customerId?.name || "Customer";
          const boatName = booking.slotId?.scheduleId?.boatId?.boatName || "Boat Ride";
          const formattedAmount = `₹${(booking.totalAmount || 0).toLocaleString("en-IN")}`;
          const status = booking.bookingStatus;

          return (
            <div key={booking._id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div>
                <h4 className="font-semibold text-blue-950">{customerName}</h4>
                <p className="text-xs text-slate-500">{boatName}</p>
              </div>

              <div className="text-right">
                <b className="text-blue-950">{formattedAmount}</b>
                <p
                  className={`text-xs font-semibold ${
                    status === "COMPLETED" || status === "CONFIRMED"
                      ? "text-green-600"
                      : status === "PENDING"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {status}
                </p>
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-6">No recent bookings found.</p>
        )}
      </div>
    </div>
  );
}