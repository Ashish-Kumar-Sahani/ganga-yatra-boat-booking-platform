import {
  deleteStaff,
  updateStaff,
} from "@/features/owner/staff/api/staffApi";

type Props = {
  staff?: any[];
  onRefresh?: () => Promise<void>;
};

export default function StaffTable({ staff = [], onRefresh }: Props) {
const handleToggleStatus = async (member: any) => {
  try {
    await updateStaff(member._id, {
      source: member.source,
      status: member.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    });

    await onRefresh?.();
  } catch (error: any) {
    alert(error?.response?.data?.message || "Status update failed");
  }
};

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this staff member?")) return;

    try {
      await deleteStaff(id);
      await onRefresh?.();
      alert("Staff removed successfully");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Staff remove failed");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4">Staff Name</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Assigned Boat</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {staff.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-500">
                  No staff found.
                </td>
              </tr>
            ) : (
              staff.map((member) => (
                <tr key={member._id} className="border-t hover:bg-slate-50">
                  <td className="p-4 font-semibold text-blue-950">
                    {member.name}
                  </td>

                  <td>{member.role}</td>

                  <td>{member.phone}</td>

                  <td>{member.email || "-"}</td>

                  <td>
                    {member.assignedBoatId?.boatName || "Not Assigned"}
                    <p className="text-xs text-slate-500">
                      {member.assignedBoatId?.boatNumber || ""}
                    </p>
                  </td>

                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        member.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>

                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleStatus(member)}
                        className="rounded bg-amber-500 px-3 py-1 text-white"
                      >
                        Toggle
                      </button>
                      {member.source !== "USER" && (
                        <button
                          onClick={() => handleDelete(member._id)}
                          className="rounded bg-red-500 px-3 py-1 text-white"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}