import axiosInstance from "@/api/axiosInstance";
import type { Inspection } from "../types/inspection.types";

export const getInspectionsApi = async (): Promise<Inspection[]> => {
  const res = await axiosInstance.get("/authority/inspections");
  return res.data;
};

export const getInspectionByIdApi = async (id: string): Promise<Inspection> => {
  const res = await axiosInstance.get(`/authority/inspections/${id}`);
  return res.data;
};

export const createInspectionApi = async (payload: any) => {
  const res = await axiosInstance.post("/authority/inspections", payload);
  return res.data;
};

export const updateInspectionResultApi = async (id: string, result: string, remarks?: string) => {
  const res = await axiosInstance.patch(`/authority/inspections/${id}/result`, { result, remarks });
  return res.data;
};
