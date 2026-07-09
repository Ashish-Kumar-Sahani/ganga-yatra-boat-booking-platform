import { useEffect, useState } from "react";
import { useAdminDashboardStore } from "../store/dashboardStore";
import SuperAdminHero from "@/features/admin/dashboard/components/SuperAdminHero";
import BookingsOverviewChart from "@/features/admin/dashboard/components/BookingsOverviewChart";
import BoatTypeChart from "@/features/admin/dashboard/components/BoatTypeChart";
import RecentBookings from "@/features/admin/dashboard/components/RecentBookings";
import TopBoats from "@/features/admin/dashboard/components/TopBoats";
import RevenueOverview from "@/features/admin/dashboard/components/RevenueOverview";
import QuickActions from "@/features/admin/dashboard/components/QuickActions";
import SystemStatus from "@/features/admin/dashboard/components/SystemStatus";
import { Calendar } from "lucide-react";

export default function Dashboard() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const { data, loading, error, fetchDashboard } = useAdminDashboardStore();

  useEffect(() => {
    fetchDashboard(selectedYear);

    const interval = setInterval(() => {
      fetchDashboard(selectedYear);
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchDashboard, selectedYear]);

  if (loading && !data) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-[#f5f8ff]">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-[#f5f8ff] p-6">
        <div className="rounded-2xl bg-white p-8 shadow-md text-center max-w-md border border-red-100">
          <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-500 font-black text-xl">
            ⚠️
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-800">Failed to load dashboard</h3>
          <p className="mt-2 text-sm text-slate-600">{error}</p>
          <button
            onClick={() => fetchDashboard(selectedYear)}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f8ff] p-6 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-3xl font-black text-blue-950">Super Admin Dashboard</h1>
          <p className="text-slate-500 font-semibold text-sm">Real-time platform performance monitoring</p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
          <Calendar size={16} className="text-slate-500" />
          <span className="text-xs font-bold text-slate-600">Fiscal Year:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-transparent text-xs font-black text-slate-800 focus:outline-none cursor-pointer"
          >
            {Array.from({ length: 5 }).map((_, idx) => {
              const year = currentYear - idx;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>
      </div>

      <SuperAdminHero />

      <section className="grid gap-6 xl:grid-cols-3">
        <BookingsOverviewChart />
        <RecentBookings />
        <TopBoats />
        <BoatTypeChart />
      </section>

      <section className="grid gap-6 pb-6 md:grid-cols-2 xl:grid-cols-3">
        <RevenueOverview />
        <QuickActions />
        <SystemStatus />
      </section>
    </div>
  );
}