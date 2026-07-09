import { useEffect } from "react";
import { Clock3, MapPin, Route, Ship } from "lucide-react";
import AdminPageHeader from "@/features/admin/analytics/components/AdminPageHeader";
import AdminStatsGrid from "@/features/admin/analytics/components/AdminStatsGrid";
import RouteTable from "@/features/admin/routes/components/RouteTable";
import { useRouteStore } from "../store/routeStore";
import { useGhatStore } from "@/features/admin/ghats/store/ghatStore";
import { useAdminDashboardStore } from "@/features/admin/dashboard/store/dashboardStore";

export default function RoutesPage() {
  const { routes } = useRouteStore();
  const { ghats } = useGhatStore();
  const { data: dashboardData, fetchDashboard } = useAdminDashboardStore();

  useEffect(() => {
    if (!dashboardData) {
      fetchDashboard();
    }
  }, [dashboardData, fetchDashboard]);

  // Calculate average duration
  const activeRoutes = routes.filter(r => r.approvalStatus === "APPROVED");
  const avgDuration = activeRoutes.length > 0
    ? Math.round(activeRoutes.reduce((sum, r) => sum + r.estimatedDurationMinutes, 0) / activeRoutes.length)
    : 0;

  const stats = [
    { title: "Total Routes", value: routes.length.toLocaleString(), icon: Route },
    { title: "Connected Ghats", value: ghats.length.toLocaleString(), icon: MapPin },
    { title: "Total Boats", value: dashboardData?.stats?.boats?.toLocaleString() ?? "—", icon: Ship },
    { title: "Avg Trip Duration", value: avgDuration > 0 ? `${avgDuration} Min` : "—", icon: Clock3 },
  ];

  return (
    <div className="p-6">
      <AdminPageHeader
        title="Routes Management"
        description="Oversee and approve river travel routes, base fares, and night premiums"
      />
      <AdminStatsGrid stats={stats} />
      <RouteTable />
    </div>
  );
}