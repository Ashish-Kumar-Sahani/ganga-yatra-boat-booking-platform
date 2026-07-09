import { useEffect } from "react";
import { useTeamStore } from "../store/teamStore";
import TeamStats from "../components/TeamStats";
import TeamTable from "../components/TeamTable";
import { RefreshCcw } from "lucide-react";

export default function Team() {
  const { members, loading, fetchMembers } = useTeamStore();

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="space-y-6 p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">Team Management</h1>
          <p className="text-slate-500">
            View active managers, drivers, captains and helper assignments
          </p>
        </div>

        <button
          onClick={fetchMembers}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white p-12 text-center text-slate-500 font-semibold shadow flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
          Loading team...
        </div>
      ) : (
        <>
          <TeamStats team={members} />
          <TeamTable team={members} />
        </>
      )}
    </div>
  );
}