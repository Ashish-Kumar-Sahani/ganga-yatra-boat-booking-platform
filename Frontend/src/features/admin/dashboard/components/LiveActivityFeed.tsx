const activities = [
  "New booking from Assi Ghat",
  "Boat approved by authority",
  "Owner registered successfully",
  "Payment completed ₹1200",
  "Route updated by admin",
];

export default function LiveActivityFeed() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-lg font-bold text-blue-950">
        Live Activity
      </h2>

      <div className="mt-5 space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center gap-3"
          >
            <div className="h-3 w-3 rounded-full bg-green-500" />

            <p className="text-sm text-slate-700">
              {activity}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}