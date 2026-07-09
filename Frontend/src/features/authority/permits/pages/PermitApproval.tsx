import { useEffect, useState } from "react";
import { usePermitApprovalStore } from "../store/permitStore";
import {
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Info,
  Calendar,
  X,
  FileCheck,
  Download,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function PermitApproval() {
  const {
    permits,
    selectedPermit,
    loading,
    error,
    fetchPermits,
    fetchPermitById,
    approvePermit,
    rejectPermit,
    suspendPermit,
    markRenewalRequired,
  } = usePermitApprovalStore();

  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Approval modal variables
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [validFrom, setValidFrom] = useState("");
  const [validTill, setValidTill] = useState("");
  const [reviewNote, setReviewNote] = useState("");

  // Rejection/suspension reason modal
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [reasonAction, setReasonAction] = useState<"REJECT" | "SUSPEND">("REJECT");
  const [actionReason, setActionReason] = useState("");

  useEffect(() => {
    fetchPermits(statusFilter || undefined, typeFilter || undefined);
  }, [fetchPermits, statusFilter, typeFilter]);

  const handleOpenDetail = (id: string) => {
    fetchPermitById(id);
    setDetailModalOpen(true);
  };

  const handleOpenApprove = () => {
    // Default valid dates (today to 1 year later)
    const today = new Date().toISOString().split("T")[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const nextYearStr = nextYear.toISOString().split("T")[0];

    setValidFrom(today);
    setValidTill(nextYearStr);
    setReviewNote("");
    setApproveModalOpen(true);
  };

  const handleApproveAction = async () => {
    if (!selectedPermit) return;
    if (!validFrom || !validTill) {
      alert("Please specify validity dates.");
      return;
    }

    const ok = await approvePermit(selectedPermit._id, {
      validFrom,
      validTill,
      reviewNote,
    });

    if (ok) {
      alert("Permit approved successfully!");
      setApproveModalOpen(false);
      setDetailModalOpen(false);
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
    if (!selectedPermit) return;

    let success = false;
    if (reasonAction === "REJECT") {
      success = await rejectPermit(selectedPermit._id, actionReason, reviewNote);
    } else {
      success = await suspendPermit(selectedPermit._id, actionReason, reviewNote);
    }

    if (success) {
      alert(`Permit ${reasonAction === "REJECT" ? "rejected" : "suspended"} successfully!`);
      setReasonModalOpen(false);
      setDetailModalOpen(false);
    }
  };

  const handleFlagRenewal = async (id: string) => {
    if (confirm("Flag this permit as requiring renewal? This will notify the boat owner.")) {
      const ok = await markRenewalRequired(id, "Renewal flagged by authority check");
      if (ok) {
        alert("Permit flagged for renewal.");
        setDetailModalOpen(false);
      }
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
      case "EXPIRED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-300 px-3 py-1 text-xs font-bold text-slate-600">
            <AlertCircle size={12} />
            Expired
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-bold text-orange-700">
            <AlertTriangle size={12} />
            Suspended
          </span>
        );
      case "RENEWAL_REQUIRED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700 animate-pulse">
            <RefreshCw size={12} />
            Renewal Required
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 border border-yellow-200 px-3 py-1 text-xs font-bold text-yellow-700">
            <Info size={12} />
            Pending Review
          </span>
        );
    }
  };

  const getPermitTypeLabel = (type: string) => {
    return type?.replace(/_/g, " ") || "BOAT PERMIT";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-blue-950">Permit Approval Requests</h1>
        <p className="text-slate-500">Supervise, inspect, and approve licensing requests for river operations.</p>
      </div>

      {/* Filters */}
      <div className="rounded-3xl bg-white border border-slate-100 p-5 shadow-sm flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1 flex items-center gap-3">
          <span className="text-sm font-bold text-slate-500 flex items-center gap-1">
            <Filter size={16} /> Permit Type:
          </span>
          <select
            className="rounded-2xl border px-4 py-2.5 text-sm font-bold text-slate-700 outline-none bg-slate-50 cursor-pointer focus:border-blue-600"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Permit Types</option>
            <option value="BOAT_PERMIT">Boat Permit</option>
            <option value="ROUTE_PERMIT">Route Permit</option>
            <option value="FESTIVAL_PERMIT">Festival Permit</option>
            <option value="TEMPORARY_PERMIT">Temporary Permit</option>
            <option value="NIGHT_OPERATION_PERMIT">Night Operation Permit</option>
            <option value="SAFETY_CLEARANCE">Safety Clearance</option>
          </select>
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
            <option value="EXPIRED">Expired</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="RENEWAL_REQUIRED">Renewal Required</option>
          </select>
        </div>
      </div>

      {/* Permits list */}
      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-bold text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {loading && permits.length === 0 ? (
        <div className="py-20 text-center font-bold text-slate-500">Loading permit queries...</div>
      ) : permits.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-slate-100">
          <h2 className="text-2xl font-black text-blue-950">No permit requests</h2>
          <p className="mt-2 text-slate-500">No matching permit applications found in your city.</p>
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-black uppercase text-slate-500 tracking-wider">
                  <th className="p-5">Permit Code / Type</th>
                  <th className="p-5">Vessel Name</th>
                  <th className="p-5">Owner</th>
                  <th className="p-5">Valid Period</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {permits.map((permit) => (
                  <tr key={permit._id} className="hover:bg-slate-50/50 transition-colors duration-300">
                    <td className="p-5">
                      <div>
                        <span className="font-black text-blue-950 block">{permit.permitNumber}</span>
                        <span className="text-[11px] font-black uppercase text-blue-600 tracking-wide">
                          {getPermitTypeLabel(permit.permitType)}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 font-bold text-slate-800">{permit.boatId?.boatName || "Unknown Vessel"}</td>
                    <td className="p-5">
                      <div>
                        <p className="font-bold text-slate-800">{permit.ownerId?.name || "N/A"}</p>
                        <p className="text-xs text-slate-400">{permit.ownerId?.phone}</p>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                        <Calendar size={13} />
                        <span>
                          {new Date(permit.validFrom).toLocaleDateString()} - {new Date(permit.validTill).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="p-5">{getStatusBadge(permit.status)}</td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => handleOpenDetail(permit._id)}
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
      {detailModalOpen && selectedPermit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div>
                <h3 className="text-2xl font-black text-blue-950">Permit Approval Review</h3>
                <span className="text-sm font-bold text-slate-400">Application Code: {selectedPermit.permitNumber}</span>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="rounded-xl p-2 hover:bg-slate-100 text-slate-400"
              >
                <X />
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-100 p-4 space-y-3 bg-slate-50/50">
                  <h4 className="font-black text-blue-950 text-xs uppercase tracking-wider">Application Summary</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Permit Type</span>
                      <span className="font-bold text-blue-700 uppercase">{getPermitTypeLabel(selectedPermit.permitType)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Vessel Name</span>
                      <span className="font-bold text-slate-800">{selectedPermit.boatId?.boatName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Vessel Registry</span>
                      <span className="font-bold text-slate-800">{selectedPermit.boatId?.boatNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Vessel Capacity</span>
                      <span className="font-bold text-slate-800">{selectedPermit.boatId?.capacity || "N/A"} Seats</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 p-4 space-y-3">
                  <h4 className="font-black text-blue-950 text-xs uppercase tracking-wider">Owner Details</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Owner Name</span>
                      <span className="font-bold text-slate-800">{selectedPermit.ownerId?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phone</span>
                      <span className="font-bold text-slate-800">{selectedPermit.ownerId?.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Email</span>
                      <span className="font-bold text-slate-800 truncate">{selectedPermit.ownerId?.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-100 p-4 space-y-3 bg-slate-50/50">
                  <h4 className="font-black text-blue-950 text-xs uppercase tracking-wider">Uploaded Documents</h4>
                  {selectedPermit.documentUrl ? (
                    <div className="flex items-center justify-between rounded-xl border bg-white p-3">
                      <div className="flex items-center gap-2">
                        <FileCheck className="text-blue-600" size={20} />
                        <div>
                          <p className="text-xs font-bold text-slate-700">Permit_Doc.pdf</p>
                          <p className="text-[10px] text-slate-400">Review official permit proof</p>
                        </div>
                      </div>
                      <a
                        href={selectedPermit.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-blue-50 hover:bg-blue-100 p-2 text-blue-600"
                        title="Download Document"
                      >
                        <Download size={14} />
                      </a>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No document uploaded.</p>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-100 p-4 space-y-2 text-xs">
                  <h4 className="font-black text-blue-950 text-xs uppercase tracking-wider">Validation History</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status</span>
                      <span>{getStatusBadge(selectedPermit.status)}</span>
                    </div>
                    {selectedPermit.remarks && (
                      <div className="rounded-lg bg-slate-50 border p-2 text-slate-500 font-semibold">
                        <b>Applicant Remarks:</b> {selectedPermit.remarks}
                      </div>
                    )}
                    {selectedPermit.reviewNote && (
                      <div className="rounded-lg bg-blue-50 border border-blue-100 p-2 text-blue-600 font-semibold">
                        <b>Audit Note:</b> {selectedPermit.reviewNote}
                      </div>
                    )}
                    {selectedPermit.rejectionReason && (
                      <div className="rounded-lg bg-red-50 border border-red-100 p-2 text-red-700 font-semibold">
                        <b>Rejection Reason:</b> {selectedPermit.rejectionReason}
                      </div>
                    )}
                    {selectedPermit.suspendedReason && (
                      <div className="rounded-lg bg-orange-50 border border-orange-100 p-2 text-orange-700 font-semibold">
                        <b>Suspended Reason:</b> {selectedPermit.suspendedReason}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-6 flex flex-wrap gap-3 justify-end border-t pt-4">
              {selectedPermit.status !== "APPROVED" && (
                <button
                  onClick={handleOpenApprove}
                  className="rounded-xl bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 text-sm font-bold shadow"
                >
                  Approve Application
                </button>
              )}
              {selectedPermit.status !== "REJECTED" && (
                <button
                  onClick={() => handleOpenReasonModal("REJECT")}
                  className="rounded-xl bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 text-sm font-bold shadow"
                >
                  Reject Request
                </button>
              )}
              {selectedPermit.status === "APPROVED" && (
                <>
                  <button
                    onClick={() => handleOpenReasonModal("SUSPEND")}
                    className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 text-sm font-bold shadow"
                  >
                    Suspend Permit
                  </button>

                  <button
                    onClick={() => handleFlagRenewal(selectedPermit._id)}
                    className="rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 px-5 py-2.5 text-sm font-bold shadow"
                  >
                    Flag Renewal Required
                  </button>
                </>
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

      {/* Approval Settings Modal */}
      {approveModalOpen && selectedPermit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-black text-blue-950">Approve Permit Request</h3>
              <button
                onClick={() => setApproveModalOpen(false)}
                className="rounded-xl p-2 hover:bg-slate-100 text-slate-400"
              >
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Valid From</label>
                <input
                  type="date"
                  className="mt-1.5 w-full rounded-xl border p-3 text-sm focus:border-blue-600 focus:outline-none"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Valid Till</label>
                <input
                  type="date"
                  className="mt-1.5 w-full rounded-xl border p-3 text-sm focus:border-blue-600 focus:outline-none"
                  value={validTill}
                  onChange={(e) => setValidTill(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  Reviewer Audit Note (Optional)
                </label>
                <textarea
                  rows={2}
                  className="mt-1.5 w-full rounded-xl border p-3 text-sm focus:border-blue-600 focus:outline-none"
                  placeholder="Record verification checklist confirmation..."
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <button
                onClick={handleApproveAction}
                className="rounded-xl bg-green-600 hover:bg-green-700 px-5 py-2.5 text-sm font-bold text-white shadow"
              >
                Approve & Sign Permit
              </button>
              <button
                onClick={() => setApproveModalOpen(false)}
                className="rounded-xl border px-5 py-2.5 text-sm font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reason Dialog Modal */}
      {reasonModalOpen && selectedPermit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-black text-blue-950">
                {reasonAction === "REJECT" ? "Reject Permit Request" : "Suspend Permit"}
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
                  placeholder={`Reason for ${reasonAction === "REJECT" ? "rejection" : "suspension"}...`}
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
