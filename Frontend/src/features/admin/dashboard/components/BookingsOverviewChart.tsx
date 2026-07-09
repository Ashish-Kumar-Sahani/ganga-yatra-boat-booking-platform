import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAdminDashboardStore } from "../store/dashboardStore";

export default function BookingsOverviewChart() {
  const data = useAdminDashboardStore((state) => state.data);
  const loading = useAdminDashboardStore((state) => state.loading);

  if (loading || !data) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow xl:col-span-2 h-[380px] animate-pulse flex items-center justify-center text-slate-400">
        Loading chart...
      </div>
    );
  }

  const chartData = data.weeklyBookingChart || [];

  return (
    <div className="rounded-2xl bg-white p-6 shadow xl:col-span-2">
      <h2 className="text-lg font-bold text-blue-950">Bookings Overview (Weekly)</h2>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="bookings"
              stroke="#2563eb"
              fill="#dbeafe"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}