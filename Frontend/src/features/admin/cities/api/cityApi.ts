import axiosInstance from "@/api/axiosInstance";
import type { City } from "../types/city.types";

export const getCities = async (): Promise<City[]> => {
  const res = await axiosInstance.get<City[]>("/cities");
  return res.data;
};

export const createCity = async (cityData: Partial<City>): Promise<City> => {
  const res = await axiosInstance.post("/cities", cityData);
  return res.data.city;
};

export const updateCity = async (id: string, cityData: Partial<City>): Promise<City> => {
  const res = await axiosInstance.put(`/cities/${id}`, cityData);
  return res.data.city;
};

export const deleteCity = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/cities/${id}`);
};