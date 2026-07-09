import { useEffect, useState } from "react";
import { useComplaintStore } from "../store/complaintStore";
import { useViolationStore } from "../../violations/store/violationStore";
import {
  MessageSquare,
  CheckCircle,
  Clock,
  Eye,
  X,
  AlertTriangle,
  Info,
  Link,
} from "lucide-react";

export default function Complaints() {
  const {
    complaints,
    loading,
    error,
    fetchComplaints,
    updateComplaintStatus,
    updateComplaintNote,
  } = useComplaintStore();

  const { violations, fetchViolations } = useViolationStore();

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [authorityNote, setAuthorityNote] = useState("");
  const [linkedViolationId, setLinkedViolationId] = useState("");

  useEffect(() => {
    fetchComplaints();
    fetchViolations();
  }, [fetchComplaints, fetchViolations]);

  const handleOpenDetail = (comp: any) => {
    setSelectedComplaint(comp);
    setAuthorityNote(comp.authorityNote || "");
    setLinkedViolationId(comp.linkedViolationId || "");
    setDetailModalOpen(true);
  };

  const handleStatusChange = async (id: string, status: string) => {
    const ok = await updateComplaintStatus(id, status, authorityNote || undefined);
    if (ok) {
      alert(`Complaint status updated to ${status}!`);
      setDetailModalOpen(false);
      fetchComplaints();
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedComplaint) return;
    const ok = await updateComplaintNote(selectedComplaint._id, {
      authorityNote,
      linkedViolationId: linkedViolationId || null,
    });
    if (ok) {
      alert("Authority audit logs updated!");
      setDetailModalOpen(false);
      fetchComplaints();
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
      case "IN_REVIEW":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-bold text-blue-700">
            <Clock size={12} /> In Review
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-600">
            <X size={12} /> Rejected
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

  const getComplaintTypeLabel = (type: string) => {
    return type?.replace(/_/g, " ") || "COMPLAINT";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-blue-950">Citizen Complaints</h1>
        <p className="text-slate-500">Monitor passenger feedback, investigate safety issues, and log resolutions.</p>
      </div>

      {/* Complaints table */}
      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-bold text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {loading && complaints.length === 0 ? (
        <div className="py-20 text-center font-bold text-slate-500">Loading complaints registry...</div>
      ) : complaints.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-slate-100">
          <h2 className="text-2xl font-black text-blue-950">No complaints reported</h2>
          <p className="mt-2 text-slate-500">Your city's passengers have reported no compliance/safety complaints.</p>
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-black uppercase text-slate-500 tracking-wider">
                  <th className="p-5">Complaint Category</th>
                  <th className="p-5">Linked Vessel</th>
                  <th className="p-5">Passenger Detail</th>
                  <th className="p-5">Report Date</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {complaints.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/50 transition-colors duration-300">
                    <td className="p-5">
                      <div>
                        <span className="font-black text-blue-950 block">{getComplaintTypeLabel(c.complaintType)}</span>
                        <span className="text-xs text-slate-400 font-semibold truncate max-w-xs block">{c.description}</span>
                      </div>
                    </td>
                    <td className="p-5 font-bold text-slate-800">{c.boatId?.boatName || "N/A (General)"}</td>
                    <td className="p-5">
                      <div>
                        <p className="font-bold text-slate-800">{c.name}</p>
                        <p className="text-xs text-slate-400">{c.phone}</p>
                      </div>
                    </td>
                    <td className="p-5 text-slate-600 font-semibold">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="p-5">{getStatusBadge(c.status)}</td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => handleOpenDetail(c)}
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
      {detailModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div>
                <h3 className="text-2xl font-black text-blue-950 flex items-center gap-2">
                  <MessageSquare className="text-blue-600" size={24} /> Complaint Review
                </h3>
                <span className="text-xs font-bold text-slate-400">Category: {getComplaintTypeLabel(selectedComplaint.complaintType)}</span>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="rounded-xl p-2 hover:bg-slate-100 text-slate-400"
              >
                <X />
              </button>
            </div>

            <div className="space-y-5">
              {/* Passenger Info & Vessel Link */}
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="rounded-2xl border p-4 space-y-2 bg-slate-50/50">
                  <h4 className="font-black text-blue-950 uppercase tracking-wider text-[10px]">Passenger details</h4>
                  <p><b>Name:</b> {selectedComplaint.name}</p>
                  <p><b>Phone:</b> {selectedComplaint.phone}</p>
                  <p><b>Registered User:</b> {selectedComplaint.customerId ? "Yes" : "Guest Passenger"}</p>
                </div>

                <div className="rounded-2xl border p-4 space-y-2 bg-slate-50/50">
                  <h4 className="font-black text-blue-950 uppercase tracking-wider text-[10px]">Vessel Link</h4>
                  <p><b>Boat Name:</b> {selectedComplaint.boatId?.boatName || "N/A"}</p>
                  <p><b>Registry Number:</b> {selectedComplaint.boatId?.boatNumber || "N/A"}</p>
                  <p><b>Route Path:</b> {selectedComplaint.routeId ? "Linked Route Channel" : "N/A"}</p>
                </div>
              </div>

              {/* Description */}
              <div className="rounded-2xl border p-4 space-y-2">
                <h4 className="font-black text-blue-950 uppercase tracking-wider text-xs flex items-center gap-1">
                  <Info size={14} /> Passenger Statement
                </h4>
                <p className="text-xs font-semibold text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border">
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Link to formal Violation */}
              <div>
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1 mb-1.5">
                  <Link size={14} /> Link to Compliance Violation (Optional)
                </label>
                <select
                  className="w-full rounded-xl border p-3 text-xs focus:border-blue-600 focus:outline-none bg-slate-50 font-bold"
                  value={linkedViolationId}
                  onChange={(e) => setLinkedViolationId(e.target.value)}
                >
                  <option value="">-- No Violation Link --</option>
                  {violations.map((v) => (
                    <option key={v._id} value={v._id}>
                      [{v.severity}] {v.violationType?.replace(/_/g, " ")} - {v.description.substring(0, 40)}...
                    </option>
                  ))}
                </select>
              </div>

              {/* Authority Note */}
              <div>
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider block mb-1.5">
                  Authority Resolution Note
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl border p-3 text-xs focus:border-blue-600 focus:outline-none"
                  placeholder="Record verification findings, action taken or citizen notifications..."
                  value={authorityNote}
                  onChange={(e) => setAuthorityNote(e.target.value)}
                />
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-6 flex flex-wrap gap-3 justify-end border-t pt-4">
              {selectedComplaint.status === "OPEN" && (
                <button
                  onClick={() => handleStatusChange(selectedComplaint._id, "IN_REVIEW")}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-bold shadow"
                >
                  Mark In Review
                </button>
              )}
              {selectedComplaint.status !== "RESOLVED" && (
                <button
                  onClick={() => handleStatusChange(selectedComplaint._id, "RESOLVED")}
                  className="rounded-xl bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 text-sm font-bold shadow"
                >
                  Resolve Complaint
                </button>
              )}
              {selectedComplaint.status !== "REJECTED" && (
                <button
                  onClick={() => handleStatusChange(selectedComplaint._id, "REJECTED")}
                  className="rounded-xl bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 text-sm font-bold shadow"
                >
                  Reject Feedback
                </button>
              )}
              <button
                onClick={handleSaveNotes}
                className="rounded-xl border border-slate-200 hover:bg-slate-50 px-5 py-2.5 text-sm font-bold"
              >
                Save Audit Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
