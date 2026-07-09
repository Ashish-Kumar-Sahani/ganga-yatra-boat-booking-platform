import { LogOut, X, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import { getMenuForPanel, type MenuItem } from "@/utils/menuGenerator";

type Props = {
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onLogout: () => void;
};

export default function AuthoritySidebar({
  sidebarOpen,
  setSidebarOpen,
  mobileOpen,
  onMobileClose,
  onLogout,
}: Props) {
  const user = useAuthStore((state: any) => state.user);

  const filteredMenu = getMenuForPanel("authority", user?.role || "", user?.permissions || []);

  const getCityLabel = () => {
    if (user?.role === "SUPER_ADMIN") return "All Cities (Admin)";
    return user?.cityId?.name || user?.city || "Assigned City";
  };

  const renderSideLink = (item: MenuItem, onClick?: () => void) => {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
            isActive
              ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
              : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
          }`
        }
      >
        <Icon size={18} className="shrink-0" />
        <span className={`transition-all duration-300 ${sidebarOpen ? "opacity-100 block" : "lg:opacity-0 lg:hidden"}`}>
          {item.label}
        </span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 hidden h-screen bg-white shadow-xl transition-all duration-300 lg:flex lg:flex-col ${
          sidebarOpen ? "w-72" : "w-20"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-black text-white">
              GY
            </div>
            {sidebarOpen && (
              <span className="text-lg font-black text-blue-950 tracking-wider">
                GOVT PORTAL
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden rounded-lg p-1.5 hover:bg-slate-100 lg:block text-slate-400"
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 pb-4">
          {filteredMenu.map((item) => renderSideLink(item))}
        </nav>

        <div className="shrink-0 space-y-4 border-t border-slate-100 bg-white p-4">
          {sidebarOpen && (
            <div className="rounded-2xl bg-blue-50 p-4">
              <h3 className="text-xs font-black uppercase text-blue-900 tracking-wider">
                Jurisdiction
              </h3>
              <p className="mt-1 text-sm font-bold text-blue-950 truncate">
                {getCityLabel()}
              </p>
              <p className="mt-2 text-xs font-semibold text-green-600 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Active Authority Session
              </p>
            </div>
          )}

          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <aside className="flex h-full w-72 flex-col bg-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-black text-white">
                  GY
                </div>
                <span className="text-lg font-black text-blue-950 tracking-wider">
                  GOVT PORTAL
                </span>
              </div>
              <button
                onClick={onMobileClose}
                className="rounded-xl p-2 hover:bg-slate-100"
              >
                <X />
              </button>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto px-5 pb-4">
              {filteredMenu.map((item) => renderSideLink(item, onMobileClose))}
            </nav>

            <div className="shrink-0 space-y-4 border-t border-slate-100 bg-white p-5">
              <div className="rounded-2xl bg-blue-50 p-4">
                <h3 className="text-xs font-black uppercase text-blue-900 tracking-wider">
                  Jurisdiction
                </h3>
                <p className="mt-1 text-sm font-bold text-blue-950 truncate">
                  {getCityLabel()}
                </p>
              </div>

              <button
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
