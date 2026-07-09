import { create } from "zustand";
import { getStaffTeam } from "../api/teamApi";
import type { TeamMember } from "../types/team.types";

interface TeamState {
  members: TeamMember[];
  loading: boolean;
  fetchMembers: () => Promise<void>;
}

export const useTeamStore = create<TeamState>((set) => ({
  members: [],
  loading: false,

  fetchMembers: async () => {
    set({ loading: true });
    try {
      const data = await getStaffTeam();
      set({
        members: data,
        loading: false,
      });
    } catch {
      set({
        loading: false,
      });
    }
  },
}));