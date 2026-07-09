import { create } from "zustand";
import {
  getAuthorities,
  createAuthority,
  updateAuthority,
  updateAuthorityStatus,
  updateAuthorityPassword,
  deleteAuthority,
} from "../api/authorityApi";
import type { AuthorityUser, AuthorityStats, AuthorityFilters } from "../types/authority.types";

interface AuthorityState {
  authorities: AuthorityUser[];
  stats: AuthorityStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  loading: boolean;
  error: string | null;
  filters: AuthorityFilters;
  fetchAuthorities: (newFilters?: Partial<AuthorityFilters>) => Promise<void>;
  addAuthority: (formData: FormData) => Promise<boolean>;
  editAuthority: (id: string, formData: FormData) => Promise<boolean>;
  removeAuthority: (id: string) => Promise<boolean>;
  changeAuthorityStatus: (id: string, isActive: boolean) => Promise<boolean>;
  changeAuthorityPassword: (id: string, password: string) => Promise<boolean>;
}

export const useAuthorityStore = create<AuthorityState>((set, get) => ({
  authorities: [],
  stats: {
    total: 0,
    active: 0,
    inactive: 0,
    assignedCitiesCount: 0,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  },
  loading: false,
  error: null,
  filters: {
    search: "",
    cityId: "",
    status: "",
    department: "",
    designation: "",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  },

  fetchAuthorities: async (newFilters) => {
    const updatedFilters = { ...get().filters, ...newFilters };
    // Make sure page defaults to 1 when changing other filters (except page itself)
    if (newFilters && !Object.keys(newFilters).includes("page")) {
      updatedFilters.page = 1;
    }
    set({ loading: true, error: null, filters: updatedFilters });
    try {
      const res = await getAuthorities(updatedFilters);
      if (res.success) {
        set({
          authorities: res.authorities,
          stats: res.stats,
          pagination: res.pagination,
          loading: false,
        });
      } else {
        set({ error: "Failed to fetch authorities", loading: false });
      }
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || "Failed to fetch authorities",
        loading: false,
      });
    }
  },

  addAuthority: async (formData) => {
    set({ loading: true, error: null });
    try {
      await createAuthority(formData);
      set({ loading: false });
      get().fetchAuthorities();
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || "Failed to create authority",
        loading: false,
      });
      return false;
    }
  },

  editAuthority: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      await updateAuthority(id, formData);
      set({ loading: false });
      get().fetchAuthorities();
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || "Failed to update authority",
        loading: false,
      });
      return false;
    }
  },

  removeAuthority: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteAuthority(id);
      set({ loading: false });
      get().fetchAuthorities();
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || "Failed to delete authority",
        loading: false,
      });
      return false;
    }
  },

  changeAuthorityStatus: async (id, isActive) => {
    try {
      await updateAuthorityStatus(id, isActive);
      // Optimistic update local state count
      const updated = get().authorities.map((auth) =>
        auth.id === id || (auth as any)._id === id ? { ...auth, isActive } : auth
      );
      set({ authorities: updated });
      // Fetch fresh data for stats
      get().fetchAuthorities();
      return true;
    } catch (err: any) {
      return false;
    }
  },

  changeAuthorityPassword: async (id, password) => {
    try {
      await updateAuthorityPassword(id, password);
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || "Failed to reset password",
      });
      return false;
    }
  },
}));
