export default function StaffTeamActivity() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h3 className="mb-5 text-xl font-bold">
        Team Activity
      </h3>

      <div className="space-y-4">
        <div className="rounded-2xl bg-slate-50 p-4">
          Driver assigned to Route A
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          Boat inspection completed
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          Schedule updated
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          5 bookings approved
        </div>
      </div>
    </div>
  );
}