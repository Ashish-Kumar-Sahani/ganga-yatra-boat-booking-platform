import { Outlet } from "react-router-dom";
import StaffSidebar from "./StaffSidebar";
import StaffNavbar from "./StaffNavbar";
import { useState, useEffect } from "react";
import GlobalSearchModal from "@/components/common/GlobalSearchModal";

export default function StaffLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#f5f8ff] overflow-x-hidden">
      <StaffSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-72" : "lg:ml-0"}`}>
        <StaffNavbar toggleSidebar={toggleSidebar} onSearchClick={() => setSearchOpen(true)} />

        <main className="p-5">
          <Outlet />
        </main>
      </div>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}