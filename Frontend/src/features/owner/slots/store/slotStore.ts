import { create } from "zustand";

import {
  getOwnerMonthlySlots,
  shiftSlotDate,
  updateSlot,
  updateSlotStatus,
} from "../api/slotApi";

import type { Slot, SlotStatus } from "../types/slot.types";

type SlotStore = {
  slots: Slot[];
  loading: boolean;
  error: string | null;

  fetchSlots: () => Promise<void>;
  fetchMonthlySlots: (days?: number) => Promise<void>;

  changeSlotStatus: (id: string, status: SlotStatus) => Promise<boolean>;

  editSlot: (
    id: string,
    payload: Partial<Slot>
  ) => Promise<boolean>;

  shiftSlot: (
    id: string,
    slotDate: string
  ) => Promise<boolean>;

  clearError: () => void;
};

export const useSlotStore = create<SlotStore>((set) => ({
  slots: [],
  loading: false,
  error: null,

  fetchSlots: async () => {
    try {
      set({ loading: true, error: null });

      const slots = await getOwnerMonthlySlots(30);

      set({ slots, loading: false });
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          "Failed to load slots",
      });
    }
  },

  fetchMonthlySlots: async (days = 30) => {
    try {
      set({ loading: true, error: null });

      const slots = await getOwnerMonthlySlots(days);

      set({ slots, loading: false });
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          "Failed to load monthly slots",
      });
    }
  },

  changeSlotStatus: async (id, status) => {
    try {
      set({ loading: true, error: null });

      const validStatus = status as "OPEN" | "FULL" | "CANCELLED";
      const updatedSlot = await updateSlotStatus(id, validStatus);

      set((state) => ({
        slots: state.slots.map((slot) =>
          slot._id === id ? updatedSlot : slot
        ),
        loading: false,
      }));

      return true;
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          "Slot status update failed",
      });

      return false;
    }
  },

  editSlot: async (id, payload) => {
    try {
      set({ loading: true, error: null });

      const updatedSlot = await updateSlot(id, payload);

      set((state) => ({
        slots: state.slots.map((slot) =>
          slot._id === id ? updatedSlot : slot
        ),
        loading: false,
      }));

      return true;
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          "Slot update failed",
      });

      return false;
    }
  },

  shiftSlot: async (id, slotDate) => {
    try {
      set({ loading: true, error: null });

      const updatedSlot = await shiftSlotDate(id, slotDate);

      set((state) => ({
        slots: state.slots.map((slot) =>
          slot._id === id ? updatedSlot : slot
        ),
        loading: false,
      }));

      return true;
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          "Slot shift failed",
      });

      return false;
    }
  },

  clearError: () => set({ error: null }),
}));