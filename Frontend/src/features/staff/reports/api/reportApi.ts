import axiosInstance from "../../../../api/axiosInstance";
import type { ReportDashboard } from "../types/report.types";

export const getReports = async (): Promise<ReportDashboard> => {
  const res = await axiosInstance.get("/reports/owner");
  return res.data;
};

export const exportPdfReport = async () => {
  return axiosInstance.get("/manager/reports/pdf");
};

export const exportExcelReport = async () => {
  return axiosInstance.get("/manager/reports/excel");
};