import { Eye, Edit, Trash2, Key, Shield, ToggleLeft, ToggleRight } from "lucide-react";
import type { AuthorityUser } from "../types/authority.types";

interface Props {
  authorities: AuthorityUser[];
  onView: (auth: AuthorityUser) => void;
  onEdit: (auth: AuthorityUser) => void;
  onDelete: (id: string) => void;
  onResetPassword: (auth: AuthorityUser) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  loading: boolean;
}

export default function AuthorityTable({
  authorities,
  onView,
  onEdit,
  onDelete,
  onResetPassword,
  onToggleStatus,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-sm font-bold text-slate-500">Loading officials registry...</p>
        </div>
      </div>
    );
  }

  if (authorities.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
        <div className="flex flex-col items-center justify-center gap-3">
          <Shield size={40} className="text-slate-300 animate-pulse" />
          <h3 className="text-lg font-black text-blue-950">No City Authorities Found</h3>
          <p className="text-xs font-semibold text-slate-400 max-w-sm">
            We couldn't find any authority users matching the current search filters. Create one to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
              <th className="px-6 py-4">Official</th>
              <th className="px-6 py-4">Employee Code</th>
              <th className="px-6 py-4">Jurisdiction</th>
              <th className="px-6 py-4">Office Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Permissions</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
            {authorities.map((auth) => {
              const cityLabel = auth.cityId?.name
                ? `${auth.cityId.name} (${auth.cityId.state})`
                : auth.city || "Unassigned";

              const permissionsCount = auth.permissions?.length || 0;

              return (
                <tr key={auth.id || (auth as any)._id} className="hover:bg-slate-50/50 transition">
                  {/* Avatar & Name */}
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={auth.profileImage || "https://i.pravatar.cc/100?img=60"}
                        alt="Official"
                        className="h-10 w-10 rounded-full border bg-white object-cover shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-blue-950">{auth.name}</h4>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{auth.email}</p>
                        {auth.phone && <p className="text-[10px] text-slate-500 font-medium mt-0.5">{auth.phone}</p>}
                      </div>
                    </div>
                  </td>

                  {/* Employee Code */}
                  <td className="px-6 py-4.5 whitespace-nowrap">
                    <span className="rounded-lg bg-slate-100 border px-2.5 py-1 text-slate-800 font-bold font-mono">
                      {auth.employeeCode || "N/A"}
                    </span>
                  </td>

                  {/* City */}
                  <td className="px-6 py-4.5">
                    <span className="font-bold text-blue-900">{cityLabel}</span>
                  </td>

                  {/* Department & Designation */}
                  <td className="px-6 py-4.5">
                    <div>
                      <p className="text-slate-800 font-bold">{auth.designation || "N/A"}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{auth.department || "N/A"}</p>
                    </div>
                  </td>

                  {/* Status Toggle */}
                  <td className="px-6 py-4.5 whitespace-nowrap">
                    <button
                      onClick={() => onToggleStatus(auth.id || (auth as any)._id, !auth.isActive)}
                      className="flex items-center gap-1.5 transition text-left cursor-pointer"
                      title={auth.isActive ? "Deactivate User" : "Activate User"}
                    >
                      {auth.isActive ? (
                        <>
                          <ToggleRight size={24} className="text-green-600" />
                          <span className="text-[11px] font-bold text-green-700">Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={24} className="text-slate-300" />
                          <span className="text-[11px] font-bold text-slate-400">Inactive</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Permissions Count / Badges */}
                  <td className="px-6 py-4.5">
                    <span className="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-1 text-[10px] font-black text-blue-700">
                      {permissionsCount} Perms
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onView(auth)}
                        className="rounded-lg p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => onEdit(auth)}
                        className="rounded-lg p-1.5 hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition cursor-pointer"
                        title="Edit Official"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => onResetPassword(auth)}
                        className="rounded-lg p-1.5 hover:bg-orange-50 text-slate-400 hover:text-orange-600 transition cursor-pointer"
                        title="Reset Password"
                      >
                        <Key size={16} />
                      </button>

                      <button
                        onClick={() => onDelete(auth.id || (auth as any)._id)}
                        className="rounded-lg p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                        title="Delete Official"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
