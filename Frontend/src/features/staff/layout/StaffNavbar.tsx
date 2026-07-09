import { Bell, UserCircle, Menu, Search } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useNotificationStore } from "../notifications/store/notificationStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  toggleSidebar: () => void;
  onSearchClick?: () => void;
}

export default function StaffNavbar({ toggleSidebar, onSearchClick }: Props) {
  const user = useAuthStore((state) => state.user);
  const { notifications, fetchNotifications } = useNotificationStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 transition-colors"
          id="sidebar-toggle-btn"
        >
          <Menu size={24} />
        </button>

        <div>
          <h2 className="text-xl font-black text-blue-950">
            Welcome, {user?.name || "Staff"}
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Role: {user?.role || "STAFF"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {onSearchClick && (
          <button
            onClick={onSearchClick}
            className="rounded-xl bg-blue-50 p-3 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
            title="Search Console (Ctrl + K)"
          >
            <Search size={20} />
          </button>
        )}

        <button
          onClick={() => navigate("/staff/notifications")}
          className="relative rounded-xl bg-blue-50 p-3 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => navigate("/staff/profile")}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 overflow-hidden border border-blue-100 hover:scale-105 transition-transform"
        >
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <UserCircle size={24} className="text-blue-700" />
          )}
        </button>
      </div>
    </header>
  );
}