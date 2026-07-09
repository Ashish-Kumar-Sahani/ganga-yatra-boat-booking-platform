import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Bell,
  Menu,
  Search,
  Settings,
  Plus,
  Globe,
  Moon,
  Sun,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useAdminNotificationsStore } from "../../notifications/store/notificationsStore";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";
import QuickActionsMenu from "./QuickActionsMenu";
import GlobalSearchModal from "./GlobalSearchModal";
import { useThemeStore } from "@/stores/themeStore";

type Props = {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
};

export default function SuperAdminNavbar({
  sidebarOpen,
  onToggleSidebar,
}: Props) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { notifications, fetchNotifications } = useAdminNotificationsStore();
  const { theme, setTheme } = useThemeStore();

  // Tick current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch notifications on load
  useEffect(() => {
    fetchNotifications();
  }, []);

  const profileImage = user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Admin")}&background=dbeafe&color=2563eb&size=64`;
  const profileName = user?.name || "Super Admin";
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Build breadcrumbs
  const pathnames = location.pathname.split("/").filter((x) => x);
  const currentPathname = pathnames[pathnames.length - 1] || "dashboard";
  const formattedPageTitle = currentPathname
    .replace("-", " ")
    .replace("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <>
      <header className="sticky top-0 z-40 flex h-20 items-center justify-between bg-blue-950/95 px-6 text-white backdrop-blur-xl border-b border-white/10 shadow-lg">

        {/* Left section: Toggle, title, breadcrumbs, search button */}
        <div className="flex items-center gap-5">
          <button
            onClick={onToggleSidebar}
            className="rounded-xl p-2 transition hover:bg-white/10 text-slate-200 hover:text-white"
            title={sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
          >
            <Menu size={22} />
          </button>

          {/* Page Title & Breadcrumbs */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-1 text-xs text-white/50 font-medium">
              <Link to="/admin/dashboard" className="hover:text-white transition">GangaYatra</Link>
              {pathnames.slice(1).map((path, index) => {
                const fullPath = `/admin/${pathnames.slice(2, index + 2).join("/")}`;
                const formattedName = path.replace("-", " ").replace(/\b\w/g, (char) => char.toUpperCase());
                return (
                  <div key={path} className="flex items-center gap-1">
                    <ChevronRight size={10} />
                    <Link to={fullPath} className="hover:text-white transition truncate max-w-[100px]">{formattedName}</Link>
                  </div>
                );
              })}
            </div>
            <h1 className="text-base font-extrabold tracking-tight text-white mt-0.5">{formattedPageTitle}</h1>
          </div>

          {/* Global Search Button Trigger */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-sm outline-none transition w-48 sm:w-64 text-left text-white/50"
          >
            <Search size={16} className="text-white/60 shrink-0" />
            <span className="flex-1 text-xs font-semibold">Search GangaYatra...</span>
            <kbd className="hidden sm:inline-block rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[10px] text-white/40 select-none">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Center: Quick Create actions */}
        <div className="relative">
          <button
            onClick={() => {
              setShowQuickActions((prev) => !prev);
              setShowNotifications(false);
              setShowProfile(false);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-900/20 transition cursor-pointer"
          >
            <Plus size={14} />
            <span className="hidden md:inline">Quick Create</span>
          </button>
          <QuickActionsMenu
            open={showQuickActions}
            onClose={() => setShowQuickActions(false)}
          />
        </div>

        {/* Right Section: Live Time, Alerts, Settings, Profile */}
        <div className="flex items-center gap-4">

          {/* Status indicator */}
          <div className="hidden xl:flex items-center gap-2 border-r border-white/10 pr-4">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              All Systems Online
            </div>
          </div>

          {/* Live clock */}
          <div className="hidden md:block text-right border-r border-white/10 pr-4">
            <div className="text-xs font-bold tracking-wide">
              {currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="text-[9px] font-bold text-white/60 tracking-wider mt-0.5">
              {currentTime.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </div>
          </div>

          {/* Placeholders: Lang & Theme */}
          <button
            className="hidden sm:flex rounded-xl p-2.5 transition hover:bg-white/10 text-white/70 hover:text-white"
            title="Language Placeholder"
          >
            <Globe size={18} />
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden sm:flex rounded-xl p-2.5 transition hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications((prev) => !prev);
                setShowProfile(false);
                setShowQuickActions(false);
              }}
              className="relative rounded-xl p-2.5 transition hover:bg-white/10 text-white/70 hover:text-white"
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-blue-950 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationDropdown
              open={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>

          {/* Settings Shortcut */}
          <button
            onClick={() => navigate("/admin/settings")}
            className="rounded-xl p-2.5 transition hover:bg-white/10 text-white/70 hover:text-white"
            title="Settings Shortcut"
          >
            <Settings size={18} />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile((prev) => !prev);
                setShowNotifications(false);
                setShowQuickActions(false);
              }}
              className="flex items-center gap-3 rounded-xl p-1 transition hover:bg-white/10"
            >
              <img
                src={profileImage}
                alt={profileName}
                className="h-10 w-10 rounded-full border-2 border-white/20 object-cover"
              />
              <div className="hidden text-left xl:block pr-1">
                <h4 className="text-xs font-bold truncate max-w-[100px]">{profileName}</h4>
                <p className="text-[9px] font-extrabold uppercase tracking-wide text-white/60">Console Admin</p>
              </div>
            </button>
            <ProfileDropdown
              open={showProfile}
              onClose={() => setShowProfile(false)}
            />
          </div>
        </div>
      </header>

      {/* Global Search dialog */}
      <GlobalSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />
    </>
  );
}