import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const getDashboardPath = () => {
    if (!user) return "/login";

    switch (user.role) {
      case "SUPER_ADMIN":
        return "/admin/dashboard";

      case "BOAT_OWNER":
        return "/owner/dashboard";

      case "MANAGER":
      case "DRIVER":
      case "CAPTAIN":
      case "HELPER":
        return "/staff/dashboard";

      case "CUSTOMER":
        return "/customer/dashboard";

      case "CITY_AUTHORITY":
        return "/authority/dashboard";

      default:
        return "/";
    }
  };

  const handleDashboard = () => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }
    navigate(getDashboardPath());
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
    setIsMobileMenuOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-slate-100/50 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-md transition-all duration-300 md:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => handleNavigate("/")}
            className="flex cursor-pointer items-center gap-2 text-2xl font-black tracking-tight text-blue-800"
          >
            <span className="text-3xl text-orange-500">⛵</span>
            <div>
              <span className="font-extrabold text-blue-900">Ganga</span>
              <span className="font-bold text-orange-500">Yatra</span>
              <p className="text-[10px] font-medium tracking-wide text-slate-400">
                Safe & Secure River Transit
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-8 font-semibold text-slate-600 md:flex">
            <button
              onClick={() => handleNavigate("/")}
              className={`transition-colors hover:text-blue-700 ${
                isActive("/") ? "font-bold text-blue-700" : ""
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavigate("/cities")}
              className={`transition-colors hover:text-blue-700 ${
                isActive("/cities") ? "font-bold text-blue-700" : ""
              }`}
            >
              Cities
            </button>
            <button
              onClick={() => handleNavigate("/ghats")}
              className={`transition-colors hover:text-blue-700 ${
                isActive("/ghats") ? "font-bold text-blue-700" : ""
              }`}
            >
              Ghats
            </button>
            <button
              onClick={() => handleNavigate("/search-route")}
              className={`transition-colors hover:text-blue-700 ${
                isActive("/search-route") ? "font-bold text-blue-700" : ""
              }`}
            >
              Search Route
            </button>
          </div>

          {/* Desktop Auth Actions */}
          <div className="hidden gap-3 md:flex">
            {!isAuthenticated || !user ? (
              <>
                <button
                  onClick={() => handleNavigate("/login")}
                  className="rounded-xl border border-blue-750/30 px-5 py-2 font-bold text-blue-800 hover:bg-slate-50 transition duration-200"
                >
                  Login
                </button>

                <button
                  onClick={() => handleNavigate("/register")}
                  className="rounded-xl bg-orange-500 px-5 py-2 font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:shadow-orange-600/30 active:scale-[0.98] transition duration-200"
                >
                  Register
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDashboard}
                  className="flex items-center gap-2 rounded-xl border border-blue-700 px-5 py-2 font-bold text-blue-700 hover:bg-blue-50 transition duration-200"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2 font-bold text-white hover:bg-red-600 transition duration-200"
                >
                  <LogOut size={16} />
                  Logout
                </button>

                {/* Profile Circle */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-extrabold shadow-inner">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none md:hidden"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[280px] bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2 text-xl font-black text-blue-800">
            <span>⛵</span>
            <span>GangaYatra</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>

        {/* Drawer Links */}
        <div className="mt-8 flex flex-col gap-6 font-semibold text-slate-700">
          <button
            onClick={() => handleNavigate("/")}
            className={`text-left text-lg hover:text-blue-700 transition duration-150 ${
              isActive("/") ? "font-bold text-blue-700" : ""
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavigate("/cities")}
            className={`text-left text-lg hover:text-blue-700 transition duration-150 ${
              isActive("/cities") ? "font-bold text-blue-700" : ""
            }`}
          >
            Cities
          </button>
          <button
            onClick={() => handleNavigate("/ghats")}
            className={`text-left text-lg hover:text-blue-700 transition duration-150 ${
              isActive("/ghats") ? "font-bold text-blue-700" : ""
            }`}
          >
            Ghats
          </button>
          <button
            onClick={() => handleNavigate("/search-route")}
            className={`text-left text-lg hover:text-blue-700 transition duration-150 ${
              isActive("/search-route") ? "font-bold text-blue-700" : ""
            }`}
          >
            Search Route
          </button>
        </div>

        {/* Drawer Auth Actions */}
        <div className="absolute bottom-10 left-6 right-6 border-t pt-6">
          {!isAuthenticated || !user ? (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleNavigate("/login")}
                className="w-full rounded-xl border border-blue-700 py-3 font-bold text-blue-800 transition duration-150"
              >
                Login
              </button>

              <button
                onClick={() => handleNavigate("/register")}
                className="w-full rounded-xl bg-orange-500 py-3 font-bold text-white shadow-lg shadow-orange-500/25 transition duration-150"
              >
                Register
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* User avatar/name info */}
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-black">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div className="overflow-hidden">
                  <p className="truncate font-bold text-slate-800">{user.name}</p>
                  <p className="truncate text-xs text-slate-400 capitalize">{user.role.toLowerCase()}</p>
                </div>
              </div>

              <button
                onClick={handleDashboard}
                className="flex items-center justify-center gap-2 w-full rounded-xl border border-blue-750 py-3 font-bold text-blue-800 transition duration-150"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-red-500 py-3 font-bold text-white transition duration-150"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}