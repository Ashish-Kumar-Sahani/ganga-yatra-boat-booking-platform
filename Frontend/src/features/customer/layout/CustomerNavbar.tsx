import { useState, useRef, useEffect } from "react";
import { Bell, Heart, Wallet, User, Settings, LogOut, Menu, Search, Sun, Moon, CalendarCheck } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useCustomerStore } from "../store/customerStore";
import { useNavigate } from "react-router-dom";
import { useWalletStore } from "@/features/customer/wallet/store/walletStore";

interface Props {
  toggleSidebar: () => void;
}

export default function CustomerNavbar({ toggleSidebar }: Props) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { unreadCount, wishlist, notifications, theme, setTheme } = useCustomerStore();
  const wallet = useWalletStore((state) => state.wallet);
  const walletLoading = useWalletStore((state) => state.loading);
  const navigate = useNavigate();

  const balanceDisplay = walletLoading ? 0 : (wallet?.balance ?? 0);

  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/customer/search-trips?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800/80 px-6 backdrop-blur transition-colors duration-300">
      {/* Left side: Toggle & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={toggleSidebar}
          className="rounded-xl p-2 text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          id="sidebar-toggle-btn"
        >
          <Menu size={22} />
        </button>

        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 px-3.5 py-2 group focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
          <Search size={18} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search trips, ghats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none placeholder:text-slate-400"
          />
        </form>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-4">
        {/* Wallet Balance Display */}
        <div 
          onClick={() => navigate("/customer/wallet")}
          className="flex items-center gap-2 rounded-xl bg-blue-50/60 dark:bg-slate-800/50 border border-blue-100/30 dark:border-slate-700/50 px-3.5 py-2 cursor-pointer hover:bg-blue-100/50 dark:hover:bg-slate-750 transition-colors"
        >
          <Wallet size={16} className="text-blue-600 dark:text-blue-450" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Wallet</span>
          <span className="text-sm font-black text-blue-900 dark:text-blue-400">
            ₹{balanceDisplay.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="rounded-xl border border-slate-100 dark:border-slate-800 p-2.5 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Wishlist Link */}
        <button
          onClick={() => navigate("/customer/wishlist")}
          className="relative rounded-xl border border-slate-100 dark:border-slate-800 p-2.5 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          title="Wishlist"
        >
          <Heart size={18} className={wishlist.length > 0 ? "fill-red-500 text-red-500" : ""} />
          {wishlist.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-0.5 text-[8px] font-black text-white">
              {wishlist.length}
            </span>
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative rounded-xl border border-slate-100 dark:border-slate-800 p-2.5 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white shadow-sm animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-150 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 shadow-xl animate-fadeIn">
              <div className="flex items-center justify-between border-b dark:border-slate-700 px-4 py-3">
                <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Notifications</span>
                <span onClick={() => navigate("/customer/notifications")} className="cursor-pointer text-xs font-bold text-blue-600 hover:underline">View all</span>
              </div>
              <div className="max-h-60 overflow-y-auto py-1">
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-xs font-semibold text-slate-400">No notifications yet</p>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div key={n._id} className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b dark:border-slate-700 last:border-0 cursor-pointer ${!n.isRead ? 'bg-blue-50/30' : ''}`}>
                      <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{n.title}</p>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-450 mt-0.5 truncate">{n.message}</p>
                      <p className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex h-10 w-10 overflow-hidden rounded-xl border border-blue-200 bg-blue-50 dark:bg-slate-800 shadow-sm hover:scale-105 transition-transform"
          >
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-black text-blue-700 dark:text-blue-400 text-sm">
                {user?.name?.[0]?.toUpperCase() || "C"}
              </div>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-150 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 shadow-xl animate-fadeIn">
              <div className="px-4 py-3 border-b dark:border-slate-700">
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate">{user?.name}</p>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 truncate mt-0.5">{user?.email}</p>
              </div>

              <div className="py-1 space-y-0.5">
                <button
                  onClick={() => { setDropdownOpen(false); navigate("/customer/profile"); }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                >
                  <User size={16} />
                  My Profile
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); navigate("/customer/wallet"); }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                >
                  <Wallet size={16} />
                  Wallet & Points
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); navigate("/customer/bookings"); }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                >
                  <CalendarCheck size={16} />
                  My Bookings
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); navigate("/customer/settings"); }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                >
                  <Settings size={16} />
                  Settings
                </button>
              </div>

              <div className="border-t dark:border-slate-700 pt-1">
                <button
                  onClick={() => { setDropdownOpen(false); logout(); }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  <LogOut size={16} />
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
