import { create } from "zustand";
import { getSettingsAdmin, updateSettingsAdmin } from "../api/settingsApi";

interface SettingsState {
  settings: any | null;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  saveSettings: (data: any) => Promise<boolean>;
}

export const useAdminSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getSettingsAdmin();
      set({ settings: data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to fetch settings", loading: false });
    }
  },

  saveSettings: async (data) => {
    set({ loading: true });
    try {
      const res = await updateSettingsAdmin(data);
      set({ settings: res.settings, loading: false });
      return true;
    } catch (err) {
      set({ loading: false });
      return false;
    }
  },
}));
