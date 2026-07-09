import type { TeamMember } from "../types/team.types";

type Props = {
  team?: TeamMember[];
};

export default function TeamTable({ team = [] }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-4">Name</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Assigned Boat</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {team.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-500">
                  No team members found.
                </td>
              </tr>
            ) : (
              team.map((member) => (
                <tr key={member._id} className="border-t hover:bg-slate-50">
                  <td className="p-4 font-bold text-blue-950">{member.name}</td>
                  <td>{member.role}</td>
                  <td>{member.phone || "-"}</td>
                  <td>{member.email || "-"}</td>
                  <td>
                    {member.assignedBoatId?.boatName || "Not Assigned"}
                    <p className="text-xs text-slate-500">
                      {member.assignedBoatId?.boatNumber || ""}
                    </p>
                  </td>
                  <td>{member.status || "ACTIVE"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}