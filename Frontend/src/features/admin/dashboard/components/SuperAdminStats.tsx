import { CalendarCheck, IndianRupee, Wallet, TrendingUp, Sparkles, RotateCcw, XCircle } from "lucide-react";
import { useAdminDashboardStore } from "../store/dashboardStore";

export default function SuperAdminStats() {
  const data = useAdminDashboardStore((state) => state.data);
  const loading = useAdminDashboardStore((state) => state.loading);

  if (loading || !data) {
    return (
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-white/50 shadow-sm border border-slate-100"
          ></div>
        ))}
      </div>
    );
  }

  const { stats } = data;

  const cards = [
    {
      title: "Lifetime Revenue",
      value: `₹${Number(stats.overallRevenue || 0).toLocaleString("en-IN")}`,
      growth: `Platform Gross: ₹${Number(stats.grossRevenue || 0).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Current Month Revenue",
      value: `₹${Number(stats.currentMonthRevenue || 0).toLocaleString("en-IN")}`,
      growth: `Last 30 Days Target`,
      icon: CalendarCheck,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Current Year Revenue",
      value: `₹${Number(stats.currentYearRevenue || 0).toLocaleString("en-IN")}`,
      growth: `Fiscal Cumulative`,
      icon: Sparkles,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      title: "Today's Revenue",
      value: `₹${Number(stats.dailyRevenue || 0).toLocaleString("en-IN")}`,
      growth: `Platform Collection`,
      icon: Wallet,
      color: "text-teal-600 bg-teal-50",
    },
    {
      title: "Weekly Revenue",
      value: `₹${Number(stats.weeklyRevenue || 0).toLocaleString("en-IN")}`,
      growth: `Trailing 7 Days`,
      icon: TrendingUp,
      color: "text-cyan-600 bg-cyan-50",
    },
    {
      title: "Net Platform Revenue",
      value: `₹${Number(stats.netRevenue || 0).toLocaleString("en-IN")}`,
      growth: `Gross minus Refunds`,
      icon: IndianRupee,
      color: "text-green-600 bg-green-50",
    },
    {
      title: "Total Refunds Processed",
      value: `₹${Number(stats.totalRefund || 0).toLocaleString("en-IN")}`,
      growth: `Returned Fares`,
      icon: RotateCcw,
      color: "text-red-600 bg-red-50",
    },
    {
      title: "Cancelled Bookings",
      value: (stats.cancelledBookings || 0).toLocaleString("en-IN"),
      growth: `Completed: ${stats.completedTrips || 0}`,
      icon: XCircle,
      color: "text-pink-600 bg-pink-50",
    },
  ];

  return (
    <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow transition-all duration-300">
            <div className="flex justify-between items-center gap-3">
              <div>
                <p className="text-slate-500 text-xs font-semibold">{item.title}</p>
                <h3 className="mt-2 text-xl font-black text-slate-900">{item.value}</h3>
              </div>
              <div className={`rounded-xl p-3 shrink-0 ${item.color}`}>
                <Icon size={20} />
              </div>
            </div>
            <div className="mt-4 border-t pt-2 text-xs font-bold text-slate-500">
              {item.growth}
            </div>
          </div>
        );
      })}
    </div>
  );
}