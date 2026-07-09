import axiosInstance from "@/api/axiosInstance";

export const getComplaintsApi = async () => {
  const res = await axiosInstance.get("/authority/complaints");
  return res.data;
};

export const updateComplaintStatusApi = async (id: string, status: string, authorityNote?: string) => {
  const res = await axiosInstance.patch(`/authority/complaints/${id}/status`, { status, authorityNote });
  return res.data;
};

export const updateComplaintNoteApi = async (id: string, payload: { authorityNote: string; linkedViolationId?: string | null }) => {
  const res = await axiosInstance.patch(`/authority/complaints/${id}/note`, payload);
  return res.data;
};
