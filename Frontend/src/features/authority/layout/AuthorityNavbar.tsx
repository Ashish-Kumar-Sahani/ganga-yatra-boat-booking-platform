import { Bell, Menu, Search, ShieldAlert, LogOut, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";

type Props = {
  sidebarOpen: boolean;
  onMobileOpen: () => void;
  onToggleSidebar: () => void;
  onLogout: () => void;
  onSearchClick?: () => void;
};

export default function AuthorityNavbar({
  onMobileOpen,
  onToggleSidebar,
  onLogout,
  onSearchClick,
}: Props) {
  const navigate = useNavigate();
  const user = useAuthStore((state: any) => state.user);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await axiosInstance.get("/notifications/my-notifications");
        if (Array.isArray(res.data)) {
          const unread = res.data.filter((n: any) => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error("Error fetching notifications for navbar:", err);
      }
    };

    fetchUnreadCount();
    // Poll every 60 seconds for live updates
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const getCityLabel = () => {
    if (user?.role === "SUPER_ADMIN") return "Super Jurisdiction";
    return user?.cityId?.name || user?.city || "Assigned City";
  };

  const getRoleLabel = () => {
    if (user?.role === "SUPER_ADMIN") return "SUPER ADMIN";
    return "CITY AUTHORITY";
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between bg-blue-950 px-5 text-white shadow-md backdrop-blur-xl">
      <div className="flex items-center gap-4">
        {/* Toggle Sidebar buttons */}
        <button
          onClick={onMobileOpen}
          className="rounded-xl bg-white/10 p-2 hover:bg-white/20 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <button
          onClick={onToggleSidebar}
          className="hidden rounded-xl bg-white/10 p-2 hover:bg-white/20 lg:block"
        >
          <Menu size={20} />
        </button>

        <button
          onClick={onSearchClick}
          className="hidden items-center gap-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-sm transition-all md:flex w-72 text-left text-white/55 cursor-pointer"
        >
          <Search size={18} className="text-white/60" />
          <span className="text-xs font-semibold">Search permits, routes, boats...</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Jurisdiction Badge */}
        <span className="hidden items-center gap-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 px-3.5 py-1.5 text-xs font-bold text-blue-200 lg:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          {getCityLabel()}
        </span>

        {/* Role Badge */}
        <span className="hidden items-center gap-1.5 rounded-full bg-[#f48a1d]/20 border border-[#f48a1d]/30 px-3.5 py-1.5 text-xs font-black text-orange-200 md:flex">
          <ShieldAlert size={13} />
          {getRoleLabel()}
        </span>

        {/* Notifications Icon */}
        <button
          onClick={() => navigate("/authority/notifications")}
          className="relative rounded-xl p-2 hover:bg-white/10 transition-all duration-300"
          title="Notifications"
        >
          <Bell size={21} />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-2 ring-blue-950">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-xl p-1 hover:bg-white/5 transition-all duration-300"
          >
            <img
              src={user?.profileImage || "https://i.pravatar.cc/100?img=60"}
              alt="Authority Profile"
              className="h-10 w-10 rounded-full border-2 border-blue-500 bg-white object-cover"
            />
            <div className="hidden text-left md:block pr-1">
              <p className="text-sm font-bold leading-none">{user?.name || "Govt Inspector"}</p>
              {user?.department && (
                <p className="text-[10px] text-slate-300 font-medium mt-1 truncate max-w-[100px]" title={user.department}>
                  {user.department}
                </p>
              )}
            </div>
          </button>

          {dropdownOpen && (
            <>
              {/* Click backdrop to close dropdown */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />

              <div className="absolute right-0 mt-2.5 w-52 origin-top-right rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/5 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3.5 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-400">Signed in as</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{user?.name || "Government Official"}</p>
                  {user?.department && (
                    <p className="text-xs font-bold text-blue-600 truncate mt-0.5">
                      {user.department} {user.designation ? `(${user.designation})` : ""}
                    </p>
                  )}
                  <p className="text-xs font-medium text-slate-500 truncate mt-0.5">{user?.email}</p>
                </div>

                <div className="mt-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/authority/profile");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300"
                  >
                    <UserIcon size={16} />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-all duration-300"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
