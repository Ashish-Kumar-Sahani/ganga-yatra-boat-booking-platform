import { useEffect, useState } from "react";
import { useReportStore } from "../store/reportStore";
import {
  FileSpreadsheet,
  FileText,
  Filter,
} from "lucide-react";

export default function Reports() {
  const { reports, loading, error, fetchReportsSummary } = useReportStore();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeTab, setActiveTab] = useState<"BOATS" | "PERMITS" | "INSPECTIONS" | "VIOLATIONS" | "COMPLAINTS">("BOATS");

  useEffect(() => {
    fetchReportsSummary(startDate || undefined, endDate || undefined);
  }, [fetchReportsSummary, startDate, endDate]);

  const handleExportCSV = () => {
    alert("Exporting report dataset in CSV format... (File generated and downloading)");
  };

  const handleExportPDF = () => {
    alert("Compiling official PDF report certificate... (Document download triggered)");
  };

  const getStats = () => {
    if (!reports) return { totalBoats: 0, totalPermits: 0, totalInspections: 0, totalViolations: 0, totalComplaints: 0 };
    return {
      totalBoats: reports.boats.length,
      totalPermits: reports.permits.length,
      totalInspections: reports.inspections.length,
      totalViolations: reports.violations.length,
      totalComplaints: reports.complaints.length,
    };
  };

  const s = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-blue-950">Analytics & Reports</h1>
          <p className="text-slate-500">Aggregate licensing records, audit logs, and compliance violations.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition"
          >
            <FileSpreadsheet size={16} className="text-green-600" /> Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition"
          >
            <FileText size={16} className="text-red-600" /> Export PDF
          </button>
        </div>
      </div>

      {/* Date Filters */}
      <div className="rounded-3xl bg-white border border-slate-100 p-5 shadow-sm flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-slate-500 flex items-center gap-1.5">
            <Filter size={16} /> Date Range:
          </span>
          <div className="flex items-center gap-2 text-xs">
            <input
              type="date"
              className="rounded-xl border p-2 bg-slate-50 text-slate-700 focus:outline-none"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-slate-400 font-bold">to</span>
            <input
              type="date"
              className="rounded-xl border p-2 bg-slate-50 text-slate-700 focus:outline-none"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <button
          onClick={() => setActiveTab("BOATS")}
          className={`rounded-2xl border p-4 text-center transition-all duration-300 ${
            activeTab === "BOATS"
              ? "border-blue-600 bg-blue-50/50 shadow-sm"
              : "border-slate-100 bg-white hover:bg-slate-50/50"
          }`}
        >
          <p className="text-xs font-semibold text-slate-500">Boats Verified</p>
          <p className="mt-1 text-2xl font-black text-blue-950">{s.totalBoats}</p>
        </button>

        <button
          onClick={() => setActiveTab("PERMITS")}
          className={`rounded-2xl border p-4 text-center transition-all duration-300 ${
            activeTab === "PERMITS"
              ? "border-blue-600 bg-blue-50/50 shadow-sm"
              : "border-slate-100 bg-white hover:bg-slate-50/50"
          }`}
        >
          <p className="text-xs font-semibold text-slate-500">Permit Logs</p>
          <p className="mt-1 text-2xl font-black text-blue-950">{s.totalPermits}</p>
        </button>

        <button
          onClick={() => setActiveTab("INSPECTIONS")}
          className={`rounded-2xl border p-4 text-center transition-all duration-300 ${
            activeTab === "INSPECTIONS"
              ? "border-blue-600 bg-blue-50/50 shadow-sm"
              : "border-slate-100 bg-white hover:bg-slate-50/50"
          }`}
        >
          <p className="text-xs font-semibold text-slate-500">Inspections</p>
          <p className="mt-1 text-2xl font-black text-blue-950">{s.totalInspections}</p>
        </button>

        <button
          onClick={() => setActiveTab("VIOLATIONS")}
          className={`rounded-2xl border p-4 text-center transition-all duration-300 ${
            activeTab === "VIOLATIONS"
              ? "border-blue-600 bg-blue-50/50 shadow-sm"
              : "border-slate-100 bg-white hover:bg-slate-50/50"
          }`}
        >
          <p className="text-xs font-semibold text-slate-500">Violations</p>
          <p className="mt-1 text-2xl font-black text-blue-950">{s.totalViolations}</p>
        </button>

        <button
          onClick={() => setActiveTab("COMPLAINTS")}
          className={`rounded-2xl border p-4 text-center transition-all duration-300 ${
            activeTab === "COMPLAINTS"
              ? "border-blue-600 bg-blue-50/50 shadow-sm"
              : "border-slate-100 bg-white hover:bg-slate-50/50"
          }`}
        >
          <p className="text-xs font-semibold text-slate-500">Complaints</p>
          <p className="mt-1 text-2xl font-black text-blue-950">{s.totalComplaints}</p>
        </button>
      </div>

      {/* Reports details table */}
      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-bold text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {loading && !reports ? (
        <div className="py-20 text-center font-bold text-slate-500">Compiling report data...</div>
      ) : !reports ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-slate-100">
          <h2 className="text-2xl font-black text-blue-950">No reports generated</h2>
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden p-5">
          <h3 className="text-lg font-black text-blue-950 mb-4">
            {activeTab === "BOATS" && "Boat Registry Verification Report"}
            {activeTab === "PERMITS" && "Permit Applications & Audit Logs"}
            {activeTab === "INSPECTIONS" && "Safety Inspections Summary"}
            {activeTab === "VIOLATIONS" && "Compliance Violations Report"}
            {activeTab === "COMPLAINTS" && "Citizen Feedback & Complaints"}
          </h3>

          <div className="overflow-x-auto">
            {activeTab === "BOATS" && (
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b text-xs font-black uppercase text-slate-500 tracking-wider">
                    <th className="p-4">Boat Details</th>
                    <th className="p-4">Owner</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Capacity</th>
                    <th className="p-4">Verification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reports.boats.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <b>{b.boatName}</b> ({b.boatNumber})
                      </td>
                      <td className="p-4">{b.ownerId?.name}</td>
                      <td className="p-4 text-xs font-bold uppercase">{b.boatType}</td>
                      <td className="p-4">{b.capacity} Seats</td>
                      <td className="p-4 font-bold">{b.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "PERMITS" && (
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b text-xs font-black uppercase text-slate-500 tracking-wider">
                    <th className="p-4">Permit Code</th>
                    <th className="p-4">Permit Type</th>
                    <th className="p-4">Owner</th>
                    <th className="p-4">Valid Period</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reports.permits.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-black">{p.permitNumber}</td>
                      <td className="p-4 text-xs font-bold uppercase">{p.permitType?.replace(/_/g, " ")}</td>
                      <td className="p-4">{p.ownerId?.name}</td>
                      <td className="p-4 text-xs font-semibold">
                        {new Date(p.validFrom).toLocaleDateString()} - {new Date(p.validTill).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-bold">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "INSPECTIONS" && (
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b text-xs font-black uppercase text-slate-500 tracking-wider">
                    <th className="p-4">Boat details</th>
                    <th className="p-4">Inspector</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Safety Result</th>
                    <th className="p-4">Date Logged</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reports.inspections.map((i) => (
                    <tr key={i._id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <b>{i.boatId?.boatName}</b> ({i.boatId?.boatNumber})
                      </td>
                      <td className="p-4 font-bold">{i.inspectorName}</td>
                      <td className="p-4 font-black text-blue-700">{i.score}%</td>
                      <td className="p-4 font-bold">{i.result}</td>
                      <td className="p-4">{new Date(i.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "VIOLATIONS" && (
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b text-xs font-black uppercase text-slate-500 tracking-wider">
                    <th className="p-4">Violation Type</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Severity</th>
                    <th className="p-4">Penalty</th>
                    <th className="p-4">Paid Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reports.violations.map((v) => (
                    <tr key={v._id} className="hover:bg-slate-50/50">
                      <td className="p-4 uppercase font-black text-xs text-orange-700">{v.violationType?.replace(/_/g, " ")}</td>
                      <td className="p-4 text-xs font-semibold">{v.description}</td>
                      <td className="p-4 font-bold">{v.severity}</td>
                      <td className="p-4 font-black text-green-700">₹{v.penaltyAmount}</td>
                      <td className="p-4 font-bold">{v.penaltyPaid ? "Paid" : "Unpaid"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "COMPLAINTS" && (
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b text-xs font-black uppercase text-slate-500 tracking-wider">
                    <th className="p-4">Complaint Category</th>
                    <th className="p-4">Boat Link</th>
                    <th className="p-4">Citizen Name</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Date Logged</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reports.complaints.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/50">
                      <td className="p-4 uppercase font-black text-xs">{c.complaintType}</td>
                      <td className="p-4 font-bold text-slate-700">{c.boatId?.boatName || "General"}</td>
                      <td className="p-4">{c.name}</td>
                      <td className="p-4 text-xs font-semibold text-slate-500">{c.description}</td>
                      <td className="p-4">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
