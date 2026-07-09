import { NavLink } from "react-router-dom";
import {
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useCustomerStore } from "../store/customerStore";
import { getMenuForPanel } from "@/utils/menuGenerator";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
}

export default function CustomerSidebar({ isOpen, onClose, isCollapsed, setIsCollapsed }: Props) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { unreadCount, wishlist } = useCustomerStore();

  const baseMenu = getMenuForPanel("customer", user?.role || "", user?.permissions || []);
  const filteredMenu = baseMenu.map((item: any) => {
    if (item.path === "/customer/wishlist") {
      return { ...item, badge: wishlist.length > 0 ? wishlist.length : undefined };
    }
    if (item.path === "/customer/notifications") {
      return { ...item, badge: unreadCount > 0 ? unreadCount : undefined };
    }
    return item;
  });

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 shadow-sm transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-72"
        } ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="text-2xl">⛵</span>
            {!isCollapsed && (
              <div className="animate-fadeIn">
                <h1 className="text-xl font-black text-blue-800 dark:text-blue-400 tracking-tight">GangaYatra</h1>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 -mt-0.5">RIDE SAFE & SECURE</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Collapse Toggle Desktop */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex rounded-xl p-1.5 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            {/* Mobile close */}
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-500 hover:bg-slate-105 lg:hidden"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* User Card */}
        {!isCollapsed && (
          <div className="mx-4 mb-4 rounded-2xl bg-blue-50/50 dark:bg-slate-800/40 p-4 border border-blue-100/50 dark:border-slate-700/30 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-xl bg-blue-600 border border-blue-200">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-bold text-white text-sm">
                    {user?.name?.[0]?.toUpperCase() || "C"}
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user?.name}</h4>
                <div className="flex items-center gap-1 mt-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                  <ShieldCheck size={11} />
                  <span>Customer</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2 scrollbar-thin">
          {filteredMenu.map((item: any) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200/50"
                      : "text-slate-600 dark:text-slate-300 hover:bg-blue-50/60 dark:hover:bg-slate-800/60 hover:text-blue-700 dark:hover:text-blue-450"
                  }`
                }
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className="shrink-0 transition-transform group-hover:scale-105" />
                  {!isCollapsed && <span className="animate-fadeIn">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge !== undefined && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-extrabold text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="border-t dark:border-slate-850 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors group"
          >
            <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
            {!isCollapsed && <span className="animate-fadeIn">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
