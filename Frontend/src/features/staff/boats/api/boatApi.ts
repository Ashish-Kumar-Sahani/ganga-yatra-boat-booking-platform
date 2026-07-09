import API from "@/api/axiosInstance";
import type { StaffBoat } from "../types/boat.types";

export const getStaffBoats = async (): Promise<StaffBoat[]> => {
  const res = await API.get("/boats/my-boats");
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const toggleBoatAvailability = async (boatId: string) => {
  const res = await API.patch(`/boats/${boatId}/toggle-availability`);
  return res.data;
};