import axiosInstance from "@/api/axiosInstance";
import type { Route } from "../types/route.types";

export const getRoutes = async (): Promise<Route[]> => {
  const res = await axiosInstance.get<Route[]>("/routes");
  return res.data;
};

export const getRoutesByCity = async (cityId: string): Promise<Route[]> => {
  const res = await axiosInstance.get<Route[]>(`/routes/city/${cityId}`);
  return res.data;
};

export const createRoute = async (routeData: Partial<Route>): Promise<Route> => {
  const res = await axiosInstance.post("/routes", routeData);
  return res.data.route;
};

export const updateRoute = async (id: string, routeData: Partial<Route>): Promise<Route> => {
  const res = await axiosInstance.put(`/routes/${id}`, routeData);
  return res.data.route;
};

export const deleteRoute = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/routes/${id}`);
};

export const approveRoute = async (id: string): Promise<Route> => {
  const res = await axiosInstance.patch(`/routes/${id}/approve`);
  return res.data.route;
};

export const rejectRoute = async (id: string): Promise<Route> => {
  const res = await axiosInstance.patch(`/routes/${id}/reject`);
  return res.data.route;
};
