import { create } from "zustand";
import type { City } from "../types/city.types";
import { getCities, createCity, updateCity, deleteCity } from "../api/cityApi";

interface CityStore {
  cities: City[];
  loading: boolean;
  error: string | null;
  fetchCities: () => Promise<void>;
  addCity: (cityData: Partial<City>) => Promise<boolean>;
  editCity: (id: string, cityData: Partial<City>) => Promise<boolean>;
  removeCity: (id: string) => Promise<boolean>;
}

export const useCityStore = create<CityStore>((set, get) => ({
  cities: [],
  loading: false,
  error: null,

  fetchCities: async () => {
    set({ loading: true, error: null });
    try {
      const cities = await getCities();
      // Ensure cities is an array, fallback if not
      set({ cities: Array.isArray(cities) ? cities : [], loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to fetch cities", loading: false });
    }
  },

  addCity: async (cityData) => {
    set({ loading: true, error: null });
    try {
      const newCity = await createCity(cityData);
      set({
        cities: [newCity, ...get().cities],
        loading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to add city", loading: false });
      return false;
    }
  },

  editCity: async (id, cityData) => {
    set({ loading: true, error: null });
    try {
      const updatedCity = await updateCity(id, cityData);
      set({
        cities: get().cities.map((c) => (c._id === id ? updatedCity : c)),
        loading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to update city", loading: false });
      return false;
    }
  },

  removeCity: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteCity(id);
      set({
        cities: get().cities.filter((c) => c._id !== id),
        loading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to delete city", loading: false });
      return false;
    }
  },
}));
