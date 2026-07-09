import axiosInstance from "@/api/axiosInstance";

export const getAllBoats = async (params?: any) => {
  const response = await axiosInstance.get("/boats", { params });
  return response.data;
};

export const updateBoatDetails = async (id: string, data: any) => {
  const response = await axiosInstance.put(`/boats/admin/${id}`, data);
  return response.data;
};

export const verifyBoatStatus = async (id: string, status: string) => {
  const response = await axiosInstance.patch(`/boats/admin/${id}/status`, { status });
  return response.data;
};

export const deleteBoatByAdmin = async (id: string) => {
  const response = await axiosInstance.delete(`/boats/admin/${id}`);
  return response.data;
};
