import { create } from "zustand";
import API from "@/api/axiosInstance";

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  priority: string;
  createdAt: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async () => {
    try {
      set({ loading: true, error: null });
      const res = await API.get("/notifications/my-notifications");
      const list = Array.isArray(res.data) ? res.data : (res.data?.notifications || []);
      set({
        notifications: list,
        unreadCount: list.filter((n: NotificationItem) => !n.isRead).length,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || "Failed to load notifications",
        loading: false,
      });
    }
  },

  markRead: async (id) => {
    try {
      // Optimistic update
      const list = get().notifications.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      );
      set({
        notifications: list,
        unreadCount: list.filter((n) => !n.isRead).length,
      });
      await API.patch(`/notifications/${id}/read`);
    } catch (err) {
      console.error("Failed to mark notification read:", err);
      get().fetchNotifications(); // Fallback on error
    }
  },

  markAllRead: async () => {
    try {
      // Optimistic update
      const list = get().notifications.map((n) => ({ ...n, isRead: true }));
      set({
        notifications: list,
        unreadCount: 0,
      });
      await API.patch("/notifications/mark-all-read");
    } catch (err) {
      console.error("Failed to mark all notifications read:", err);
      get().fetchNotifications(); // Fallback on error
    }
  },

  removeNotification: async (id) => {
    try {
      // Optimistic update
      const list = get().notifications.filter((n) => n._id !== id);
      set({
        notifications: list,
        unreadCount: list.filter((n) => !n.isRead).length,
      });
      await API.delete(`/notifications/${id}`);
    } catch (err) {
      console.error("Failed to delete notification:", err);
      get().fetchNotifications(); // Fallback on error
    }
  },
}));
