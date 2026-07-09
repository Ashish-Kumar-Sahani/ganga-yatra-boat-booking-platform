import { create } from "zustand";
import { getStaffBoats } from "../api/boatApi";
import type { StaffBoat } from "../types/boat.types";

interface BoatState {
  boats: StaffBoat[];
  loading: boolean;
  error: string | null;
  fetchBoats: () => Promise<void>;
}

export const useBoatStore = create<BoatState>((set) => ({
  boats: [],
  loading: false,
  error: null,

  fetchBoats: async () => {
    try {
      set({ loading: true, error: null });

      const boats = await getStaffBoats();

      set({
        boats,
        loading: false,
      });
    } catch {
      set({
        boats: [],
        loading: false,
        error: "Boats load nahi ho payi",
      });
    }
  },
}));