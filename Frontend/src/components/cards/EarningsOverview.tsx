import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "06 Jun", amount: 28000 },
  { day: "07 Jun", amount: 35000 },
  { day: "08 Jun", amount: 42000 },
  { day: "09 Jun", amount: 30000 },
  { day: "10 Jun", amount: 51000 },
  { day: "11 Jun", amount: 39000 },
  { day: "12 Jun", amount: 46000 },
];

export default function EarningsOverview() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-black">
          Earnings Overview
        </h2>

        <button className="rounded-xl border px-3 py-2 text-sm">
          This Week
        </button>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="day" />
            <Tooltip />
            <Bar
              dataKey="amount"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}