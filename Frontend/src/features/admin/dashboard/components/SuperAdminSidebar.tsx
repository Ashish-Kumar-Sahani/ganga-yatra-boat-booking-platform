import { useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useAdminNotificationsStore } from "../../notifications/store/notificationsStore";
import { getMenuForPanel } from "@/utils/menuGenerator";

// Type definitions
type Props = {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
};

export default function SuperAdminSidebar({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}: Props) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { notifications, fetchNotifications } = useAdminNotificationsStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const filteredSections = getMenuForPanel("admin", user?.role || "", user?.permissions || []);

  const getBadgeCount = (key?: string) => {
    if (key === "notifications") return unreadNotificationsCount;
    return 0;
  };

  const isActiveLink = (path: string) => {
    if (path.includes("?")) {
      const [basePath, query] = path.split("?");
      const roleParam = new URLSearchParams(query).get("role");
      const currentRoleParam = new URLSearchParams(location.search).get("role");
      return location.pathname === basePath && currentRoleParam === roleParam;
    }
    return location.pathname === path && !location.search;
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Main Sidebar Aside */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen bg-[#07162c] text-slate-300 shadow-2xl transition-all duration-300 flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${isCollapsed ? "lg:w-20" : "lg:w-72"} w-72 border-r border-white/5`}
      >
        {/* Header Branding */}
        <div className="flex flex-col flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          <div className="flex h-20 items-center justify-between border-b border-white/10 px-5 shrink-0 transition-all duration-300 bg-[#040f1f]/60">
            <div className="flex items-center gap-3.5 overflow-hidden">
              <span className="text-3xl shrink-0 filter drop-shadow">⛵</span>
              {!isCollapsed && (
                <div className="animate-fade-in transition-all duration-300">
                  <h1 className="text-sm font-black tracking-wider text-white uppercase whitespace-nowrap">GangaYatra</h1>
                  <p className="text-[10px] font-bold text-slate-400 whitespace-nowrap tracking-wide">Varanasi Control Unit</p>
                </div>
              )}
            </div>

            {/* Collapse Trigger on Desktop */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex rounded-xl p-2 bg-white/5 hover:bg-white/10 text-white transition-all shadow border border-white/5 hover:border-white/15"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </div>

          {/* Navigation Links grouped by Section */}
          <nav className="mt-4 px-3 space-y-4 pb-6 select-none">
            {filteredSections.map((sec) => (
              <div key={sec.title} className="space-y-1">
                {/* Section title */}
                {!isCollapsed ? (
                  <h3 className="px-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 animate-fade-in mt-3 first:mt-0">
                    {sec.title}
                  </h3>
                ) : (
                  <div className="border-t border-white/5 my-3 first:hidden"></div>
                )}

                {/* Section links */}
                <div className="space-y-0.5">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const badge = getBadgeCount(item.badgeKey);
                    const active = isActiveLink(item.path);

                    return (
                      <NavLink
                        key={item.label}
                        to={item.path}
                        onClick={() => {
                          if (window.innerWidth < 1024) {
                            onClose();
                          }
                        }}
                        className={`flex items-center gap-3.5 rounded-xl py-3 px-3.5 transition duration-150 group relative font-semibold text-xs tracking-wide ${
                          active
                            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20 font-bold"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        } ${isCollapsed ? "lg:justify-center lg:px-0" : ""}`}
                      >
                        <Icon size={18} className="shrink-0" />
                        
                        {!isCollapsed && (
                          <span className="flex-1 truncate">{item.label}</span>
                        )}

                        {/* Badges count */}
                        {badge > 0 && (
                          <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold shrink-0 tracking-normal ${
                            active
                              ? "bg-white text-blue-700 font-black"
                              : "bg-blue-600 text-white"
                          } ${isCollapsed ? "absolute top-1 right-1" : ""}`}>
                            {badge}
                          </span>
                        )}

                        {/* Collapsed view hover tooltips */}
                        {isCollapsed && (
                          <div className="absolute left-full ml-3.5 px-3 py-2 rounded-xl bg-slate-950 text-white text-[11px] font-bold invisible opacity-0 lg:group-hover:visible lg:group-hover:opacity-100 transition shadow-xl border border-white/10 whitespace-nowrap z-50">
                            {item.label}
                            {badge > 0 && ` (${badge})`}
                          </div>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer info/Status */}
        <div className="p-3 border-t border-white/10 bg-[#040f1f]/50 shrink-0">
          {!isCollapsed && (
            <div className="mb-3 rounded-xl bg-white/5 border border-white/5 p-3 text-[10px] text-slate-400 transition-all duration-300">
              <h4 className="font-bold text-slate-200">Ganga Operations</h4>
              <p className="mt-1 text-[9px] text-slate-400">Environment: PROD-CONSOLE</p>
              <div className="mt-2.5 flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
                <span>Operations Stable</span>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3.5 rounded-xl py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition font-bold text-xs ${
              isCollapsed ? "lg:justify-center lg:px-0 px-3.5" : "px-3.5"
            }`}
            title="Logout"
          >
            <LogOut size={18} className="shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}