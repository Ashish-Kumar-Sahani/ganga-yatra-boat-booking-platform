import { Outlet } from "react-router-dom";
import CustomerSidebar from "./CustomerSidebar";
import CustomerNavbar from "./CustomerNavbar";
import { useState, useEffect } from "react";
import { useCustomerStore } from "../store/customerStore";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useWalletStore } from "@/features/customer/wallet/store/walletStore";
import GlobalSearchModal from "@/components/common/GlobalSearchModal";

export default function CustomerLayout() {
  const { fetchNotifications, fetchWishlist, theme } = useCustomerStore();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchWalletDetails = useWalletStore((state) => state.fetchWalletDetails);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("customer-sidebar-collapsed") === "true";
  });

  useEffect(() => {
    // Initial fetch of notifications and wishlist
    fetchNotifications();
    fetchWishlist();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === "CUSTOMER") {
      fetchWalletDetails();
    }
  }, [isAuthenticated, user?.role, fetchWalletDetails]);

  useEffect(() => {
    // Set root class based on theme store on load
    const root = window.document.documentElement;
    if (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const handleSetCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    localStorage.setItem("customer-sidebar-collapsed", String(collapsed));
  };

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-800 transition-colors duration-300 dark:bg-slate-900 dark:text-slate-100 overflow-x-hidden">
      {/* Sidebar Navigation */}
      <CustomerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        setIsCollapsed={handleSetCollapsed}
      />

      {/* Main Content Area */}
      <div
        className="transition-all duration-300 flex flex-col min-h-screen"
        style={{
          marginLeft: window.innerWidth >= 1024 ? (isCollapsed ? "5rem" : "18rem") : "0",
        }}
      >
        <CustomerNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fadeIn">
          <Outlet />
        </main>
      </div>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
