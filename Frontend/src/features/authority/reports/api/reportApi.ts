import axiosInstance from "@/api/axiosInstance";

export const getReportsSummaryApi = async (startDate?: string, endDate?: string) => {
  const params: any = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  const res = await axiosInstance.get("/authority/reports/summary", { params });
  return res.data;
};
