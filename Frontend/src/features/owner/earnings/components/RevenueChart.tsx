import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  dailyData: any[];
  monthlyData: any[];
};

export default function RevenueChart({ dailyData = [], monthlyData = [] }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Monthly Revenue: Bar Chart */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
        <h2 className="text-base font-black text-slate-800 mb-4">Monthly Revenue Overview</h2>
        <div className="h-80 min-h-[300px]">
          {monthlyData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400 font-semibold">
              No monthly revenue data found.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: "11px", fontWeight: "600", fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: "11px", fontWeight: "600", fill: "#64748b" }} />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Daily Revenue: Line Chart */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
        <h2 className="text-base font-black text-slate-800 mb-4">Daily Earnings Trend</h2>
        <div className="h-80 min-h-[300px]">
          {dailyData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400 font-semibold">
              No daily revenue data found.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} style={{ fontSize: "11px", fontWeight: "600", fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: "11px", fontWeight: "600", fill: "#64748b" }} />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Earnings"]} />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}