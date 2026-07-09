import axiosInstance from "@/api/axiosInstance";
import type { BoatRoute } from "@/features/owner/routes/types/route.types";

export const getOwnerRoutes = async (): Promise<BoatRoute[]> => {
  const res = await axiosInstance.get("/routes");
  return Array.isArray(res.data) ? res.data : res.data.data || [];
};

export const getRoutes = async (): Promise<BoatRoute[]> => {
  const res = await axiosInstance.get("/routes");
  return Array.isArray(res.data) ? res.data : res.data.data || [];
};

export const getRouteById = async (id: string): Promise<BoatRoute> => {
  const res = await axiosInstance.get(`/routes/${id}`);
  return res.data.data || res.data;
};