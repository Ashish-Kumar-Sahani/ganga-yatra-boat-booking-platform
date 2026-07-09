import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", revenue: 250000 },
  { month: "Feb", revenue: 320000 },
  { month: "Mar", revenue: 410000 },
  { month: "Apr", revenue: 380000 },
  { month: "May", revenue: 520000 },
  { month: "Jun", revenue: 610000 },
];

export default function RevenueBarChart() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-lg font-bold text-blue-950">
        Monthly Revenue
      </h2>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <Tooltip />
            <Bar
              dataKey="revenue"
              radius={[8, 8, 0, 0]}
              fill="#2563eb"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}