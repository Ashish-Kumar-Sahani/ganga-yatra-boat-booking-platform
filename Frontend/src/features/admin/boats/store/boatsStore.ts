import { create } from "zustand";
import {
  getAllBoats,
  updateBoatDetails,
  verifyBoatStatus,
  deleteBoatByAdmin,
} from "../api/boatsApi";

interface BoatsState {
  boats: any[];
  loading: boolean;
  error: string | null;
  fetchBoats: (params?: any) => Promise<void>;
  editBoat: (id: string, data: any) => Promise<boolean>;
  updateStatus: (id: string, status: string) => Promise<boolean>;
  removeBoat: (id: string) => Promise<boolean>;
}

export const useAdminBoatsStore = create<BoatsState>((set, get) => ({
  boats: [],
  loading: false,
  error: null,

  fetchBoats: async (params) => {
    set({ loading: true, error: null });
    try {
      const data = await getAllBoats(params);
      set({ boats: Array.isArray(data) ? data : (data.boats || []), loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to load boats", loading: false });
    }
  },

  editBoat: async (id, data) => {
    set({ loading: true });
    try {
      await updateBoatDetails(id, data);
      set({ loading: false });
      get().fetchBoats();
      return true;
    } catch (err) {
      set({ loading: false });
      return false;
    }
  },

  updateStatus: async (id, status) => {
    try {
      await verifyBoatStatus(id, status);
      const updated = get().boats.map((b) => (b._id === id ? { ...b, status } : b));
      set({ boats: updated });
      return true;
    } catch (err) {
      return false;
    }
  },

  removeBoat: async (id) => {
    set({ loading: true });
    try {
      await deleteBoatByAdmin(id);
      set({ loading: false });
      get().fetchBoats();
      return true;
    } catch (err) {
      set({ loading: false });
      return false;
    }
  },
}));
