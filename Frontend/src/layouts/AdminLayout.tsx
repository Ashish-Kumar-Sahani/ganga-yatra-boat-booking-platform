import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SuperAdminNavbar from "@/features/admin/dashboard/components/SuperAdminNavbar";
import SuperAdminSidebar from "@/features/admin/dashboard/components/SuperAdminSidebar";

export default function AdminLayout() {
  // Mobile sidebar is hidden by default, desktop is visible
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("admin_sidebar_collapsed") === "true";
  });

  // Track window resizing to reset drawer on screen size transition
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false); // Mobile drawer closed on big screens
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("admin_sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f8ff] text-slate-800 antialiased font-sans">
      
      {/* Super Admin Sidebar Console */}
      <SuperAdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      {/* Main Content Pane */}
      <main
        className={`min-h-screen flex flex-col transition-all duration-300 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-72"
        } ml-0`}
      >
        <SuperAdminNavbar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Content Outlet */}
        <div className="flex-1 p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}