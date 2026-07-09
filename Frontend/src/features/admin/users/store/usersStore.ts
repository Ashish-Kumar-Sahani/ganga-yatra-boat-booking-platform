import { create } from "zustand";
import {
  getUsers,
  updateUser,
  deleteUser,
  updateUserStatus,
  bulkUpdateUserStatus,
  bulkDeleteUsers,
} from "../api/usersApi";
import type { GetUsersParams } from "../api/usersApi";

interface UsersState {
  users: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  loading: boolean;
  error: string | null;
  params: GetUsersParams;
  fetchUsers: (newParams?: Partial<GetUsersParams>) => Promise<void>;
  editUser: (id: string, data: any) => Promise<boolean>;
  removeUser: (id: string) => Promise<boolean>;
  toggleUserStatus: (id: string, isActive: boolean) => Promise<boolean>;
  bulkToggleStatus: (userIds: string[], isActive: boolean) => Promise<boolean>;
  bulkDelete: (userIds: string[]) => Promise<boolean>;
}

export const useAdminUsersStore = create<UsersState>((set, get) => ({
  users: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  },
  loading: false,
  error: null,
  params: {
    search: "",
    role: "",
    status: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  },

  fetchUsers: async (newParams) => {
    const updatedParams = { ...get().params, ...newParams };
    set({ loading: true, error: null, params: updatedParams });
    try {
      const res = await getUsers(updatedParams);
      if (res.success) {
        set({
          users: res.users,
          pagination: res.pagination,
          loading: false,
        });
      } else {
        set({ error: res.message || "Failed to fetch users", loading: false });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "An error occurred", loading: false });
    }
  },

  editUser: async (id, data) => {
    set({ loading: true });
    try {
      const res = await updateUser(id, data);
      set({ loading: false });
      if (res.user) {
        get().fetchUsers();
        return true;
      }
      return false;
    } catch (err) {
      set({ loading: false });
      return false;
    }
  },

  removeUser: async (id) => {
    set({ loading: true });
    try {
      await deleteUser(id);
      set({ loading: false });
      get().fetchUsers();
      return true;
    } catch (err) {
      set({ loading: false });
      return false;
    }
  },

  toggleUserStatus: async (id, isActive) => {
    try {
      await updateUserStatus(id, isActive);
      const updated = get().users.map((u) => (u._id === id ? { ...u, isActive } : u));
      set({ users: updated });
      return true;
    } catch (err) {
      return false;
    }
  },

  bulkToggleStatus: async (userIds, isActive) => {
    try {
      await bulkUpdateUserStatus(userIds, isActive);
      get().fetchUsers();
      return true;
    } catch (err) {
      return false;
    }
  },

  bulkDelete: async (userIds) => {
    try {
      await bulkDeleteUsers(userIds);
      get().fetchUsers();
      return true;
    } catch (err) {
      return false;
    }
  },
}));
