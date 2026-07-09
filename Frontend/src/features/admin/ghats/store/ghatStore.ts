import { create } from "zustand";
import type { Ghat } from "../types/ghat.types";
import { getGhats, getGhatsByCity, createGhat, updateGhat, deleteGhat } from "../api/ghatApi";

interface GhatStore {
  ghats: Ghat[];
  loading: boolean;
  error: string | null;
  fetchGhats: () => Promise<void>;
  fetchGhatsByCity: (cityId: string) => Promise<void>;
  addGhat: (ghatData: Partial<Ghat>) => Promise<boolean>;
  editGhat: (id: string, ghatData: Partial<Ghat>) => Promise<boolean>;
  removeGhat: (id: string) => Promise<boolean>;
}

export const useGhatStore = create<GhatStore>((set, get) => ({
  ghats: [],
  loading: false,
  error: null,

  fetchGhats: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getGhats();
      set({ ghats: Array.isArray(data) ? data : [], loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to fetch ghats", loading: false });
    }
  },

  fetchGhatsByCity: async (cityId) => {
    set({ loading: true, error: null });
    try {
      const data = await getGhatsByCity(cityId);
      set({ ghats: Array.isArray(data) ? data : [], loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to fetch city ghats", loading: false });
    }
  },

  addGhat: async (ghatData) => {
    set({ loading: true, error: null });
    try {
      const newGhat = await createGhat(ghatData);
      // Re-fetch since it populates cityId
      await get().fetchGhats();
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to add ghat", loading: false });
      return false;
    }
  },

  editGhat: async (id, ghatData) => {
    set({ loading: true, error: null });
    try {
      await updateGhat(id, ghatData);
      // Re-fetch since it populates cityId
      await get().fetchGhats();
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to update ghat", loading: false });
      return false;
    }
  },

  removeGhat: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteGhat(id);
      set({
        ghats: get().ghats.filter((g) => g._id !== id),
        loading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to delete ghat", loading: false });
      return false;
    }
  },
}));
