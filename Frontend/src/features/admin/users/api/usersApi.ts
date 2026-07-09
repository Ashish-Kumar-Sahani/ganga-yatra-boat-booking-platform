import axiosInstance from "@/api/axiosInstance";

export type GetUsersParams = {
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export const getUsers = async (params: GetUsersParams) => {
  const response = await axiosInstance.get("/users", { params });
  return response.data;
};

export const updateUser = async (id: string, data: any) => {
  const response = await axiosInstance.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data;
};

export const updateUserStatus = async (id: string, isActive: boolean) => {
  const response = await axiosInstance.patch(`/users/${id}/status`, { isActive });
  return response.data;
};

export const bulkUpdateUserStatus = async (userIds: string[], isActive: boolean) => {
  const response = await axiosInstance.patch("/users/bulk-status", { userIds, isActive });
  return response.data;
};

export const bulkDeleteUsers = async (userIds: string[]) => {
  const response = await axiosInstance.post("/users/bulk-delete", { userIds });
  return response.data;
};
