import axiosInstance from "@/api/axiosInstance";
import type { Ghat } from "../types/ghat.types";

export const getGhats = async (): Promise<Ghat[]> => {
  const res = await axiosInstance.get<Ghat[]>("/ghats");
  return res.data;
};

export const getGhatsByCity = async (cityId: string): Promise<Ghat[]> => {
  const res = await axiosInstance.get<Ghat[]>(`/ghats/city/${cityId}`);
  return res.data;
};

export const createGhat = async (ghatData: Partial<Ghat>): Promise<Ghat> => {
  const res = await axiosInstance.post("/ghats", ghatData);
  return res.data.ghat;
};

export const updateGhat = async (id: string, ghatData: Partial<Ghat>): Promise<Ghat> => {
  const res = await axiosInstance.put(`/ghats/${id}`, ghatData);
  return res.data.ghat;
};

export const deleteGhat = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/ghats/${id}`);
};