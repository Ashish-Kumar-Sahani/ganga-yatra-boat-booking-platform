import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import OwnerNavbar from "@/features/owner/layout/OwnerNavbar";
import OwnerSidebar from "@/features/owner/layout/OwnerSidebar";
import { useAuthStore } from "@/features/auth/store/authStore";
import GlobalSearchModal from "@/components/common/GlobalSearchModal";

export default function OwnerLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const logoutAction = useAuthStore((state) => state.logout);

  const logout = () => {
    logoutAction();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f5f8ff] dark:bg-slate-950 transition-colors duration-300">
      <OwnerSidebar
        sidebarOpen={sidebarOpen}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onLogout={logout}
      />

      <main
        className={`min-h-screen transition-all duration-300 ${
          sidebarOpen ? "lg:ml-72" : "lg:ml-0"
        }`}
      >
        <OwnerNavbar
          sidebarOpen={sidebarOpen}
          onMobileOpen={() => setMobileOpen(true)}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onLogout={logout}
          onSearchClick={() => setSearchOpen(true)}
        />

        <div className="p-5">
          <Outlet />
        </div>
      </main>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}