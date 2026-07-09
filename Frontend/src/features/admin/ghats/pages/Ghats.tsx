import { useEffect } from "react";
import { CalendarCheck, MapPin, Route, Ship } from "lucide-react";
import AdminPageHeader from "@/features/admin/analytics/components/AdminPageHeader";
import AdminStatsGrid from "@/features/admin/analytics/components/AdminStatsGrid";
import GhatTable from "@/features/admin/ghats/components/GhatTable";
import { useGhatStore } from "../store/ghatStore";
import { useAdminDashboardStore } from "@/features/admin/dashboard/store/dashboardStore";

export default function Ghats() {
  const { ghats } = useGhatStore();
  const { data: dashboardData, fetchDashboard } = useAdminDashboardStore();

  useEffect(() => {
    if (!dashboardData) {
      fetchDashboard();
    }
  }, [dashboardData, fetchDashboard]);

  const stats = [
    { title: "Total Ghats", value: ghats.length.toLocaleString(), icon: MapPin },
    { title: "Active Routes", value: dashboardData?.stats?.routes?.toLocaleString() ?? "—", icon: Route },
    { title: "Total Bookings", value: dashboardData?.stats?.totalBookings?.toLocaleString() ?? "—", icon: CalendarCheck },
    { title: "Total Boats", value: dashboardData?.stats?.boats?.toLocaleString() ?? "—", icon: Ship },
  ];

  return (
    <div className="p-6">
      <AdminPageHeader
        title="Ghats Management"
        description="Configure Varanasi's boat loading docks, boarding ghats, and GPS locations"
      />
      <AdminStatsGrid stats={stats} />
      <GhatTable />
    </div>
  );
}