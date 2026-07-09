import axiosInstance from "@/api/axiosInstance";

export const getBoatsApi = async (status?: string, search?: string) => {
  const params: any = {};
  if (status) params.status = status;
  if (search) params.search = search;
  const res = await axiosInstance.get("/authority/boats", { params });
  return res.data;
};

export const getBoatByIdApi = async (id: string) => {
  const res = await axiosInstance.get(`/authority/boats/${id}`);
  return res.data;
};

export const approveBoatApi = async (id: string, reviewNote?: string) => {
  const res = await axiosInstance.patch(`/authority/boats/${id}/approve`, { reviewNote });
  return res.data;
};

export const rejectBoatApi = async (id: string, rejectionReason: string, reviewNote?: string) => {
  const res = await axiosInstance.patch(`/authority/boats/${id}/reject`, { rejectionReason, reviewNote });
  return res.data;
};

export const suspendBoatApi = async (id: string, suspendedReason: string, reviewNote?: string) => {
  const res = await axiosInstance.patch(`/authority/boats/${id}/suspend`, { suspendedReason, reviewNote });
  return res.data;
};
