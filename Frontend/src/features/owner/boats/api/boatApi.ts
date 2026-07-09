import axiosInstance from "@/api/axiosInstance";
import type { Boat, CreateBoatPayload } from "../types/boat.types";

export const createBoat = async (formData: any) => {
  const res = await axiosInstance.post("/boats", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.boat;
};

export const getMyBoats = async () => {
  const res = await axiosInstance.get("/boats/my-boats");
  return res.data;
};

export const updateBoat = async (
  id: string,
  payload: any
): Promise<Boat> => {
  const res = await axiosInstance.put<{
    message: string;
    boat: Boat;
  }>(`/boats/${id}`, payload);

  return res.data.boat;
};
export const getBoats = async (): Promise<Boat[]> => {
  const res = await axiosInstance.get<Boat[]>("/boats");
  return res.data;
};

export const toggleBoatAvailability = async (
  id: string
): Promise<Boat> => {
  const res = await axiosInstance.patch<{
    message: string;
    boat: Boat;
  }>(`/boats/${id}/toggle-availability`);

  return res.data.boat;
};

export const deleteBoat = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/boats/${id}`);
};