import axiosInstance from "@/api/axiosInstance";

export const getPermitsApi = async (status?: string, type?: string) => {
  const params: any = {};
  if (status) params.status = status;
  if (type) params.type = type;
  const res = await axiosInstance.get("/authority/permits", { params });
  return res.data;
};

export const getPermitByIdApi = async (id: string) => {
  const res = await axiosInstance.get(`/authority/permits/${id}`);
  return res.data;
};

export const approvePermitApi = async (
  id: string,
  payload: { reviewNote?: string; validFrom?: string; validTill?: string }
) => {
  const res = await axiosInstance.patch(`/authority/permits/${id}/approve`, payload);
  return res.data;
};

export const rejectPermitApi = async (id: string, rejectionReason: string, reviewNote?: string) => {
  const res = await axiosInstance.patch(`/authority/permits/${id}/reject`, { rejectionReason, reviewNote });
  return res.data;
};

export const suspendPermitApi = async (id: string, suspendedReason: string, reviewNote?: string) => {
  const res = await axiosInstance.patch(`/authority/permits/${id}/suspend`, { suspendedReason, reviewNote });
  return res.data;
};

export const renewalRequiredPermitApi = async (id: string, reviewNote?: string) => {
  const res = await axiosInstance.patch(`/authority/permits/${id}/renewal-required`, { reviewNote });
  return res.data;
};
