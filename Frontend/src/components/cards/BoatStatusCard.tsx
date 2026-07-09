const boats = [
  {
    name: "Luxury Boat",
    status: "Available",
  },
  {
    name: "Deluxe Boat",
    status: "On Ride",
  },
  {
    name: "Family Boat",
    status: "Maintenance",
  },
  {
    name: "Classic Boat",
    status: "Available",
  },
];

export default function BoatStatusCard() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-black">
        My Boats Status
      </h2>

      <div className="space-y-4">
        {boats.map((boat) => (
          <div
            key={boat.name}
            className="flex items-center justify-between"
          >
            <h3 className="font-bold">
              {boat.name}
            </h3>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                boat.status === "Available"
                  ? "bg-green-100 text-green-700"
                  : boat.status === "On Ride"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {boat.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}