export default function StaffQuickActions() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h3 className="mb-5 text-xl font-bold">
        Quick Actions
      </h3>

      <div className="space-y-3">
        <button className="w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white">
          Add Boat
        </button>

        <button className="w-full rounded-2xl bg-green-600 py-3 font-semibold text-white">
          Approve Booking
        </button>

        <button className="w-full rounded-2xl bg-purple-600 py-3 font-semibold text-white">
          Assign Staff
        </button>

        <button className="w-full rounded-2xl bg-orange-500 py-3 font-semibold text-white">
          Generate Report
        </button>
      </div>
    </div>
  );
}