import { create } from "zustand";

import {
  createBoat,
  deleteBoat,
  getMyBoats,
  toggleBoatAvailability,
  updateBoat,
} from "@/features/owner/boats/api/boatApi";

import type { Boat, CreateBoatPayload } from "@/features/owner/boats/types/boat.types";

type BoatStore = {
  boats: Boat[];
  loading: boolean;
  error: string | null;

  fetchBoats: () => Promise<void>;
  addBoat: (payload: CreateBoatPayload) => Promise<boolean>;
  editBoat: (id: string, payload: any) => Promise<boolean>;
  removeBoat: (id: string) => Promise<boolean>;
  toggleAvailability: (id: string) => Promise<boolean>;
  clearError: () => void;
};

export const useBoatStore = create<BoatStore>((set) => ({
  boats: [],
  loading: false,
  error: null,

  fetchBoats: async () => {
    try {
      set({ loading: true, error: null });

      const boats = await getMyBoats();

      set({ boats, loading: false });
    } catch (error: any) {
      set({
        loading: false,
        error: error?.response?.data?.message || "Failed to load boats",
      });
    }
  },

  addBoat: async (payload) => {
    try {
      set({ loading: true, error: null });

      const newBoat = await createBoat(payload);

      set((state) => ({
        boats: [newBoat, ...state.boats],
        loading: false,
      }));

      return true;
    } catch (error: any) {
      set({
        loading: false,
        error: error?.response?.data?.message || "Boat create failed",
      });

      return false;
    }
  },

  editBoat: async (id, payload) => {
    try {
      set({ loading: true, error: null });

      const updatedBoat = await updateBoat(id, payload);

      set((state) => ({
        boats: state.boats.map((boat) =>
          boat._id === id ? updatedBoat : boat
        ),
        loading: false,
      }));

      return true;
    } catch (error: any) {
      set({
        loading: false,
        error: error?.response?.data?.message || "Boat update failed",
      });

      return false;
    }
  },

  removeBoat: async (id) => {
    try {
      set({ loading: true, error: null });

      await deleteBoat(id);

      set((state) => ({
        boats: state.boats.filter((boat) => boat._id !== id),
        loading: false,
      }));

      return true;
    } catch (error: any) {
      set({
        loading: false,
        error: error?.response?.data?.message || "Boat delete failed",
      });

      return false;
    }
  },

  toggleAvailability: async (id) => {
    try {
      set({ loading: true, error: null });

      const updatedBoat = await toggleBoatAvailability(id);

      set((state) => ({
        boats: state.boats.map((boat) =>
          boat._id === id ? updatedBoat : boat
        ),
        loading: false,
      }));

      return true;
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message || "Availability update failed",
      });

      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));