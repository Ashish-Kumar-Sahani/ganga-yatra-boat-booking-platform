import { useEffect, useState } from "react";
import {
  CalendarCheck,
  IndianRupee,
  Users,
  Percent,
  XCircle,
  RefreshCw,
  Ship,
  Route,
  Activity,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAdminAnalyticsStore } from "@/features/admin/analytics/store/adminAnalyticsStore";

const money = (value?: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

export default function Analytics() {
  const { data, loading, error, fetchAnalytics } = useAdminAnalyticsStore();
  const [activeTab, setActiveTab] = useState<"SUMMARY" | "BREAKDOWNS" | "COMPARISONS">("SUMMARY");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
        <RefreshCw className="h-10 w-10 animate-spin text-blue-600" />
        <span className="text-slate-500 font-bold text-sm">Compiling platform-wide analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 font-bold bg-red-50 rounded-2xl border border-red-100">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-gray-500 font-bold text-center">No analytics data available.</div>
    );
  }

  const { summary = {}, charts = {}, breakdown = {} } = data;

  const stats = [
    { title: "Total Bookings", value: (summary.bookingCount || 0).toLocaleString(), icon: CalendarCheck, color: "text-blue-600 bg-blue-50" },
    { title: "Completed Trips", value: (summary.completedTrips || 0).toLocaleString(), icon: CalendarCheck, color: "text-emerald-600 bg-emerald-50" },
    { title: "Cancelled Bookings", value: (data.cancelledBookings || 0).toLocaleString(), icon: XCircle, color: "text-red-600 bg-red-50" },
    { title: "Total Revenue", value: money(summary.totalRevenue), icon: IndianRupee, color: "text-green-600 bg-green-50" },
    { title: "Refund Amount", value: money(summary.refundAmount), icon: RefreshCw, color: "text-orange-600 bg-orange-50" },
    { title: "Avg Ticket Size", value: money(summary.averageTicketSize), icon: Percent, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="p-6 space-y-6 bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div>
          <h1 className="text-3xl font-black text-blue-950">Analytics & Reports</h1>
          <p className="text-slate-500 font-semibold text-sm">Platform performance analysis and fiscal auditing</p>
        </div>
        <button
          onClick={() => fetchAnalytics()}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs font-bold shadow-sm"
        >
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow transition-all duration-300">
              <p className="text-xs font-semibold text-slate-500">{item.title}</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <h3 className="text-lg font-black text-slate-900">{item.value}</h3>
                <div className={`rounded-xl p-2 shrink-0 ${item.color}`}>
                  <Icon size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        {["SUMMARY", "BREAKDOWNS", "COMPARISONS"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-3 text-xs font-black tracking-wide border-b-2 transition-all duration-300 ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* SUMMARY TAB */}
      {activeTab === "SUMMARY" && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Payment Method Pie Chart */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
              <h2 className="text-base font-black text-slate-800 mb-4">Payment Method Distribution</h2>
              <div className="h-64 flex items-center justify-center">
                {(!charts.paymentMethods || charts.paymentMethods.length === 0) ? (
                  <div className="text-sm text-slate-400 font-semibold">No payment data.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={charts.paymentMethods.map((p: any) => ({ name: p._id, value: p.value }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {charts.paymentMethods.map((_entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Bookings Area Chart */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 md:col-span-2">
              <h2 className="text-base font-black text-slate-800 mb-4">Bookings Volume Trend (Daily)</h2>
              <div className="h-64">
                {(!charts.dailyRevenue || charts.dailyRevenue.length === 0) ? (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400 font-semibold">No booking trend data.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={charts.dailyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} style={{ fontSize: "10px", fontWeight: "600", fill: "#64748b" }} />
                      <YAxis tickLine={false} axisLine={false} style={{ fontSize: "10px", fontWeight: "600", fill: "#64748b" }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="bookings" stroke="#8b5cf6" fill="#f5f3ff" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Monthly Revenue Bar Chart */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <h2 className="text-base font-black text-slate-800 mb-4">Monthly Revenue Overview</h2>
            <div className="h-80">
              {(!charts.monthlyRevenue || charts.monthlyRevenue.length === 0) ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-400 font-semibold">No monthly data.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: "11px", fontWeight: "600", fill: "#64748b" }} />
                    <YAxis tickLine={false} axisLine={false} style={{ fontSize: "11px", fontWeight: "600", fill: "#64748b" }} />
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]} />
                    <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BREAKDOWNS TAB */}
      {activeTab === "BREAKDOWNS" && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* By Boat */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
              <Ship size={18} className="text-blue-600" /> Revenue by Vessel
            </h3>
            <div className="overflow-x-auto divide-y">
              {(breakdown.byBoat || []).map((item: any, idx: number) => (
                <div key={item._id || idx} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-bold text-slate-800">{item.boatName}</p>
                    <p className="text-xs text-slate-500 font-semibold">{item.ownerName} • {item.bookings} trips</p>
                  </div>
                  <span className="font-black text-slate-900">{money(item.revenue)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* By Route */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
              <Route size={18} className="text-indigo-600" /> Revenue by Route
            </h3>
            <div className="overflow-x-auto divide-y">
              {(breakdown.byRoute || []).map((item: any, idx: number) => (
                <div key={item._id || idx} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-bold text-slate-800">{item.routeName}</p>
                    <p className="text-xs text-slate-500 font-semibold">{item.bookings} Bookings</p>
                  </div>
                  <span className="font-black text-slate-900">{money(item.revenue)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* By City */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
              <Activity size={18} className="text-emerald-600" /> Revenue by City
            </h3>
            <div className="overflow-x-auto divide-y">
              {(breakdown.byCity || []).map((item: any, idx: number) => (
                <div key={item._id || idx} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-bold text-slate-800">{item.cityName}</p>
                    <p className="text-xs text-slate-500 font-semibold">{item.bookings} trips</p>
                  </div>
                  <span className="font-black text-slate-900">{money(item.revenue)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* By Owner */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
              <Users size={18} className="text-teal-600" /> Revenue by Boat Owner
            </h3>
            <div className="overflow-x-auto divide-y">
              {(breakdown.byOwner || []).map((item: any, idx: number) => (
                <div key={item._id || idx} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-bold text-slate-800">{item.ownerName}</p>
                    <p className="text-xs text-slate-500 font-semibold">{item.bookings} bookings</p>
                  </div>
                  <span className="font-black text-slate-900">{money(item.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COMPARISONS TAB */}
      {activeTab === "COMPARISONS" && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Quarterly comparison */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <h3 className="text-base font-black text-slate-800 mb-4">Quarterly Revenue Summary</h3>
              <div className="h-64">
                {(!charts.quarterlyComparison || charts.quarterlyComparison.length === 0) ? (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400 font-semibold">No quarterly data.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={charts.quarterlyComparison}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="quarter" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                      <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Monthly comparisons list */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <h3 className="text-base font-black text-slate-800 mb-4">Month-on-Month Growth Analysis</h3>
              <div className="divide-y max-h-64 overflow-y-auto">
                {(!charts.monthlyComparison || charts.monthlyComparison.length === 0) ? (
                  <div className="py-8 text-center text-sm text-slate-400 font-semibold">No comparison data.</div>
                ) : (
                  charts.monthlyComparison.map((c: any, idx: number) => (
                    <div key={idx} className="py-3 flex justify-between items-center text-sm font-semibold">
                      <span className="text-slate-600">{c.period}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">{money(c.previousRevenue)} → {money(c.currentRevenue)}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.growthPercent >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {c.growthPercent >= 0 ? "+" : ""}{c.growthPercent}%
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}