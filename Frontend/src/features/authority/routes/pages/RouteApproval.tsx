import { useEffect, useState } from "react";
import { useRouteApprovalStore } from "../store/routeStore";
import {
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Info,
  X,
  Compass,
  DollarSign,
  ClipboardList,
} from "lucide-react";

export default function RouteApproval() {
  const {
    routes,
    selectedRoute,
    loading,
    error,
    fetchRoutes,
    fetchRouteById,
    approveRoute,
    rejectRoute,
    suspendRoute,
  } = useRouteApprovalStore();

  const [statusFilter, setStatusFilter] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Approval inputs
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approvalNote, setApprovalNote] = useState("");
  const [safetyNote, setSafetyNote] = useState("");

  // Rejection/suspension reason
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [reasonAction, setReasonAction] = useState<"REJECT" | "SUSPEND">("REJECT");
  const [actionReason, setActionReason] = useState("");

  useEffect(() => {
    fetchRoutes(statusFilter || undefined);
  }, [fetchRoutes, statusFilter]);

  const handleOpenDetail = (id: string) => {
    fetchRouteById(id);
    setDetailModalOpen(true);
  };

  const handleOpenApprove = () => {
    setApprovalNote("");
    setSafetyNote("");
    setApproveModalOpen(true);
  };

  const handleApproveAction = async () => {
    if (!selectedRoute) return;
    const ok = await approveRoute(selectedRoute._id, {
      approvalNote,
      safetyNote,
    });

    if (ok) {
      alert("Route approved successfully!");
      setApproveModalOpen(false);
      setDetailModalOpen(false);
    }
  };

  const handleOpenReasonModal = (action: "REJECT" | "SUSPEND") => {
    setReasonAction(action);
    setActionReason("");
    setApprovalNote("");
    setReasonModalOpen(true);
  };

  const handleReasonAction = async () => {
    if (!actionReason.trim()) {
      alert("Please provide a reason.");
      return;
    }
    if (!selectedRoute) return;

    let success = false;
    if (reasonAction === "REJECT") {
      success = await rejectRoute(selectedRoute._id, actionReason, approvalNote);
    } else {
      success = await suspendRoute(selectedRoute._id, actionReason, approvalNote);
    }

    if (success) {
      alert(`Route ${reasonAction === "REJECT" ? "rejected" : "suspended"} successfully!`);
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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 border border-yellow-200 px-3 py-1 text-xs font-bold text-yellow-700">
            <Info size={12} />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-blue-950">Route Approvals</h1>
        <p className="text-slate-500">Supervise, inspect safety audits, and review base fares for river transit channels.</p>
      </div>

      {/* Filters */}
      <div className="rounded-3xl bg-white border border-slate-100 p-5 shadow-sm flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-500 flex items-center gap-1">
            <Filter size={16} /> Filter Approval Status:
          </span>
          <select
            className="rounded-2xl border px-4 py-2.5 text-sm font-bold text-slate-700 outline-none bg-slate-50 cursor-pointer focus:border-blue-600"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Routes</option>
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Approved Channels</option>
            <option value="REJECTED">Rejected Channels</option>
            <option value="SUSPENDED">Suspended Channels</option>
          </select>
        </div>
      </div>

      {/* Routes table */}
      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-bold text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {loading && routes.length === 0 ? (
        <div className="py-20 text-center font-bold text-slate-500">Loading routes registry...</div>
      ) : routes.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-slate-100">
          <h2 className="text-2xl font-black text-blue-950">No routes registered</h2>
          <p className="mt-2 text-slate-500">No route channels match the filter constraints.</p>
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-black uppercase text-slate-500 tracking-wider">
                  <th className="p-5">Transit Channels (Ghats)</th>
                  <th className="p-5">Distance</th>
                  <th className="p-5">Duration</th>
                  <th className="p-5">Base Tariff</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {routes.map((route) => (
                  <tr key={route._id} className="hover:bg-slate-50/50 transition-colors duration-300">
                    <td className="p-5">
                      <div>
                        <span className="font-black text-blue-950 block">
                          {route.sourceGhatId?.name || "Ghat A"} → {route.destinationGhatId?.name || "Ghat B"}
                        </span>
                        <span className="text-xs text-slate-400 font-bold uppercase">{route.cityId?.name}</span>
                      </div>
                    </td>
                    <td className="p-5 font-bold text-slate-800">{route.distanceKm} km</td>
                    <td className="p-5 font-bold text-slate-800">{route.estimatedDurationMinutes} mins</td>
                    <td className="p-5">
                      <span className="font-black text-green-700">₹{route.baseFare}</span>
                    </td>
                    <td className="p-5">{getStatusBadge(route.approvalStatus)}</td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => handleOpenDetail(route._id)}
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

      {/* Route Details Modal */}
      {detailModalOpen && selectedRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div>
                <h3 className="text-2xl font-black text-blue-950">Route Channel Details</h3>
                <p className="text-sm font-bold text-slate-400">Jurisdiction: {selectedRoute.cityId?.name}</p>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="rounded-xl p-2 hover:bg-slate-100 text-slate-400"
              >
                <X />
              </button>
            </div>

            <div className="space-y-6">
              {/* Route Path Info */}
              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5 flex items-center gap-4">
                <div className="rounded-xl bg-blue-600 p-3 text-white">
                  <Compass size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-blue-950">
                    {selectedRoute.sourceGhatId?.name} to {selectedRoute.destinationGhatId?.name}
                  </h4>
                  <p className="text-xs font-semibold text-blue-700">
                    Calculated Distance: {selectedRoute.distanceKm} km | Estimated Duration: {selectedRoute.estimatedDurationMinutes} minutes
                  </p>
                </div>
              </div>

              {/* Fares Matrix */}
              <div className="rounded-2xl border border-slate-100 p-5 space-y-3">
                <h4 className="font-black text-blue-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign size={16} /> Fare Tariffs Matrix
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="border-b pb-2">
                    <p className="text-slate-400">Base Fare</p>
                    <p className="text-sm font-black text-green-700">₹{selectedRoute.baseFare}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-slate-400">Night Fare</p>
                    <p className="text-sm font-black text-slate-700">₹{selectedRoute.nightFare || 0}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-slate-400">Weekend Fare</p>
                    <p className="text-sm font-black text-slate-700">₹{selectedRoute.weekendFare || 0}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-slate-400">Festival Fare</p>
                    <p className="text-sm font-black text-slate-700">₹{selectedRoute.festivalFare || 0}</p>
                  </div>
                </div>
              </div>

              {/* Safety Logs and Notes */}
              <div className="rounded-2xl border border-slate-100 p-5 space-y-2 text-xs">
                <h4 className="font-black text-blue-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardList size={16} /> Audit & Inspection Notes
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Approval status</span>
                    <span>{getStatusBadge(selectedRoute.approvalStatus)}</span>
                  </div>

                  {selectedRoute.safetyNote && (
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-slate-600 font-semibold">
                      <b>Safety Note:</b> {selectedRoute.safetyNote}
                    </div>
                  )}

                  {selectedRoute.approvalNote && (
                    <div className="rounded-xl bg-blue-50/50 p-3 border border-blue-100 text-blue-700 font-semibold">
                      <b>Approval Note:</b> {selectedRoute.approvalNote}
                    </div>
                  )}

                  {selectedRoute.rejectionReason && (
                    <div className="rounded-xl bg-red-50 p-3 border border-red-100 text-red-700 font-semibold">
                      <b>Rejection Reason:</b> {selectedRoute.rejectionReason}
                    </div>
                  )}

                  {selectedRoute.suspendedReason && (
                    <div className="rounded-xl bg-orange-50 p-3 border border-orange-100 text-orange-700 font-semibold">
                      <b>Suspended Reason:</b> {selectedRoute.suspendedReason}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-6 flex flex-wrap gap-3 justify-end border-t pt-4">
              {selectedRoute.approvalStatus !== "APPROVED" && (
                <button
                  onClick={handleOpenApprove}
                  className="rounded-xl bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 text-sm font-bold shadow"
                >
                  Approve Channel
                </button>
              )}
              {selectedRoute.approvalStatus !== "REJECTED" && (
                <button
                  onClick={() => handleOpenReasonModal("REJECT")}
                  className="rounded-xl bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 text-sm font-bold shadow"
                >
                  Reject Channel
                </button>
              )}
              {selectedRoute.approvalStatus === "APPROVED" && (
                <button
                  onClick={() => handleOpenReasonModal("SUSPEND")}
                  className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 text-sm font-bold shadow"
                >
                  Suspend Channel
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

      {/* Approval Parameters Modal */}
      {approveModalOpen && selectedRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-black text-blue-950">Approve Route Channel</h3>
              <button
                onClick={() => setApproveModalOpen(false)}
                className="rounded-xl p-2 hover:bg-slate-100 text-slate-400"
              >
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Safety & Operation Note</label>
                <textarea
                  rows={2}
                  className="mt-1.5 w-full rounded-xl border p-3 text-sm focus:border-blue-600 focus:outline-none"
                  placeholder="Record mandatory safety speeds, visibility limits or alerts..."
                  value={safetyNote}
                  onChange={(e) => setSafetyNote(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  Reviewer Audit Note (Optional)
                </label>
                <textarea
                  rows={2}
                  className="mt-1.5 w-full rounded-xl border p-3 text-sm focus:border-blue-600 focus:outline-none"
                  placeholder="Record channel approval confirmation details..."
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <button
                onClick={handleApproveAction}
                className="rounded-xl bg-green-600 hover:bg-green-700 px-5 py-2.5 text-sm font-bold text-white shadow"
              >
                Approve & Enable Channel
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
      {reasonModalOpen && selectedRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-black text-blue-950">
                {reasonAction === "REJECT" ? "Reject Route Application" : "Suspend Channel"}
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
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
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
