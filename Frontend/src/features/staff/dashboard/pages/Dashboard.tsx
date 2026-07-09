import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useManagerStore } from "../store/staffStore";
import ManagerDashboard from "../components/ManagerDashboard";
import StaffDriverDashboard from "../components/StaffDriverDashboard";
import { RefreshCcw, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const { data, loading, error, fetchDashboard } = useManagerStore();

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(() => {
      fetchDashboard();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="text-sm font-semibold text-slate-500">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="rounded-full bg-red-50 p-4 text-red-600">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Something went wrong</h2>
        <p className="max-w-md text-sm text-slate-500">{error}</p>
        <button
          onClick={() => fetchDashboard()}
          className="mt-2 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <RefreshCcw size={16} />
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800">No data found</h2>
        <p className="max-w-md text-sm text-slate-500">There is no dashboard information available at the moment.</p>
        <button
          onClick={() => fetchDashboard()}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black text-blue-950">Dashboard</h1>
          <p className="text-sm text-slate-500">Real-time statistics and summaries</p>
        </div>
        <button
          onClick={() => fetchDashboard()}
          className="flex self-start items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-all active:scale-95 shadow-sm"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {user?.role === "MANAGER" ? (
        <ManagerDashboard data={data} />
      ) : (
        <StaffDriverDashboard data={data} />
      )}
    </div>
  );
}