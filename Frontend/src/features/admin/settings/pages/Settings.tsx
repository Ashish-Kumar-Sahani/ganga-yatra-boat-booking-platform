import { useEffect } from "react";
import { AlertCircle, CreditCard, Percent, Settings as SettingsIcon } from "lucide-react";
import AdminPageHeader from "@/features/admin/analytics/components/AdminPageHeader";
import AdminStatsGrid from "@/features/admin/analytics/components/AdminStatsGrid";
import SettingsPanel from "@/features/admin/settings/components/SettingsPanel";
import { useAdminSettingsStore } from "../store/settingsStore";

export default function Settings() {
  const { settings, fetchSettings } = useAdminSettingsStore();

  useEffect(() => {
    if (!settings) {
      fetchSettings();
    }
  }, [settings, fetchSettings]);

  const stats = [
    { title: "System Name", value: settings?.systemName || "GangaYatra", icon: SettingsIcon },
    { title: "CGST/SGST Rate", value: settings ? `${settings.taxPercentage}%` : "—", icon: Percent },
    { title: "Service Fee", value: settings ? `₹${settings.serviceFee}` : "—", icon: CreditCard },
    { title: "Booking Status", value: settings?.maintenanceMode ? "Maintenance" : "Live", icon: AlertCircle },
  ];

  return (
    <div className="p-6">
      <AdminPageHeader title="System Settings" description="Manage platform configuration, taxes, fees, and API gateways" />
      <AdminStatsGrid stats={stats} />
      <SettingsPanel />
    </div>
  );
}