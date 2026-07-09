type Props = {
  open: boolean;
  data: any;
  loading?: boolean;
  onClose: () => void;
};

export default function SlotPassengersDrawer({
  open,
  data,
  loading = false,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="h-full w-full max-w-4xl overflow-y-auto bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-950">
              Slot Passengers
            </h2>
            <p className="text-sm text-slate-500">
              Total Passengers: {data?.totalPassengers || 0} | Revenue: ₹
              {data?.totalRevenue || 0}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-4 py-2 font-semibold"
          >
            Close
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-slate-50 p-8 text-center font-semibold">
            Loading passengers...
          </div>
        ) : data?.passengers?.length === 0 ? (
          <p className="text-slate-500">No passengers found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-3">Code</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Check-In</th>
              </tr>
            </thead>

            <tbody>
              {data?.passengers?.map((p: any) => (
                <tr key={p.bookingId} className="border-b">
                  <td className="py-3 font-semibold">{p.bookingCode}</td>
                  <td>{p.passengerName}</td>
                  <td>{p.passengerPhone}</td>
                  <td>{p.seatsBooked}</td>
                  <td>₹{p.totalAmount}</td>
                  <td>{p.paymentStatus}</td>
                  <td>{p.bookingStatus}</td>
                  <td>{p.checkInStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button
          onClick={() => window.print()}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
        >
          Print Passenger Report
        </button>
      </div>
    </div>
  );
}