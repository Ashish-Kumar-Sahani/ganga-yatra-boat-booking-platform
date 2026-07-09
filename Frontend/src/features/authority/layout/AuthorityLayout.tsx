import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import AuthorityNavbar from "./AuthorityNavbar";
import AuthoritySidebar from "./AuthoritySidebar";
import GlobalSearchModal from "@/components/common/GlobalSearchModal";

export default function AuthorityLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const logout = useAuthStore((state: any) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f5f8ff] text-slate-800 dark:bg-slate-950 transition-colors duration-300">
      <AuthoritySidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
      />

      <main
        className={`min-h-screen transition-all duration-300 ${
          sidebarOpen ? "lg:ml-72" : "lg:ml-20"
        }`}
      >
        <AuthorityNavbar
          sidebarOpen={sidebarOpen}
          onMobileOpen={() => setMobileOpen(true)}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onLogout={handleLogout}
          onSearchClick={() => setSearchOpen(true)}
        />

        <div className="p-6">
          <Outlet />
        </div>
      </main>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
