import { useAdminDashboardStore } from "../store/dashboardStore";

export default function TopGhats() {
  const data = useAdminDashboardStore((state) => state.data);
  const loading = useAdminDashboardStore((state) => state.loading);

  if (loading || !data) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow h-[310px] animate-pulse flex items-center justify-center text-slate-400">
        Loading top ghats...
      </div>
    );
  }

  const list = data.topGhats || [];

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-lg font-bold text-blue-950">Top Ghats</h2>

      <div className="mt-5 space-y-4">
        {list.map((ghat: any, index: number) => (
          <div key={ghat.name} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-700">
                {index + 1}
              </div>

              <div>
                <h4 className="font-semibold text-blue-950">{ghat.name}</h4>
                <p className="text-xs text-slate-500">{ghat.bookings} trips booked</p>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-6">No ghat bookings data available.</p>
        )}
      </div>
    </div>
  );
}