interface Props {
  bookings: any[];
}

export default function StaffRecentBookings({ bookings }: Props) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-blue-50/50 flex flex-col h-full">
      <h3 className="mb-5 text-xl font-bold text-slate-800">
        Recent Bookings
      </h3>

      <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px]">
        {bookings && bookings.length > 0 ? (
          bookings.map((b) => {
            const schedule = b.slotId?.scheduleId;
            const route = schedule?.routeId;
            const boatName = schedule?.boatId?.boatName || "Boat";

            return (
              <div
                key={b._id}
                className="rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/5 p-4 space-y-2 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900">{b.passengerName}</h4>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">
                      Code: {b.bookingCode || b._id.slice(-8)}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    b.bookingStatus === "CONFIRMED"
                      ? "bg-green-50 text-green-700"
                      : b.bookingStatus === "COMPLETED"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-red-50 text-red-700"
                  }`}>
                    {b.bookingStatus}
                  </span>
                </div>

                <div className="text-xs text-slate-500 pt-1 border-t space-y-1">
                  {route && (
                    <p>
                      Route: <span className="font-semibold text-slate-700">{route.sourceGhatId?.name} → {route.destinationGhatId?.name}</span>
                    </p>
                  )}
                  <p>
                    Vessel: <span className="font-semibold text-slate-700">{boatName}</span>
                  </p>
                  <p>
                    Seats Booked: <span className="font-semibold text-slate-700">{b.seatsBooked}</span> | Type: <span className="font-semibold text-slate-700">{b.bookingType}</span>
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <p className="text-sm font-semibold">No recent bookings found.</p>
          </div>
        )}
      </div>
    </div>
  );
}