import { ShieldCheck, UserCheck, UserX, Ship, Eye } from "lucide-react";

type Props = {
  owners: any[];
  boats: any[];
  onView: (owner: any) => void;
  onVerify: (owner: any) => void;
  onViewBoats: (owner: any) => void;
};

export default function BoatOwnerTable({
  owners,
  boats,
  onView,
  onVerify,
  onViewBoats,
}: Props) {
  const getBoatsCount = (ownerId: string) => {
    return boats.filter((b) => {
      const bOwnerId = b.ownerId?._id || b.ownerId;
      return bOwnerId === ownerId;
    }).length;
  };

  return (
    <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow border border-slate-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50/80 text-blue-950 font-semibold border-b">
            <tr>
              <th className="p-4">Owner Name</th>
              <th className="p-4">Email</th>
              <th className="p-4 text-center">Boats Owned</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {owners.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">
                  No boat owners registered.
                </td>
              </tr>
            ) : (
              owners.map((owner) => {
                const count = getBoatsCount(owner._id);
                return (
                  <tr key={owner._id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-semibold text-blue-950 flex items-center gap-3">
                      <img
                        src={owner.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.name)}&background=dbeafe&color=2563eb`}
                        alt={owner.name}
                        className="h-9 w-9 rounded-full object-cover border"
                      />
                      {owner.name}
                    </td>
                    <td className="p-4 text-slate-600">{owner.email}</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 bg-slate-100 rounded-full px-2.5 py-1 text-xs font-bold text-slate-700">
                        <Ship size={12} /> {count} {count === 1 ? "boat" : "boats"}
                      </span>
                    </td>
                    <td className="p-4">
                      {owner.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-700 px-2.5 py-1 text-xs font-semibold">
                          <UserCheck size={12} /> Active / Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-55/10 px-2.5 py-1 text-xs font-semibold text-red-700">
                          <UserX size={12} /> Pending / Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onView(owner)}
                          className="rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye size={14} /> Profile
                        </button>
                        <button
                          onClick={() => onVerify(owner)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            owner.isActive
                              ? "bg-amber-55/10 hover:bg-amber-55/20 text-amber-600"
                              : "bg-green-55/10 hover:bg-green-55/20 text-green-600"
                          }`}
                        >
                          <ShieldCheck size={14} /> {owner.isActive ? "Deverify" : "Verify"}
                        </button>
                        <button
                          onClick={() => onViewBoats(owner)}
                          className="rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Ship size={14} /> Boats
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}