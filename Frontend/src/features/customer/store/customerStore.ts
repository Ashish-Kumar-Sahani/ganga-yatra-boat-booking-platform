import { create } from "zustand";
import API from "@/api/axiosInstance";

interface WishlistItem {
  _id: string;
  boatName: string;
  boatNumber: string;
  boatType: string;
  capacity: number;
  image?: string | null;
  status: string;
  isAvailable: boolean;
}

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  priority: string;
  createdAt: string;
}

interface CustomerState {
  wishlist: WishlistItem[];
  notifications: NotificationItem[];
  unreadCount: number;
  theme: "light" | "dark" | "system";
  language: "en" | "hi";
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  loadingWishlist: boolean;
  loadingNotifications: boolean;

  // Actions
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (boatId: string) => Promise<boolean>;
  isInWishlist: (boatId: string) => boolean;

  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  setTheme: (theme: "light" | "dark" | "system") => void;
  setLanguage: (lang: "en" | "hi") => void;
  setNotificationPreferences: (prefs: Partial<{ email: boolean; sms: boolean; push: boolean }>) => void;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  wishlist: [],
  notifications: [],
  unreadCount: 0,
  theme: (localStorage.getItem("customer-theme") as any) || "light",
  language: (localStorage.getItem("customer-lang") as any) || "en",
  notificationPreferences: JSON.parse(localStorage.getItem("customer-notif-prefs") || '{"email":true,"sms":true,"push":true}'),
  loadingWishlist: false,
  loadingNotifications: false,

  fetchWishlist: async () => {
    try {
      set({ loadingWishlist: true });
      const res = await API.get("/customer/wishlist");
      set({ wishlist: res.data || [] });
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    } finally {
      set({ loadingWishlist: false });
    }
  },

  toggleWishlist: async (boatId: string) => {
    try {
      const res = await API.post("/customer/wishlist/toggle", { boatId });
      await get().fetchWishlist();
      return res.data?.message?.includes("Added");
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
      return false;
    }
  },

  isInWishlist: (boatId: string) => {
    return get().wishlist.some((item) => item._id === boatId);
  },

  fetchNotifications: async () => {
    try {
      set({ loadingNotifications: true });
      const res = await API.get("/notifications/my-notifications");
      const list = res.data || [];
      set({
        notifications: list,
        unreadCount: list.filter((n: any) => !n.isRead).length,
      });
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      set({ loadingNotifications: false });
    }
  },

  markNotificationRead: async (id: string) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      await get().fetchNotifications();
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  },

  markAllNotificationsRead: async () => {
    try {
      await API.patch("/notifications/mark-all-read");
      await get().fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all notifications read:", err);
    }
  },

  setTheme: (theme) => {
    localStorage.setItem("customer-theme", theme);
    set({ theme });
    
    // Apply styling
    const root = window.document.documentElement;
    if (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  },

  setLanguage: (language) => {
    localStorage.setItem("customer-lang", language);
    set({ language });
  },

  setNotificationPreferences: (prefs) => {
    const updated = { ...get().notificationPreferences, ...prefs };
    localStorage.setItem("customer-notif-prefs", JSON.stringify(updated));
    set({ notificationPreferences: updated });
  },
}));
