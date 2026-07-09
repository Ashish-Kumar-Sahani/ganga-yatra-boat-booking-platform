import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useAdminDashboardStore } from "../store/dashboardStore";

export default function BoatTypeChart() {
  const data = useAdminDashboardStore((state) => state.data);
  const loading = useAdminDashboardStore((state) => state.loading);

  if (loading || !data) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow h-[380px] animate-pulse flex items-center justify-center text-slate-400">
        Loading chart...
      </div>
    );
  }

  const { stats } = data;
  const chartData = [
    { name: "Online Boats", value: stats.onlineBoats },
    { name: "Offline Boats", value: stats.offlineBoats },
  ];

  const colors = ["#16a34a", "#dc2626"];

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-lg font-bold text-blue-950">Boats Availability Split</h2>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}