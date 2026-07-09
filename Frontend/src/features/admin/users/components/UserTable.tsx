import { Edit2, Eye, Trash2, ArrowUpDown, ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import { useAdminUsersStore } from "../store/usersStore";

type Props = {
  onView: (user: any) => void;
  onEdit: (user: any) => void;
  onDelete: (id: string) => void;
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
};

export default function UserTable({
  onView,
  onEdit,
  onDelete,
  selectedIds,
  onSelectAll,
  onSelectOne,
}: Props) {
  const { users, loading, error, pagination, params, fetchUsers, toggleUserStatus } = useAdminUsersStore();

  const handleSort = (field: string) => {
    const isAsc = params.sortBy === field && params.sortOrder === "asc";
    fetchUsers({ sortBy: field, sortOrder: isAsc ? "desc" : "asc" });
  };

  const handlePageChange = (newPage: number) => {
    fetchUsers({ page: newPage });
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    await toggleUserStatus(id, !currentStatus);
  };

  if (error) {
    return (
      <div className="mt-6 rounded-2xl bg-red-50 p-6 text-center border border-red-200">
        <ShieldAlert className="mx-auto text-red-500 mb-2" size={32} />
        <p className="text-red-700 font-semibold">{error}</p>
        <button onClick={() => fetchUsers()} className="mt-2 text-sm text-red-600 underline">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow border border-slate-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50/80 text-blue-950 font-semibold border-b">
            <tr>
              <th className="p-4 w-12">
                <input
                  type="checkbox"
                  checked={users.length > 0 && selectedIds.length === users.length}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                />
              </th>
              <th className="p-4 cursor-pointer hover:bg-slate-100 transition" onClick={() => handleSort("name")}>
                <span className="flex items-center gap-1.5">
                  Name <ArrowUpDown size={14} className="text-slate-400" />
                </span>
              </th>
              <th className="p-4 cursor-pointer hover:bg-slate-100 transition" onClick={() => handleSort("email")}>
                <span className="flex items-center gap-1.5">
                  Email <ArrowUpDown size={14} className="text-slate-400" />
                </span>
              </th>
              <th className="p-4">Phone</th>
              <th className="p-4 cursor-pointer hover:bg-slate-100 transition" onClick={() => handleSort("role")}>
                <span className="flex items-center gap-1.5">
                  Role <ArrowUpDown size={14} className="text-slate-400" />
                </span>
              </th>
              <th className="p-4 cursor-pointer hover:bg-slate-100 transition" onClick={() => handleSort("isActive")}>
                <span className="flex items-center gap-1.5">
                  Status <ArrowUpDown size={14} className="text-slate-400" />
                </span>
              </th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="p-4"><div className="h-4 w-4 bg-slate-200 rounded"></div></td>
                  <td className="p-4"><div className="h-4 w-32 bg-slate-200 rounded"></div></td>
                  <td className="p-4"><div className="h-4 w-40 bg-slate-200 rounded"></div></td>
                  <td className="p-4"><div className="h-4 w-28 bg-slate-200 rounded"></div></td>
                  <td className="p-4"><div className="h-4 w-20 bg-slate-200 rounded"></div></td>
                  <td className="p-4"><div className="h-6 w-16 bg-slate-200 rounded-full"></div></td>
                  <td className="p-4"><div className="h-8 w-24 bg-slate-200 rounded mx-auto"></div></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-500 font-medium">
                  No users found matching filters.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user._id)}
                      onChange={(e) => onSelectOne(user._id, e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                    />
                  </td>
                  <td className="p-4 font-semibold text-blue-950 flex items-center gap-3">
                    <img
                      src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=dbeafe&color=2563eb`}
                      alt={user.name}
                      className="h-9 w-9 rounded-full object-cover border"
                    />
                    {user.name}
                  </td>
                  <td className="p-4 text-slate-600">{user.email}</td>
                  <td className="p-4 text-slate-600">{user.phone || "—"}</td>
                  <td className="p-4">
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleActive(user._id, user.isActive)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold cursor-pointer transition ${
                        user.isActive
                          ? "bg-green-55/10 text-green-700 hover:bg-green-55/20"
                          : "bg-red-55/10 text-red-700 hover:bg-red-55/20"
                      }`}
                      title={user.isActive ? "Deactivate User" : "Activate User"}
                    >
                      {user.isActive ? (
                        <>
                          <CheckCircle size={12} /> Active
                        </>
                      ) : (
                        <>
                          <XCircle size={12} /> Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onView(user)}
                        className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-55/10 transition"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEdit(user)}
                        className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-55/10 transition"
                        title="Edit User"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(user._id)}
                        className="rounded-lg p-1.5 text-red-600 hover:bg-red-55/10 transition"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!loading && users.length > 0 && (
        <div className="flex items-center justify-between border-t p-4 text-xs font-medium text-slate-500">
          <p>
            Showing Page <b>{pagination.page}</b> of <b>{pagination.pages}</b> (Total: <b>{pagination.total}</b> Users)
          </p>

          <div className="flex gap-1.5">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="rounded-lg border px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50 transition cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="rounded-lg border px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}