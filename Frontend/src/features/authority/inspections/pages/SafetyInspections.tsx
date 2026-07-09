import { useEffect, useState } from "react";
import { useInspectionStore } from "../store/inspectionStore";
import { useBoatVerificationStore } from "../../boats/store/boatStore";
import {
  Plus,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  X,
  ClipboardList,
  CheckSquare,
  Square,
  Info,
} from "lucide-react";

export default function SafetyInspections() {
  const { inspections, loading, error, fetchInspections, createInspection } = useInspectionStore();
  const { boats, fetchBoats } = useBoatVerificationStore();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedBoatId, setSelectedBoatId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [nextInspectionDueDate, setNextInspectionDueDate] = useState("");
  
  // Checklist State
  const [checklist, setChecklist] = useState({
    lifeJacketsAvailable: false,
    fireExtinguisherAvailable: false,
    firstAidKitAvailable: false,
    boatFitnessCondition: false,
    engineCondition: false,
    navigationLight: false,
    overloadingRisk: false,
    emergencyContactVisible: false,
    crewLicenseVerified: false,
    insuranceVerified: false,
    permitVerified: false,
  });

  useEffect(() => {
    fetchInspections();
    fetchBoats("APPROVED"); // Only inspect approved boats
  }, [fetchInspections, fetchBoats]);

  const toggleChecklist = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getCalculatedScore = () => {
    const items = Object.values(checklist);
    const passed = items.filter((v) => v === true).length;
    return Math.round((passed / items.length) * 100);
  };

  const handleCreateInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoatId) {
      alert("Please select a boat to inspect.");
      return;
    }
    if (!nextInspectionDueDate) {
      alert("Please select a next inspection due date.");
      return;
    }

    const score = getCalculatedScore();
    const result = score > 80 ? "PASS" : score > 50 ? "WARNING" : "FAIL";

    const payload = {
      boatId: selectedBoatId,
      checklist,
      result,
      remarks,
      nextInspectionDueDate,
    };

    const ok = await createInspection(payload);
    if (ok) {
      alert(`Safety audit logged! Status: ${result} (Score: ${score}%)`);
      setFormOpen(false);
      fetchInspections();
      // Reset form
      setSelectedBoatId("");
      setRemarks("");
      setNextInspectionDueDate("");
      setChecklist({
        lifeJacketsAvailable: false,
        fireExtinguisherAvailable: false,
        firstAidKitAvailable: false,
        boatFitnessCondition: false,
        engineCondition: false,
        navigationLight: false,
        overloadingRisk: false,
        emergencyContactVisible: false,
        crewLicenseVerified: false,
        insuranceVerified: false,
        permitVerified: false,
      });
    }
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case "PASS":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-bold text-green-700">
            <ShieldCheck size={12} /> Pass
          </span>
        );
      case "WARNING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 border border-yellow-200 px-3 py-1 text-xs font-bold text-yellow-700">
            <Info size={12} /> Warning
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-bold text-red-700">
            <ShieldAlert size={12} /> Fail
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-blue-950">Safety Inspections</h1>
          <p className="text-slate-500">Log routine fitness reviews and monitor safety compliance metrics.</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow shadow-blue-200 transition"
        >
          <Plus size={16} /> Log Safety Audit
        </button>
      </div>

      {/* History List */}
      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-bold text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {loading && inspections.length === 0 ? (
        <div className="py-20 text-center font-bold text-slate-500">Loading safety records...</div>
      ) : inspections.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-slate-100">
          <h2 className="text-2xl font-black text-blue-950">No inspections logged</h2>
          <p className="mt-2 text-slate-500">Execute your first boat safety audit by clicking the button above.</p>
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-black uppercase text-slate-500 tracking-wider">
                  <th className="p-5">Boat Details</th>
                  <th className="p-5">Inspector</th>
                  <th className="p-5">Audit Date</th>
                  <th className="p-5">Safety Score</th>
                  <th className="p-5">Safety Status</th>
                  <th className="p-5">Next Audit Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {inspections.map((ins) => (
                  <tr key={ins._id} className="hover:bg-slate-50/50 transition-colors duration-300">
                    <td className="p-5">
                      <div>
                        <span className="font-black text-blue-950 block">{ins.boatId?.boatName || "Inspected Boat"}</span>
                        <span className="text-xs text-slate-400 font-bold">{ins.boatId?.boatNumber}</span>
                      </div>
                    </td>
                    <td className="p-5 font-bold text-slate-800">{ins.inspectorName}</td>
                    <td className="p-5 text-slate-600 font-semibold">{new Date(ins.createdAt).toLocaleDateString()}</td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <span className={`font-black text-sm ${ins.score > 80 ? "text-green-600" : ins.score > 50 ? "text-yellow-600" : "text-red-500"}`}>
                          {ins.score}%
                        </span>
                      </div>
                    </td>
                    <td className="p-5">{getResultBadge(ins.result)}</td>
                    <td className="p-5 text-slate-600 font-semibold flex items-center gap-1.5 mt-2">
                      <Calendar size={13} className="text-slate-400" />
                      <span>{new Date(ins.nextInspectionDueDate).toLocaleDateString()}</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h3 className="text-2xl font-black text-blue-950 flex items-center gap-2">
                <ClipboardList size={22} className="text-blue-600" /> Log Safety Audit
              </h3>
              <button
                onClick={() => setFormOpen(false)}
                className="rounded-xl p-2 hover:bg-slate-100 text-slate-400"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleCreateInspection} className="space-y-6">
              {/* Select Boat */}
              <div>
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Select Vessel *</label>
                <select
                  className="mt-1.5 w-full rounded-xl border p-3 text-sm focus:border-blue-600 focus:outline-none bg-slate-50 font-bold"
                  value={selectedBoatId}
                  onChange={(e) => setSelectedBoatId(e.target.value)}
                  required
                >
                  <option value="">-- Select Approved Vessel --</option>
                  {boats.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.boatName} ({b.boatNumber}) - {b.ownerId?.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Checklist */}
              <div>
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2 block">
                  Inspection Safety Checklist
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.keys(checklist).map((key) => {
                    const typedKey = key as keyof typeof checklist;
                    const label = key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase());
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => toggleChecklist(typedKey)}
                        className={`flex items-center gap-3 rounded-xl border p-3 text-left transition duration-300 ${
                          checklist[typedKey]
                            ? "border-blue-600 bg-blue-50/50 text-blue-700 font-bold"
                            : "border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold"
                        }`}
                      >
                        {checklist[typedKey] ? (
                          <CheckSquare size={18} className="text-blue-600 shrink-0" />
                        ) : (
                          <Square size={18} className="text-slate-400 shrink-0" />
                        )}
                        <span className="text-xs">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Next due date */}
                <div>
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Next Audit Due Date *</label>
                  <input
                    type="date"
                    className="mt-1.5 w-full rounded-xl border p-3 text-sm focus:border-blue-600 focus:outline-none"
                    value={nextInspectionDueDate}
                    onChange={(e) => setNextInspectionDueDate(e.target.value)}
                    required
                  />
                </div>

                {/* Score Preview */}
                <div>
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Live Safety Score</label>
                  <div className="mt-1.5 flex h-[46px] items-center justify-between rounded-xl border bg-slate-50 px-4">
                    <span className="text-sm font-bold text-slate-600">Calculated Score</span>
                    <span className={`text-lg font-black ${getCalculatedScore() > 80 ? "text-green-600" : getCalculatedScore() > 50 ? "text-yellow-600" : "text-red-500"}`}>
                      {getCalculatedScore()}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Remarks / Action Notes</label>
                <textarea
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border p-3 text-sm focus:border-blue-600 focus:outline-none"
                  placeholder="Record defect reports, maintenance requirements or restrictions..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-sm font-bold shadow"
                >
                  Log Safety Audit
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
    </div>
  );
}
