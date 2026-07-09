import { create } from "zustand";

import { getManagerCustomers }
from "../api/customerApi";

import type {
  ManagerCustomer,
} from "../types/customer.types";

interface CustomerState {
  customers: ManagerCustomer[];

  loading: boolean;

  fetchCustomers: () => Promise<void>;
}

export const useCustomerStore =
  create<CustomerState>((set) => ({
    customers: [],

    loading: false,

    fetchCustomers: async () => {
      set({ loading: true });

      try {
        const data =
          await getManagerCustomers();

        set({
          customers: data,
          loading: false,
        });
      } catch {
        set({
          loading: false,
        });
      }
    },
  }));