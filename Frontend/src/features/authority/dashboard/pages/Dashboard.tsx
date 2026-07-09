import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardStore } from "../store/dashboardStore";
import {
  Ship,
  FileCheck,
  Route,
  ShieldCheck,
  AlertTriangle,
  MessageSquare,
  Activity,
  Flame,
  UserCheck,
  FileText,
  ClipboardList,
  Eye,
  CreditCard,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { stats, loading, error, fetchStats } = useDashboardStore();

  useEffect(() => {
    fetchStats();

    const interval = setInterval(() => {
      fetchStats();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 font-bold text-blue-950">Loading government metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-center shadow-sm">
        <p className="font-bold text-red-600">{error}</p>
        <button
          onClick={() => fetchStats()}
          className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700"
        >
          Retry Load
        </button>
      </div>
    );
  }

  const s = stats || {
    totalBoats: 0,
    verifiedBoats: 0,
    pendingBoatVerification: 0,
    rejectedBoats: 0,
    suspendedBoats: 0,
    pendingPermitRequests: 0,
    approvedPermits: 0,
    expiredPermits: 0,
    pendingRouteApprovals: 0,
    approvedRoutes: 0,
    safetyInspectionsDue: 0,
    activeComplaints: 0,
    openViolations: 0,
    emergencyAlerts: 0,
    liveTrips: 0,
    todayTripCount: 0,
    inspectionsCount: 0,
  };

  const statCards = [
    { label: "Total Boats", value: s.totalBoats, icon: Ship, color: "text-blue-600 bg-blue-50" },
    { label: "Verified Boats", value: s.verifiedBoats, icon: ShieldCheck, color: "text-green-600 bg-green-50" },
    { label: "Pending Verification", value: s.pendingBoatVerification, icon: AlertTriangle, color: "text-yellow-600 bg-yellow-50" },
    { label: "Suspended Boats", value: s.suspendedBoats, icon: AlertTriangle, color: "text-red-600 bg-red-50" },
    { label: "Pending Permits", value: s.pendingPermitRequests, icon: FileCheck, color: "text-indigo-600 bg-indigo-50" },
    { label: "Approved Permits", value: s.approvedPermits, icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50" },
    { label: "Expired Permits", value: s.expiredPermits, icon: AlertTriangle, color: "text-red-600 bg-red-50" },
    { label: "Pending Routes", value: s.pendingRouteApprovals, icon: Route, color: "text-orange-600 bg-orange-50" },
    { label: "Approved Routes", value: s.approvedRoutes, icon: Route, color: "text-cyan-600 bg-cyan-50" },
    { label: "Inspections Due", value: s.safetyInspectionsDue, icon: ClipboardList, color: "text-rose-600 bg-rose-50" },
    { label: "Active Complaints", value: s.activeComplaints, icon: MessageSquare, color: "text-teal-600 bg-teal-50" },
    { label: "Open Violations", value: s.openViolations, icon: AlertTriangle, color: "text-amber-600 bg-amber-50" },
    { label: "Live Trips", value: s.liveTrips, icon: Activity, color: "text-sky-600 bg-sky-50" },
    { label: "Today's Trips", value: s.todayTripCount, icon: Activity, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero / Welcome */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-cyan-500 p-6 text-white shadow-lg">
        <h1 className="text-3xl font-black">City Authority Dashboard</h1>
        <p className="mt-1.5 text-blue-100 max-w-xl">
          Welcome to the official river transit safety oversight console. Review licenses, verify permit requests, manage routes, and trace compliance reports.
        </p>
      </div>

      {/* Emergency Alerts Panel (Visible only when alert count > 0) */}
      {s.emergencyAlerts > 0 && (
        <div className="flex items-center justify-between rounded-2xl bg-red-50 border border-red-200 p-5 text-red-800 shadow-sm animate-pulse">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-red-600 p-2.5 text-white">
              <Flame size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black">SOS Emergency Alerts Active</h3>
              <p className="text-sm font-semibold text-red-600">
                {s.emergencyAlerts} boat(s) currently broadcasting active SOS signals in your jurisdiction.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/authority/violations")}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 shadow-lg"
          >
            Investigate Emergency
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-black text-blue-950 mb-4">Quick Governance Actions</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <button
            onClick={() => navigate("/authority/boats")}
            className="flex flex-col items-center justify-center rounded-2xl bg-blue-50/50 hover:bg-blue-50 border border-blue-100 p-4 transition-all duration-300 group"
          >
            <UserCheck className="text-blue-600 group-hover:scale-110 transition" size={24} />
            <span className="mt-2 text-xs font-bold text-blue-950">Verify Boats</span>
          </button>

          <button
            onClick={() => navigate("/authority/permits")}
            className="flex flex-col items-center justify-center rounded-2xl bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 p-4 transition-all duration-300 group"
          >
            <FileText className="text-indigo-600 group-hover:scale-110 transition" size={24} />
            <span className="mt-2 text-xs font-bold text-blue-950">Review Permits</span>
          </button>

          <button
            onClick={() => navigate("/authority/routes")}
            className="flex flex-col items-center justify-center rounded-2xl bg-cyan-50/50 hover:bg-cyan-50 border border-cyan-100 p-4 transition-all duration-300 group"
          >
            <Route className="text-cyan-600 group-hover:scale-110 transition" size={24} />
            <span className="mt-2 text-xs font-bold text-blue-950">Audit Routes</span>
          </button>

          <button
            onClick={() => navigate("/authority/inspections")}
            className="flex flex-col items-center justify-center rounded-2xl bg-rose-50/50 hover:bg-rose-50 border border-rose-100 p-4 transition-all duration-300 group"
          >
            <ClipboardList className="text-rose-600 group-hover:scale-110 transition" size={24} />
            <span className="mt-2 text-xs font-bold text-blue-950">Safety Audit</span>
          </button>

          <button
            onClick={() => navigate("/authority/violations")}
            className="flex flex-col items-center justify-center rounded-2xl bg-amber-50/50 hover:bg-amber-50 border border-amber-100 p-4 transition-all duration-300 group"
          >
            <AlertTriangle className="text-amber-600 group-hover:scale-110 transition" size={24} />
            <span className="mt-2 text-xs font-bold text-blue-950">Issue Fine</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="rounded-3xl bg-white border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">{card.label}</span>
                <div className={`rounded-xl p-2 ${card.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <p className="mt-2 text-3xl font-black text-blue-950">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Refund Governance Section */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 mt-6">
        <h2 className="text-lg font-black text-blue-950 mb-4 flex items-center gap-2">
          <CreditCard className="text-blue-600" size={20} /> Refund Governance Ledger
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-6 text-slate-700">
          <div className="rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow bg-slate-50/30">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Requests</span>
            <span className="text-2xl font-black text-slate-900 mt-2 block">{s.pendingRefundRequests || 0}</span>
          </div>
          <div className="rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow bg-slate-50/30">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Today's Requests</span>
            <span className="text-2xl font-black text-slate-900 mt-2 block">{s.todaysRefundRequests || 0}</span>
          </div>
          <div className="rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow bg-slate-50/30">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Approved</span>
            <span className="text-2xl font-black text-green-605 mt-2 block">{s.approvedRefunds || 0}</span>
          </div>
          <div className="rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow bg-slate-50/30">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rejected</span>
            <span className="text-2xl font-black text-red-600 mt-2 block">{s.rejectedRefunds || 0}</span>
          </div>
          <div className="rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow bg-slate-50/30">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">High Value Requests</span>
            <span className="text-2xl font-black text-amber-600 mt-2 block">₹{s.highValueRefunds || 0}</span>
          </div>
          <div className="rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow bg-slate-50/30">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Refund Queue</span>
            <span className="text-2xl font-black text-blue-600 mt-2 block">{s.refundQueue || 0}</span>
          </div>
        </div>
      </div>

      {/* Charts / Distribution Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Boat Verification Status Chart */}
        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <h3 className="text-lg font-black text-blue-950 mb-4">Boat Verification Rate</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-600 mb-1.5">
                <span>Approved ({s.verifiedBoats})</span>
                <span>{s.totalBoats > 0 ? Math.round((s.verifiedBoats / s.totalBoats) * 100) : 0}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${s.totalBoats > 0 ? (s.verifiedBoats / s.totalBoats) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold text-slate-600 mb-1.5">
                <span>Pending Verification ({s.pendingBoatVerification})</span>
                <span>{s.totalBoats > 0 ? Math.round((s.pendingBoatVerification / s.totalBoats) * 100) : 0}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${s.totalBoats > 0 ? (s.pendingBoatVerification / s.totalBoats) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold text-slate-600 mb-1.5">
                <span>Suspended / Rejected ({s.suspendedBoats + (s.totalBoats - s.verifiedBoats - s.pendingBoatVerification - s.suspendedBoats)})</span>
                <span>{s.totalBoats > 0 ? Math.round(((s.suspendedBoats + (s.totalBoats - s.verifiedBoats - s.pendingBoatVerification - s.suspendedBoats)) / s.totalBoats) * 100) : 0}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${s.totalBoats > 0 ? ((s.suspendedBoats + (s.totalBoats - s.verifiedBoats - s.pendingBoatVerification - s.suspendedBoats)) / s.totalBoats) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Permits Chart */}
        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <h3 className="text-lg font-black text-blue-950 mb-4">Permit Status Summary</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-600 mb-1.5">
                <span>Approved Permits ({s.approvedPermits})</span>
                <span>
                  {s.approvedPermits + s.pendingPermitRequests + s.expiredPermits > 0
                    ? Math.round(
                        (s.approvedPermits /
                          (s.approvedPermits + s.pendingPermitRequests + s.expiredPermits)) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${
                      s.approvedPermits + s.pendingPermitRequests + s.expiredPermits > 0
                        ? (s.approvedPermits /
                            (s.approvedPermits + s.pendingPermitRequests + s.expiredPermits)) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold text-slate-600 mb-1.5">
                <span>Pending Reviews ({s.pendingPermitRequests})</span>
                <span>
                  {s.approvedPermits + s.pendingPermitRequests + s.expiredPermits > 0
                    ? Math.round(
                        (s.pendingPermitRequests /
                          (s.approvedPermits + s.pendingPermitRequests + s.expiredPermits)) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{
                    width: `${
                      s.approvedPermits + s.pendingPermitRequests + s.expiredPermits > 0
                        ? (s.pendingPermitRequests /
                            (s.approvedPermits + s.pendingPermitRequests + s.expiredPermits)) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold text-slate-600 mb-1.5">
                <span>Expired Permits ({s.expiredPermits})</span>
                <span>
                  {s.approvedPermits + s.pendingPermitRequests + s.expiredPermits > 0
                    ? Math.round(
                        (s.expiredPermits /
                          (s.approvedPermits + s.pendingPermitRequests + s.expiredPermits)) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{
                    width: `${
                      s.approvedPermits + s.pendingPermitRequests + s.expiredPermits > 0
                        ? (s.expiredPermits /
                            (s.approvedPermits + s.pendingPermitRequests + s.expiredPermits)) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Queue & actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-blue-950">Pending Approval Queue</h3>
            <button
              onClick={() => navigate("/authority/boats")}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Manage all
            </button>
          </div>
          {s.pendingBoatVerification === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center text-slate-400">
              <Eye size={28} className="stroke-[1.5]" />
              <p className="mt-2 text-sm font-semibold">Queue clean. No boats pending verification.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-100 p-4 bg-slate-50 flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-slate-800">Pending Boat Registrations</p>
                <p className="text-xs font-semibold text-slate-500">
                  {s.pendingBoatVerification} boat(s) awaiting verification checks and safety document review.
                </p>
              </div>
              <button
                onClick={() => navigate("/authority/boats")}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow"
              >
                Start Verification
              </button>
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-blue-950">Recent Government Actions</h3>
            <button
              onClick={() => navigate("/authority/reports")}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              View reports
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-100 p-3 bg-slate-50">
              <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Boats Inspected</p>
                <p className="text-[11px] font-semibold text-slate-500">
                  Total of {s.inspectionsCount || 0} inspections logged in database.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-100 p-3 bg-slate-50">
              <div className="rounded-xl bg-red-100 p-2 text-red-700">
                <AlertTriangle size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Violations Handled</p>
                <p className="text-[11px] font-semibold text-slate-500">
                  Currently supervising {s.openViolations} active violation reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
