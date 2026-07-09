import axiosInstance from "@/api/axiosInstance";

export const getTransactionsAdmin = async (params?: any) => {
  const response = await axiosInstance.get("/payments", { params });
  return response.data;
};
