import { create } from "zustand";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../api/notificationApi";
import type { ManagerNotification } from "../types/notification.types";

interface NotificationState {
  notifications: ManagerNotification[];
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const data = await getNotifications();
      set({
        notifications: Array.isArray(data) ? data : [],
        loading: false,
      });
    } catch {
      set({
        loading: false,
      });
    }
  },

  markRead: async (id: string) => {
    try {
      await markNotificationRead(id);
      const updated = get().notifications.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      );
      set({ notifications: updated });
    } catch (err) {
      console.error("Mark read error:", err);
    }
  },

  markAllRead: async () => {
    try {
      await markAllNotificationsRead();
      const updated = get().notifications.map((n) => ({ ...n, isRead: true }));
      set({ notifications: updated });
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  },
}));