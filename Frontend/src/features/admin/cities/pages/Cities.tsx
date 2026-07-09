import { useEffect } from "react";
import { Building2, MapPin, Route, Ship } from "lucide-react";
import AdminFilters from "@/features/admin/analytics/components/AdminFilter";
import AdminPageHeader from "@/features/admin/analytics/components/AdminPageHeader";
import AdminStatsGrid from "@/features/admin/analytics/components/AdminStatsGrid";
import CityTable from "@/features/admin/cities/components/CityTable";
import { useCityStore } from "../store/cityStore";
import { useAdminDashboardStore } from "@/features/admin/dashboard/store/dashboardStore";

export default function Cities() {
  const { cities } = useCityStore();
  const { data: dashboardData, fetchDashboard } = useAdminDashboardStore();

  useEffect(() => {
    if (!dashboardData) {
      fetchDashboard();
    }
  }, [dashboardData, fetchDashboard]);

  const stats = [
    { title: "Total Cities", value: cities.length.toLocaleString(), icon: Building2 },
    { title: "Total Ghats", value: dashboardData?.stats?.ghats?.toLocaleString() ?? "—", icon: MapPin },
    { title: "Active Routes", value: dashboardData?.stats?.routes?.toLocaleString() ?? "—", icon: Route },
    { title: "Total Boats", value: dashboardData?.stats?.boats?.toLocaleString() ?? "—", icon: Ship },
  ];

  return (
    <div className="p-6">
      <AdminPageHeader title="Cities Management" description="Manage all operational cities" />
      <AdminStatsGrid stats={stats} />
      <CityTable />
    </div>
  );
}