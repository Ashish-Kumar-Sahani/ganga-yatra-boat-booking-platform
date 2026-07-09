import API from "@/api/axiosInstance";
import type { TeamMember } from "../types/team.types";

const normalizeTeam = (payload: any): TeamMember[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.staff)) return payload.staff;
  if (Array.isArray(payload?.team)) return payload.team;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const getStaffTeam = async (): Promise<TeamMember[]> => {
  const res = await API.get("/staff/owner");
  return normalizeTeam(res.data);
};