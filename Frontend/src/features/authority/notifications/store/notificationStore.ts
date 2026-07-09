import { create } from "zustand";
import {
  fetchNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
} from "../api/notificationApi";

interface NotificationItem {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  priority: "LOW" | "HIGH" | "EMERGENCY";
  createdAt: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  loading: false,
  error: null,
  fetchNotifications: async () => {
    try {
      set({ loading: true, error: null });
      const notifications = await fetchNotificationsApi();
      set({ notifications, loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to load notifications",
      });
    }
  },
  markAsRead: async (id) => {
    try {
      await markNotificationReadApi(id);
      set((state) => ({
        notifications: state.notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      }));
      return true;
    } catch (err: any) {
      return false;
    }
  },
  markAllAsRead: async () => {
    try {
      await markAllNotificationsReadApi();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      }));
      return true;
    } catch (err: any) {
      return false;
    }
  },
}));
