import { useEffect, useState } from "react";
import { useViolationStore } from "../store/violationStore";
import { useBoatVerificationStore } from "../../boats/store/boatStore";
import { useRouteApprovalStore } from "../../routes/store/routeStore";
import {
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  X,
  ShieldAlert,
} from "lucide-react";

export default function Violations() {
  const {
    violations,
    loading,
    error,
    fetchViolations,
    createViolation,
    updateViolationStatus,
    updateViolationPenalty,
  } = useViolationStore();

  const { boats, fetchBoats } = useBoatVerificationStore();
  const { routes, fetchRoutes } = useRouteApprovalStore();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedBoatId, setSelectedBoatId] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [violationType, setViolationType] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [penaltyAmount, setPenaltyAmount] = useState(0);

  // Resolution Notes Modal
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [activeViolationId, setActiveViolationId] = useState("");

  useEffect(() => {
    fetchViolations();
    fetchBoats("APPROVED");
    fetchRoutes("APPROVED");
  }, [fetchViolations, fetchBoats, fetchRoutes]);

  const handleCreateViolation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!violationType || !description) {
      alert("Please fill in the violation type and description.");
      return;
    }

    const payload = {
      boatId: selectedBoatId || undefined,
      routeId: selectedRouteId || undefined,
      violationType,
      description,
      severity,
      penaltyAmount,
    };

    const ok = await createViolation(payload);
    if (ok) {
      alert("Violation penalty issued and logged!");
      setFormOpen(false);
      // Reset form
      setSelectedBoatId("");
      setSelectedRouteId("");
      setViolationType("");
      setDescription("");
      setSeverity("MEDIUM");
      setPenaltyAmount(0);
      fetchViolations();
    }
  };

  const handleOpenResolve = (id: string) => {
    setActiveViolationId(id);
    setResolutionNotes("");
    setResolveModalOpen(true);
  };

  const handleResolveAction = async () => {
    if (!resolutionNotes.trim()) {
      alert("Please provide resolution notes.");
      return;
    }
    const ok = await updateViolationStatus(activeViolationId, "RESOLVED", resolutionNotes);
    if (ok) {
      alert("Violation resolved successfully!");
      setResolveModalOpen(false);
      fetchViolations();
    }
  };

  const handleMarkPaid = async (id: string) => {
    if (confirm("Mark this violation penalty as paid?")) {
      const ok = await updateViolationPenalty(id, { penaltyPaid: true });
      if (ok) {
        alert("Penalty marked as paid! Status updated to Resolved.");
        fetchViolations();
      }
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "CRITICAL":
        return <span className="rounded-full bg-red-100 border border-red-200 px-2 py-0.5 text-[10px] font-black text-red-700">CRITICAL</span>;
      case "HIGH":
        return <span className="rounded-full bg-orange-100 border border-orange-200 px-2 py-0.5 text-[10px] font-black text-orange-700">HIGH</span>;
      case "MEDIUM":
        return <span className="rounded-full bg-yellow-100 border border-yellow-200 px-2 py-0.5 text-[10px] font-black text-yellow-700">MEDIUM</span>;
      default:
        return <span className="rounded-full bg-blue-100 border border-blue-200 px-2 py-0.5 text-[10px] font-black text-blue-700">LOW</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-2.5 py-1 text-xs font-bold text-green-700">
            <CheckCircle size={12} /> Resolved
          </span>
        );
      case "PENALTY_ISSUED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 border border-orange-200 px-2.5 py-1 text-xs font-bold text-orange-700">
            <DollarSign size={12} /> Fine Pending
          </span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-bold text-blue-700">
            <Clock size={12} /> Under Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-1 text-xs font-bold text-red-700">
            <AlertTriangle size={12} /> Open
          </span>
        );
    }
  };

  const getViolationLabel = (type: string) => {
    return type?.replace(/_/g, " ") || "VIOLATION";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-blue-950">Compliance Violations</h1>
          <p className="text-slate-500">Record rule breaches, verify compliance status, and issue fine penalties.</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow shadow-blue-200 transition"
        >
          <Plus size={16} /> Issue Violation Penalty
        </button>
      </div>

      {/* History table */}
      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-bold text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {loading && violations.length === 0 ? (
        <div className="py-20 text-center font-bold text-slate-500">Loading violations registry...</div>
      ) : violations.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-slate-100">
          <h2 className="text-2xl font-black text-blue-950">Clean compliance sheet</h2>
          <p className="mt-2 text-slate-500">No regulatory violations logged in your city jurisdiction.</p>
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-black uppercase text-slate-500 tracking-wider">
                  <th className="p-5">Violation / Breach Type</th>
                  <th className="p-5">Linked Vessel</th>
                  <th className="p-5">Owner</th>
                  <th className="p-5">Severity</th>
                  <th className="p-5">Penalty Amount</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {violations.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-50/50 transition-colors duration-300">
                    <td className="p-5">
                      <div>
                        <span className="font-black text-blue-950 block">{getViolationLabel(v.violationType)}</span>
                        <span className="text-xs text-slate-400 font-semibold truncate max-w-xs block">{v.description}</span>
                      </div>
                    </td>
                    <td className="p-5 font-bold text-slate-800">{v.boatId?.boatName || "N/A (No Boat Link)"}</td>
                    <td className="p-5">
                      <div>
                        <p className="font-bold text-slate-800">{v.ownerId?.name || "N/A"}</p>
                        <p className="text-xs text-slate-400">{v.ownerId?.phone}</p>
                      </div>
                    </td>
                    <td className="p-5">{getSeverityBadge(v.severity)}</td>
                    <td className="p-5">
                      <div className="flex items-center gap-1.5 font-black text-orange-700">
                        <span>₹{v.penaltyAmount}</span>
                        {v.penaltyAmount > 0 && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${v.penaltyPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {v.penaltyPaid ? "Paid" : "Unpaid"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-5">{getStatusBadge(v.status)}</td>
                    <td className="p-5 text-right space-x-2">
                      {v.status !== "RESOLVED" && v.penaltyAmount > 0 && !v.penaltyPaid && (
                        <button
                          onClick={() => handleMarkPaid(v._id)}
                          className="rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 text-xs font-bold transition duration-300"
                        >
                          Mark Paid
                        </button>
                      )}
                      {v.status !== "RESOLVED" && (
                        <button
                          onClick={() => handleOpenResolve(v._id)}
                          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold transition duration-300 shadow"
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h3 className="text-2xl font-black text-blue-950 flex items-center gap-2">
                <ShieldAlert size={22} className="text-red-600" /> Issue Violation Penalty
              </h3>
              <button
                onClick={() => setFormOpen(false)}
                className="rounded-xl p-2 hover:bg-slate-100 text-slate-400"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleCreateViolation} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Select Boat */}
                <div>
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Link Vessel</label>
                  <select
                    className="mt-1.5 w-full rounded-xl border p-3 text-sm focus:border-blue-600 focus:outline-none bg-slate-50 font-bold"
                    value={selectedBoatId}
                    onChange={(e) => setSelectedBoatId(e.target.value)}
                  >
                    <option value="">-- Optional Boat Link --</option>
                    {boats.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.boatName} ({b.boatNumber})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Route */}
                <div>
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Link Route</label>
                  <select
                    className="mt-1.5 w-full rounded-xl border p-3 text-sm focus:border-blue-600 focus:outline-none bg-slate-50 font-bold"
                    value={selectedRouteId}
                    onChange={(e) => setSelectedRouteId(e.target.value)}
                  >
                    <option value="">-- Optional Route Link --</option>
                    {routes.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.sourceGhatId?.name} → {r.destinationGhatId?.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Violation Type */}
                <div>
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Breach Type *</label>
                  <select
                    className="mt-1.5 w-full rounded-xl border p-3 text-sm focus:border-blue-600 focus:outline-none bg-slate-50 font-bold"
                    value={violationType}
                    onChange={(e) => setViolationType(e.target.value)}
                    required
                  >
                    <option value="">-- Select Type --</option>
                    <option value="OVER_CAPACITY">Over Capacity</option>
                    <option value="INVALID_PERMIT">Invalid Permit</option>
                    <option value="UNSAFE_OPERATION">Unsafe Operation</option>
                    <option value="ROUTE_VIOLATION">Route Violation</option>
                    <option value="NIGHT_OPERATION_WITHOUT_PERMISSION">Night Operation Violation</option>
                    <option value="DOCUMENT_EXPIRED">Document Expired</option>
                    <option value="STAFF_LICENSE_INVALID">Invalid Staff License</option>
                    <option value="CUSTOMER_COMPLAINT">Customer Complaint</option>
                    <option value="EMERGENCY_RULE_BREACH">Emergency Rule Breach</option>
                  </select>
                </div>

                {/* Severity */}
                <div>
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Severity Grade *</label>
                  <select
                    className="mt-1.5 w-full rounded-xl border p-3 text-sm focus:border-blue-600 focus:outline-none bg-slate-50 font-bold"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    required
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              {/* Penalty Amount */}
              <div>
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Penalty Fine (INR)</label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-3.5 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-xl border py-3 pl-8 pr-3 text-sm focus:border-blue-600 focus:outline-none font-bold text-orange-700"
                    value={penaltyAmount}
                    onChange={(e) => setPenaltyAmount(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Description / Safety Report *</label>
                <textarea
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border p-3 text-sm focus:border-blue-600 focus:outline-none"
                  placeholder="Elaborate on the violation details, observed breach context..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="submit"
                  className="rounded-xl bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 text-sm font-bold shadow"
                >
                  Issue Fine & Alert Owner
                </button>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="rounded-xl border px-6 py-2.5 text-sm font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolution Notes Modal */}
      {resolveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-black text-blue-950">Resolve Safety Violation</h3>
              <button
                onClick={() => setResolveModalOpen(false)}
                className="rounded-xl p-2 hover:bg-slate-100 text-slate-400"
              >
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Resolution Audit Notes *</label>
                <textarea
                  rows={4}
                  className="mt-1.5 w-full rounded-xl border p-3 text-sm focus:border-blue-600 focus:outline-none"
                  placeholder="Describe how the vessel resolved this safety/licensing violation..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <button
                onClick={handleResolveAction}
                className="rounded-xl bg-green-600 hover:bg-green-700 px-5 py-2.5 text-sm font-bold text-white shadow"
              >
                Resolve Violation
              </button>
              <button
                onClick={() => setResolveModalOpen(false)}
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
