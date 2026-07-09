import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu, Search, UserCircle, LogOut } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useNotificationStore } from "@/stores/notificationStore";

type Props = {
  sidebarOpen: boolean;
  onMobileOpen: () => void;
  onToggleSidebar: () => void;
  onLogout: () => void;
  onSearchClick?: () => void;
};

export default function OwnerNavbar({
  sidebarOpen,
  onMobileOpen,
  onToggleSidebar,
  onLogout,
  onSearchClick,
}: Props) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { notifications, unreadCount, fetchNotifications } = useNotificationStore();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarSrc = user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Owner")}&background=dbeafe&color=2563eb&size=100`;

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between bg-blue-950/95 px-5 text-white backdrop-blur-xl border-b border-white/10 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileOpen}
          className="rounded-xl bg-white/10 p-2 lg:hidden hover:bg-white/20 transition-colors"
        >
          <Menu />
        </button>

        <button
          onClick={onToggleSidebar}
          className="hidden rounded-xl bg-white/10 p-2 lg:block hover:bg-white/20 transition-colors"
          title={sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
        >
          <Menu />
        </button>

        {/* Search trigger button */}
        <button
          onClick={onSearchClick}
          className="hidden items-center gap-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-sm transition-all md:flex w-72 text-left text-white/55 cursor-pointer"
        >
          <Search size={18} className="text-white/60" />
          <span className="text-xs font-semibold">Search boats, bookings, staff...</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Navigation links */}
        <span
          onClick={() => navigate("/owner/bookings")}
          className="hidden text-sm font-semibold md:block cursor-pointer hover:text-blue-300 transition-colors"
        >
          Bookings
        </span>
        <span
          onClick={() => navigate("/owner/boats")}
          className="hidden text-sm font-semibold md:block cursor-pointer hover:text-blue-300 transition-colors"
        >
          Boats
        </span>
        <span
          onClick={() => navigate("/owner/trips")}
          className="hidden text-sm font-semibold md:block cursor-pointer hover:text-blue-300 transition-colors"
        >
          Trips
        </span>

        {/* Notifications dropdown bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative rounded-xl p-2 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Bell size={21} />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-blue-950 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white border border-slate-100 p-2 shadow-2xl z-50 text-slate-800 animate-fadeIn">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <span className="font-extrabold text-sm text-slate-800">Notifications</span>
              </div>
              <div className="max-h-60 overflow-y-auto py-1">
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-xs font-semibold text-slate-400">No alerts yet</p>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n._id}
                      className={`px-4 py-3 hover:bg-slate-50 transition-colors border-b last:border-0 cursor-pointer ${
                        !n.isRead ? "bg-blue-50/40 font-bold" : ""
                      }`}
                    >
                      <p className="text-xs text-slate-800">{n.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">{n.message}</p>
                      <p className="text-[8px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="hidden rounded-xl bg-red-500/15 px-4 py-2 text-sm font-bold text-red-100 hover:bg-red-500/25 md:block transition-all cursor-pointer"
        >
          Logout
        </button>

        {/* Profile Avatar Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-3 rounded-xl p-1 hover:bg-white/5 transition-all cursor-pointer"
          >
            <img
              src={avatarSrc}
              alt="Owner Avatar"
              className="h-10 w-10 rounded-full border-2 border-white/20 object-cover"
            />
            <div className="hidden text-left md:block pr-1">
              <h4 className="text-xs font-bold leading-tight">{user?.name || "Boat Owner"}</h4>
              <p className="text-[9px] font-extrabold uppercase tracking-wide text-white/60">Owner Panel</p>
            </div>
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 rounded-2xl bg-white border border-slate-100 p-2 shadow-2xl z-50 text-slate-800 animate-fadeIn">
              <div className="px-4 py-2.5 border-b">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.name || "Boat Owner"}</p>
                <p className="text-[9px] font-semibold text-slate-400 truncate mt-0.5">{user?.email}</p>
              </div>
              <div className="py-1 space-y-0.5">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate("/owner/profile");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <UserCircle size={14} />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onLogout();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold text-red-650 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}