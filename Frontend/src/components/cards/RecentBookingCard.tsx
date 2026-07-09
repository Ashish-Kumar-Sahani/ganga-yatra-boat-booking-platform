const bookings = [
  {
    customer: "Amit Sharma",
    boat: "Luxury Boat",
    amount: "₹1200",
  },
  {
    customer: "Neha Singh",
    boat: "Deluxe Boat",
    amount: "₹900",
  },
  {
    customer: "Vikas Patel",
    boat: "Family Boat",
    amount: "₹1000",
  },
];

export default function RecentBookingsCard() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-black">
        Recent Bookings
      </h2>

      <div className="space-y-4">
        {bookings.map((item) => (
          <div
            key={item.customer}
            className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
          >
            <div>
              <h3 className="font-bold">
                {item.customer}
              </h3>

              <p className="text-sm text-slate-500">
                {item.boat}
              </p>
            </div>

            <p className="font-black text-blue-700">
              {item.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}