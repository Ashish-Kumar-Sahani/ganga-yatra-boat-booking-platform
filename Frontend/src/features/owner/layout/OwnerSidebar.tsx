import { useEffect } from "react";
import { LogOut, X } from "lucide-react";
import OwnerLogo from "./OwnerLogo";
import OwnerSideLink from "./OwnerSideLink";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useOwnerStore } from "@/features/owner/dashboard/store/ownerStore";
import { getMenuForPanel } from "@/utils/menuGenerator";

type Props = {
  sidebarOpen: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onLogout: () => void;
};

export default function OwnerSidebar({
  sidebarOpen,
  mobileOpen,
  onMobileClose,
  onLogout,
}: Props) {
  const user = useAuthStore((state) => state.user);
  const { dashboard, fetchDashboard } = useOwnerStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const filteredMenu = getMenuForPanel("owner", user?.role || "", user?.permissions || []);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 hidden h-screen w-72 bg-white shadow-xl transition-all duration-300 lg:flex lg:flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="shrink-0 p-5">
          <OwnerLogo />
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-5 pb-4">
          {filteredMenu.map((item) => (
            <OwnerSideLink key={item.path} item={item} />
          ))}
        </nav>

        <div className="shrink-0 space-y-4 border-t border-slate-100 bg-white p-5">
          <OwnerOverview dashboard={dashboard} />

          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <aside className="flex h-full w-72 flex-col bg-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between p-5">
              <OwnerLogo />

              <button
                onClick={onMobileClose}
                className="rounded-xl p-2 hover:bg-slate-100"
              >
                <X />
              </button>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto px-5 pb-4">
              {filteredMenu.map((item) => (
                <OwnerSideLink
                  key={item.path}
                  item={item}
                  onClick={onMobileClose}
                />
              ))}
            </nav>

            <div className="shrink-0 space-y-4 border-t border-slate-100 bg-white p-5">
              <OwnerOverview dashboard={dashboard} />

              <button
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-650 hover:bg-red-50"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function OwnerOverview({ dashboard }: { dashboard: any }) {
  return (
    <div className="rounded-2xl bg-blue-50 p-4">
      <h3 className="text-sm font-bold text-blue-950">Owner Overview</h3>

      <p className="mt-2 text-xs text-green-600">● Account Verified</p>

      <div className="mt-4 space-y-2 text-xs text-blue-950">
        <p>
          Total Boats: <b>{dashboard?.totalBoats ?? 0}</b>
        </p>

        <p>
          Today Trips: <b>{dashboard?.todayBookings ?? 0}</b>
        </p>

        <p>
          Total Earnings: <b>₹{(dashboard?.totalEarnings ?? 0).toLocaleString("en-IN")}</b>
        </p>
      </div>
    </div>
  );
}