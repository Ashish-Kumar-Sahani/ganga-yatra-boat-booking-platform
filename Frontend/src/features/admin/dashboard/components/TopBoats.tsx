import { useAdminDashboardStore } from "../store/dashboardStore";

export default function TopBoats() {
  const data = useAdminDashboardStore((state) => state.data);
  const loading = useAdminDashboardStore((state) => state.loading);

  if (loading || !data) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow xl:col-span-2 h-[310px] animate-pulse flex items-center justify-center text-slate-400">
        Loading top performing boats...
      </div>
    );
  }

  const list = data.topBoats || [];

  return (
    <div className="rounded-2xl bg-white p-6 shadow xl:col-span-2">
      <h2 className="text-lg font-bold text-blue-950">Top Performing Boats</h2>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-slate-500">
              <th className="py-3">Boat Name</th>
              <th>Owner</th>
              <th>Trips</th>
              <th>Revenue</th>
            </tr>
          </thead>

          <tbody>
            {list.map((boat: any, idx: number) => (
              <tr key={idx} className="border-b">
                <td className="py-4 font-semibold text-blue-950">{boat.boatName}</td>
                <td>{boat.ownerName}</td>
                <td>{boat.trips}</td>
                <td className="font-bold text-blue-950">₹{boat.revenue.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-6">No top performing boats data available.</p>
        )}
      </div>
    </div>
  );
}