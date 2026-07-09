import axiosInstance from "@/api/axiosInstance";

export const getRoutesApi = async (status?: string) => {
  const params: any = {};
  if (status) params.status = status;
  const res = await axiosInstance.get("/authority/routes", { params });
  return res.data;
};

export const getRouteByIdApi = async (id: string) => {
  const res = await axiosInstance.get(`/authority/routes/${id}`);
  return res.data;
};

export const approveRouteApi = async (id: string, payload: { approvalNote?: string; safetyNote?: string }) => {
  const res = await axiosInstance.patch(`/authority/routes/${id}/approve`, payload);
  return res.data;
};

export const rejectRouteApi = async (id: string, rejectionReason: string, approvalNote?: string) => {
  const res = await axiosInstance.patch(`/authority/routes/${id}/reject`, { rejectionReason, approvalNote });
  return res.data;
};

export const suspendRouteApi = async (id: string, suspendedReason: string, approvalNote?: string) => {
  const res = await axiosInstance.patch(`/authority/routes/${id}/suspend`, { suspendedReason, approvalNote });
  return res.data;
};
