import API from "@/api/axiosInstance";
import type { LiveTrip, Schedule } from "../types/liveTracking.types";

const normalizeArray = <T,>(payload: any): T[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.trips)) return payload.trips;
  if (Array.isArray(payload?.schedules)) return payload.schedules;
  return [];
};

export const getStaffLiveTrips = async (): Promise<LiveTrip[]> => {
  const res = await API.get("/trips/owner");
  return normalizeArray<LiveTrip>(res.data);
};

export const getStaffSchedulesForTracking = async (): Promise<Schedule[]> => {
  const res = await API.get("/schedules/owner");
  return normalizeArray<Schedule>(res.data);
};