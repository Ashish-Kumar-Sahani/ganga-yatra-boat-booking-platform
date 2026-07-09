import { IndianRupee } from "lucide-react";
import { useAdminDashboardStore } from "../store/dashboardStore";

export default function RevenueOverview() {
  const data = useAdminDashboardStore((state) => state.data);
  const loading = useAdminDashboardStore((state) => state.loading);

  if (loading || !data) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow h-[220px] animate-pulse flex items-center justify-center text-slate-400">
        Loading revenue...
      </div>
    );
  }

  const { stats } = data;
  const monthlyFormatted = stats.monthlyRevenue >= 100000 
    ? `₹${(stats.monthlyRevenue / 100000).toFixed(2)}L`
    : `₹${stats.monthlyRevenue.toLocaleString("en-IN")}`;

  const targetPercentage = Math.min(Math.round((stats.monthlyRevenue / 500000) * 100), 100);

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-blue-950">
          Monthly Revenue
        </h2>

        <IndianRupee className="text-green-600" />
      </div>

      <h3 className="mt-5 text-4xl font-extrabold text-blue-950">
        {monthlyFormatted}
      </h3>

      <p className="mt-2 text-slate-600 text-xs">
        Today's earnings: <b>₹{stats.todayRevenue.toLocaleString("en-IN")}</b>
      </p>

      <div className="mt-8 h-3 rounded-full bg-slate-100">
        <div 
          className="h-3 rounded-full bg-green-500 transition-all duration-500"
          style={{ width: `${targetPercentage}%` }}
        ></div>
      </div>

      <div className="mt-3 flex justify-between text-sm text-slate-500 font-semibold">
        <span>Target Progress (Goal: 5L)</span>
        <span>{targetPercentage}%</span>
      </div>
    </div>
  );
}