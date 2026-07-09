import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  dashboard?: any;
  dailyData?: any[];
  paymentData?: any[];
  monthlyData?: any[];
};

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"];

export default function OwnerEarningsChart({ dashboard, dailyData = [], paymentData = [], monthlyData = [] }: Props) {
  // Handle backward compatibility
  const finalDailyData = dashboard ? (dashboard.earningsChart || []) : dailyData;
  const finalPaymentData = dashboard ? (dashboard.paymentMethods || []) : paymentData;
  const finalMonthlyData = dashboard ? (dashboard.monthlyRevenue || []) : monthlyData;

  // Map payment data for Pie Chart
  const pieData = finalPaymentData.map((p: any) => ({
    name: p._id || p.method,
    value: p.value,
  })).filter((p: any) => p.value > 0);

  // Compute monthly growth percentage for Growth Line Chart
  const growthData = finalMonthlyData.map((m: any, idx: number) => {
    let growth = 0;
    if (idx > 0) {
      const prev = finalMonthlyData[idx - 1].revenue;
      if (prev > 0) {
        growth = Math.round(((m.revenue - prev) / prev) * 100);
      }
    }
    return {
      month: m.month,
      "Growth %": growth,
      revenue: m.revenue,
    };
  });

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Payment Method: Pie Chart */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
        <h2 className="text-base font-black text-slate-800 mb-4">Payment Method Distribution</h2>
        <div className="h-64 flex items-center justify-center">
          {pieData.length === 0 ? (
            <div className="text-sm text-slate-400 font-semibold">No payment method data.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bookings: Area Chart */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
        <h2 className="text-base font-black text-slate-800 mb-4">Bookings Volume Trend</h2>
        <div className="h-64">
          {finalDailyData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400 font-semibold">No bookings trend data.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={finalDailyData}>
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

      {/* Revenue Growth: Line Chart */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
        <h2 className="text-base font-black text-slate-800 mb-4">Monthly Revenue Growth</h2>
        <div className="h-64">
          {growthData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400 font-semibold">No growth trend data.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: "10px", fontWeight: "600", fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: "10px", fontWeight: "600", fill: "#64748b" }} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line type="monotone" dataKey="Growth %" stroke="#ec4899" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}