import axiosInstance from "../../../../api/axiosInstance";
import type { ManagerCustomer } from "../types/customer.types";

export const getManagerCustomers =
  async (): Promise<ManagerCustomer[]> => {
    const res =
      await axiosInstance.get(
        "/manager/customers"
      );

    return res.data;
  };

export const blockCustomer =
  async (customerId: string) => {
    const res =
      await axiosInstance.patch(
        `/manager/customers/${customerId}/block`
      );

    return res.data;
  };