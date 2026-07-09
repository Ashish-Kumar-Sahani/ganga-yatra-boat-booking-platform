import { create } from "zustand";
import type { Offer } from "../types/offer.types";
import { getOffers, createOffer, updateOffer, deleteOffer } from "../api/offerApi";

interface OfferStore {
  offers: Offer[];
  loading: boolean;
  error: string | null;
  fetchOffers: () => Promise<void>;
  addOffer: (offerData: Partial<Offer>) => Promise<boolean>;
  editOffer: (id: string, offerData: Partial<Offer>) => Promise<boolean>;
  removeOffer: (id: string) => Promise<boolean>;
}

export const useOfferStore = create<OfferStore>((set, get) => ({
  offers: [],
  loading: false,
  error: null,

  fetchOffers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getOffers();
      set({ offers: Array.isArray(data) ? data : [], loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to fetch offers", loading: false });
    }
  },

  addOffer: async (offerData) => {
    set({ loading: true, error: null });
    try {
      const newOffer = await createOffer(offerData);
      set({
        offers: [newOffer, ...get().offers],
        loading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to add offer", loading: false });
      return false;
    }
  },

  editOffer: async (id, offerData) => {
    set({ loading: true, error: null });
    try {
      const updatedOffer = await updateOffer(id, offerData);
      set({
        offers: get().offers.map((o) => (o._id === id ? updatedOffer : o)),
        loading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to update offer", loading: false });
      return false;
    }
  },

  removeOffer: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteOffer(id);
      set({
        offers: get().offers.filter((o) => o._id !== id),
        loading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to delete offer", loading: false });
      return false;
    }
  },
}));
