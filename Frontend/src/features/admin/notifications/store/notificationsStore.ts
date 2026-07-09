import { create } from "zustand";
import {
  getMyNotifications,
  createAdminNotification,
  markAllNotificationsRead,
  markSingleNotificationRead,
  deleteSingleNotification,
} from "../api/notificationsApi";

interface NotificationsState {
  notifications: any[];
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  broadcastNotification: (data: any) => Promise<boolean>;
  markAllRead: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
}

export const useAdminNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getMyNotifications();
      set({ notifications: Array.isArray(data) ? data : (data.notifications || []), loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to load notifications", loading: false });
    }
  },

  broadcastNotification: async (data) => {
    try {
      await createAdminNotification(data);
      get().fetchNotifications();
      return true;
    } catch (err) {
      return false;
    }
  },

  markAllRead: async () => {
    try {
      await markAllNotificationsRead();
      const updated = get().notifications.map((n) => ({ ...n, isRead: true }));
      set({ notifications: updated });
    } catch (err) {
      console.error(err);
    }
  },

  markRead: async (id) => {
    try {
      await markSingleNotificationRead(id);
      const updated = get().notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n));
      set({ notifications: updated });
    } catch (err) {
      console.error(err);
    }
  },

  removeNotification: async (id) => {
    try {
      await deleteSingleNotification(id);
      const updated = get().notifications.filter((n) => n._id !== id);
      set({ notifications: updated });
    } catch (err) {
      console.error(err);
    }
  },
}));
