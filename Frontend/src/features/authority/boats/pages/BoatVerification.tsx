import { useEffect, useState } from "react";
import { useBoatVerificationStore } from "../store/boatStore";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Info,
  X,
  User,
  FileText,
  FileCheck,
} from "lucide-react";

export default function BoatVerification() {
  const {
    boats,
    selectedBoat,
    loading,
    error,
    fetchBoats,
    fetchBoatById,
    approveBoat,
    rejectBoat,
    suspendBoat,
  } = useBoatVerificationStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [reasonAction, setReasonAction] = useState<"REJECT" | "SUSPEND">("REJECT");
  const [actionReason, setActionReason] = useState("");
  const [reviewNote, setReviewNote] = useState("");

  useEffect(() => {
    fetchBoats(statusFilter || undefined, search || undefined);
  }, [fetchBoats, statusFilter, search]);

  const handleOpenDetail = (id: string) => {
    fetchBoatById(id);
    setDetailModalOpen(true);
  };

  const handleApprove = async (id: string) => {
    const note = prompt("Enter optional review notes:");
    if (note !== null) {
      const ok = await approveBoat(id, note);
      if (ok) {
        alert("Boat approved successfully!");
        setDetailModalOpen(false);
      }
    }
  };

  const handleOpenReasonModal = (action: "REJECT" | "SUSPEND") => {
    setReasonAction(action);
    setActionReason("");
    setReviewNote("");
    setReasonModalOpen(true);
  };

  const handleReasonAction = async () => {
    if (!actionReason.trim()) {
      alert("Please provide a reason.");
      return;
    }
    if (!selectedBoat) return;

    let success = false;
    if (reasonAction === "REJECT") {
      success = await rejectBoat(selectedBoat._id, actionReason, reviewNote);
    } else {
      success = await suspendBoat(selectedBoat._id, actionReason, reviewNote);
    }

    if (success) {
      alert(`Boat ${reasonAction === "REJECT" ? "rejected" : "suspended"} successfully!`);
      setReasonModalOpen(false);
      setDetailModalOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-bold text-green-700">
            <CheckCircle size={12} />
            Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-bold text-red-700">
            <XCircle size={12} />
            Rejected
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-bold text-orange-700">
            <AlertTriangle size={12} />
            Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 border border-yellow-200 px-3 py-1 text-xs font-bold text-yellow-700 animate-pulse">
            <Info size={12} />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-blue-950">Boat Verification</h1>
          <p className="text-slate-500">Inspect boat registry registrations, licenses, and insurance details.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="rounded-3xl bg-white border border-slate-100 p-5 shadow-sm flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex-1 flex items-center gap-3 rounded-2xl border px-4 py-2.5 bg-slate-50 focus-within:border-blue-600 transition-all duration-300">
          <Search size={18} className="text-slate-400" />
          <input
            className="w-full bg-transparent text-sm outline-none text-slate-800 placeholder:text-slate-400"
            placeholder="Search by boat name, registry code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-500 flex items-center gap-1">
            <Filter size={16} /> Status:
          </span>
          <select
            className="rounded-2xl border px-4 py-2.5 text-sm font-bold text-slate-700 outline-none bg-slate-50 cursor-pointer focus:border-blue-600"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Boat List Table */}
      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-bold text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {loading && boats.length === 0 ? (
        <div className="py-20 text-center font-bold text-slate-500">Loading boats database...</div>
      ) : boats.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-slate-100">
          <h2 className="text-2xl font-black text-blue-950">No boats found</h2>
          <p className="mt-2 text-slate-500">No boat records matched the filter criteria in your city.</p>
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-black uppercase text-slate-500 tracking-wider">
                  <th className="p-5">Boat Details</th>
                  <th className="p-5">Owner</th>
                  <th className="p-5">Capacity / Type</th>
                  <th className="p-5">Jurisdiction</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {boats.map((boat) => (
                  <tr key={boat._id} className="hover:bg-slate-50/50 transition-colors duration-300">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={boat.image || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=100&q=80"}
                          alt={boat.boatName}
                          className="h-12 w-16 rounded-xl object-cover bg-slate-100"
                        />
                        <div>
                          <h4 className="font-black text-blue-950 leading-tight">{boat.boatName}</h4>
                          <span className="text-xs font-bold text-slate-400">{boat.boatNumber}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div>
                        <p className="font-bold text-slate-800">{boat.ownerId?.name || "N/A"}</p>
                        <p className="text-xs text-slate-400">{boat.ownerId?.phone || "No phone"}</p>
                      </div>
                    </td>
                    <td className="p-5">
                      <div>
                        <span className="font-black text-blue-950">{boat.capacity} Seats</span>
                        <p className="text-xs text-slate-400 uppercase font-bold">{boat.boatType}</p>
                      </div>
                    </td>
                    <td className="p-5">
                      <div>
                        <p className="font-bold text-slate-800">{boat.cityId?.name || "N/A"}</p>
                        <p className="text-xs text-slate-400">{boat.cityId?.riverName || ""}</p>
                      </div>
                    </td>
                    <td className="p-5">{getStatusBadge(boat.status)}</td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => handleOpenDetail(boat._id)}
                        className="rounded-xl border border-blue-200 hover:border-blue-500 hover:bg-blue-50 p-2.5 text-blue-600 transition duration-300"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailModalOpen && selectedBoat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div>
                <h3 className="text-2xl font-black text-blue-950">{selectedBoat.boatName}</h3>
                <span className="text-sm font-bold text-slate-400">Registry Code: {selectedBoat.boatNumber}</span>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="rounded-xl p-2 hover:bg-slate-100 text-slate-400"
              >
                <X />
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <img
                  src={selectedBoat.image || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"}
                  alt={selectedBoat.boatName}
                  className="w-full h-48 rounded-2xl object-cover bg-slate-100 shadow-sm"
                />

                <div className="mt-4 rounded-2xl bg-blue-50/50 border border-blue-100 p-4 space-y-3">
                  <h4 className="font-black text-blue-950 flex items-center gap-1.5 text-sm uppercase tracking-wider">
                    <User size={16} /> Owner Information
                  </h4>
                  <div className="grid grid-cols-2 text-xs">
                    <div>
                      <p className="text-slate-400">Name</p>
                      <p className="font-bold text-slate-800">{selectedBoat.ownerId?.name}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Phone</p>
                      <p className="font-bold text-slate-800">{selectedBoat.ownerId?.phone || "N/A"}</p>
                    </div>
                    <div className="mt-2 col-span-2">
                      <p className="text-slate-400">Email</p>
                      <p className="font-bold text-slate-800 truncate">{selectedBoat.ownerId?.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-100 p-4 space-y-3">
                  <h4 className="font-black text-blue-950 flex items-center gap-1.5 text-sm uppercase tracking-wider">
                    <FileText size={16} /> Registration & Documents
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-slate-500 font-semibold">Registration Number</span>
                      <span className="font-bold text-slate-800">{selectedBoat.documents?.registrationNumber || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-slate-500 font-semibold">Insurance Policy Number</span>
                      <span className="font-bold text-slate-800">{selectedBoat.documents?.insuranceNumber || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-slate-500 font-semibold">Existing Permit Code</span>
                      <span className="font-bold text-slate-800">{selectedBoat.documents?.permitNumber || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500 font-semibold">Permit Verified by Safety Audits</span>
                      <span className={`font-bold ${selectedBoat.permitVerified ? "text-green-600" : "text-red-500"}`}>
                        {selectedBoat.permitVerified ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 p-4 space-y-2 text-xs">
                  <h4 className="font-black text-blue-950 flex items-center gap-1.5 text-sm uppercase tracking-wider">
                    <FileCheck size={16} /> Verification Timeline & Audit
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Created At</span>
                      <span className="font-bold text-slate-800">{new Date(selectedBoat.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Verification status</span>
                      <span>{getStatusBadge(selectedBoat.status)}</span>
                    </div>
                    {selectedBoat.reviewNote && (
                      <div className="rounded-xl bg-slate-50 p-2.5 border text-slate-600 font-semibold">
                        <b>Reviewer Note:</b> {selectedBoat.reviewNote}
                      </div>
                    )}
                    {selectedBoat.rejectionReason && (
                      <div className="rounded-xl bg-red-50 p-2.5 border border-red-100 text-red-700 font-semibold">
                        <b>Rejection Reason:</b> {selectedBoat.rejectionReason}
                      </div>
                    )}
                    {selectedBoat.suspendedReason && (
                      <div className="rounded-xl bg-orange-50 p-2.5 border border-orange-100 text-orange-700 font-semibold">
                        <b>Suspension Reason:</b> {selectedBoat.suspendedReason}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-6 flex flex-wrap gap-3 justify-end border-t pt-4">
              {selectedBoat.status !== "APPROVED" && (
                <button
                  onClick={() => handleApprove(selectedBoat._id)}
                  className="rounded-xl bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 text-sm font-bold shadow"
                >
                  Approve Registration
                </button>
              )}
              {selectedBoat.status !== "REJECTED" && (
                <button
                  onClick={() => handleOpenReasonModal("REJECT")}
                  className="rounded-xl bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 text-sm font-bold shadow"
                >
                  Reject with Reason
                </button>
              )}
              {selectedBoat.status === "APPROVED" && (
                <button
                  onClick={() => handleOpenReasonModal("SUSPEND")}
                  className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 text-sm font-bold shadow"
                >
                  Suspend Vessel
                </button>
              )}
              <button
                onClick={() => setDetailModalOpen(false)}
                className="rounded-xl border px-5 py-2.5 text-sm font-bold hover:bg-slate-50"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reason Dialog Modal */}
      {reasonModalOpen && selectedBoat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-black text-blue-950">
                {reasonAction === "REJECT" ? "Reject Registration" : "Suspend Vessel"}
              </h3>
              <button
                onClick={() => setReasonModalOpen(false)}
                className="rounded-xl p-2 hover:bg-slate-100 text-slate-400"
              >
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  {reasonAction === "REJECT" ? "Rejection Reason *" : "Suspension Reason *"}
                </label>
                <textarea
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border p-3 text-sm focus:border-blue-600 focus:outline-none"
                  placeholder={`Explain the details of this ${reasonAction === "REJECT" ? "rejection" : "suspension"}...`}
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  Reviewer Audit Note (Optional)
                </label>
                <textarea
                  rows={2}
                  className="mt-1.5 w-full rounded-xl border p-3 text-sm focus:border-blue-600 focus:outline-none"
                  placeholder="Record an internal review audit note..."
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <button
                onClick={handleReasonAction}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow ${
                  reasonAction === "REJECT" ? "bg-red-600 hover:bg-red-700" : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                Confirm {reasonAction === "REJECT" ? "Rejection" : "Suspension"}
              </button>
              <button
                onClick={() => setReasonModalOpen(false)}
                className="rounded-xl border px-5 py-2.5 text-sm font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
