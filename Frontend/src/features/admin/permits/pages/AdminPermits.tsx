import { useEffect, useState } from "react";
import { ShieldCheck, ShieldAlert, FileText, Search, Check, Ban } from "lucide-react";
import { useAdminBoatsStore } from "../../boats/store/boatsStore";

export default function AdminPermits() {
  const { boats, loading, fetchBoats, editBoat } = useAdminBoatsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchBoats();
  }, []);

  const handleVerifyPermit = async (id: string, verified: boolean) => {
    const confirmation = verified
      ? "Are you sure you want to verify this boat permit?"
      : "Are you sure you want to revoke verification for this permit?";
    if (confirm(confirmation)) {
      await editBoat(id, { permitVerified: verified });
    }
  };

  const filteredBoats = boats.filter((boat) => {
    const hasPermit = boat.documents?.permitNumber || boat.permitNumber;
    if (!hasPermit) return false;

    const matchesSearch =
      boat.boatName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (boat.documents?.permitNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (boat.ownerId?.name || "").toLowerCase().includes(searchTerm.toLowerCase());

    const isVerified = boat.permitVerified;
    const matchesStatus =
      statusFilter === "" ||
      (statusFilter === "VERIFIED" && isVerified) ||
      (statusFilter === "PENDING" && !isVerified);

    return matchesSearch && matchesStatus;
  });

  const totalPermits = boats.filter((b) => b.documents?.permitNumber || b.permitNumber).length;
  const verifiedCount = boats.filter((b) => (b.documents?.permitNumber || b.permitNumber) && b.permitVerified).length;
  const pendingCount = totalPermits - verifiedCount;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-950">Permits & Credentials</h1>
          <p className="text-sm text-slate-500 mt-1">Audit, approve, and verify tourist and passenger transport licenses.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow border border-slate-100">
          <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Submitted Permits</p>
            <h3 className="text-2xl font-extrabold text-blue-950 mt-0.5">{totalPermits}</h3>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow border border-slate-100">
          <div className="h-12 w-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Verified Licenses</p>
            <h3 className="text-2xl font-extrabold text-blue-950 mt-0.5">{verifiedCount}</h3>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow border border-slate-100">
          <div className="h-12 w-12 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Awaiting Verification</p>
            <h3 className="text-2xl font-extrabold text-blue-950 mt-0.5">{pendingCount}</h3>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow border border-slate-100 sm:flex-row sm:items-center justify-between">
        <div className="flex items-center gap-3 rounded-xl border px-3 py-2 bg-slate-50 flex-1 sm:max-w-xs focus-within:border-blue-500 transition">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search boat, owner, permit ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border px-4 py-2 bg-slate-50 focus:border-blue-500 outline-none cursor-pointer text-sm"
        >
          <option value="">All Verification Statuses</option>
          <option value="VERIFIED">Verified Only</option>
          <option value="PENDING">Pending Only</option>
        </select>
      </div>

      {/* Permits table */}
      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50/80 text-blue-950 font-semibold border-b">
              <tr>
                <th className="p-4">Boat Details</th>
                <th className="p-4">License Type & ID</th>
                <th className="p-4">Owner</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-4 w-32 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-40 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-28 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-6 w-16 bg-slate-200 rounded-full"></div></td>
                    <td className="p-4"><div className="h-8 w-24 bg-slate-200 rounded mx-auto"></div></td>
                  </tr>
                ))
              ) : filteredBoats.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">
                    No permit records found matching filters.
                  </td>
                </tr>
              ) : (
                filteredBoats.map((boat) => {
                  const permitNum = boat.documents?.permitNumber || boat.permitNumber;
                  const regNum = boat.documents?.registrationNumber || "—";
                  return (
                    <tr key={boat._id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-semibold text-blue-950">{boat.boatName}</td>
                      <td className="p-4">
                        <div className="text-xs text-slate-600">Permit ID: <span className="font-mono font-bold text-blue-900">{permitNum}</span></div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Reg ID: {regNum}</div>
                      </td>
                      <td className="p-4 text-slate-700 font-medium">{boat.ownerId?.name || "Owner Deleted"}</td>
                      <td className="p-4">
                        {boat.permitVerified ? (
                          <span className="inline-flex rounded-full bg-green-50 text-green-700 px-2.5 py-1 text-xs font-bold">
                            Verified Active
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-yellow-50 text-yellow-700 px-2.5 py-1 text-xs font-bold">
                            Pending Review
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          {!boat.permitVerified ? (
                            <button
                              onClick={() => handleVerifyPermit(boat._id, true)}
                              className="rounded-lg bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <Check size={14} /> Approve & Verify
                            </button>
                          ) : (
                            <button
                              onClick={() => handleVerifyPermit(boat._id, false)}
                              className="rounded-lg bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <Ban size={14} /> Revoke Permit
                            </button>
                          )}
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
    </div>
  );
}
