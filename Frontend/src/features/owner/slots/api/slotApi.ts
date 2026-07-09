import axiosInstance from "@/api/axiosInstance";
import type { Slot, SlotApiResponse } from "../types/slot.types";

export const getSlots = async (): Promise<Slot[]> => {
  const res = await axiosInstance.get<SlotApiResponse<Slot[]> | Slot[]>(
    "/slots"
  );

  if (Array.isArray(res.data)) {
    return res.data;
  }

  return res.data.data;
};

export const getOwnerSlots = async (): Promise<Slot[]> => {
  const res = await axiosInstance.get<SlotApiResponse<Slot[]> | Slot[]>(
    "/slots/owner"
  );

  if (Array.isArray(res.data)) {
    return res.data;
  }

  return res.data.data;
};

export const getSlotById = async (id: string): Promise<Slot> => {
  const res = await axiosInstance.get<SlotApiResponse<Slot> | Slot>(
    `/slots/${id}`
  );

  if ("data" in res.data) {
    return res.data.data;
  }

  return res.data;
};
export const updateSlotStatus = async (
  id: string,
  status: "OPEN" | "FULL" | "CANCELLED" | "EXPIRED"
) => {
  const res = await axiosInstance.patch(`/slots/${id}/status`, {
    status,
  });

  return res.data.slot;
};
export const getMonthlySlotAvailability = async (
  routeId: string,
  month: string
) => {
  const res = await axiosInstance.get(
    `/slots/monthly?routeId=${routeId}&month=${month}`
  );

  return res.data;
};
export const getOwnerMonthlySlots = async (days = 30): Promise<Slot[]> => {
  const res = await axiosInstance.get(`/slots/owner/monthly?days=${days}`);
  return Array.isArray(res.data) ? res.data : res.data.data;
};

export const updateSlot = async (
  id: string,
  data: Partial<Slot>
): Promise<Slot> => {
  const res = await axiosInstance.put(`/slots/${id}`, data);
  return res.data.slot;
};

export const shiftSlotDate = async (
  id: string,
  slotDate: string
): Promise<Slot> => {
  const res = await axiosInstance.patch(`/slots/${id}/shift-date`, {
    slotDate,
  });

  return res.data.slot;
};
export const generateSlots = async (data: {
  scheduleId: string;
  days: number;
}) => {
  const res = await axiosInstance.post("/slots/generate", data);
  return res.data.slots;
};
export const getSlotPassengers = async (slotId: string) => {
  const res = await axiosInstance.get(`/slots/${slotId}/passengers`);
  return res.data;
};