import axiosInstance from "@/api/axiosInstance";

export const getViolationsApi = async () => {
  const res = await axiosInstance.get("/authority/violations");
  return res.data;
};

export const createViolationApi = async (payload: any) => {
  const res = await axiosInstance.post("/authority/violations", payload);
  return res.data;
};

export const updateViolationStatusApi = async (id: string, status: string, resolutionNotes?: string) => {
  const res = await axiosInstance.patch(`/authority/violations/${id}/status`, { status, resolutionNotes });
  return res.data;
};

export const updateViolationPenaltyApi = async (id: string, payload: { penaltyAmount?: number; penaltyPaid?: boolean }) => {
  const res = await axiosInstance.patch(`/authority/violations/${id}/penalty`, payload);
  return res.data;
};
