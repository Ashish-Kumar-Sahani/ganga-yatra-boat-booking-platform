import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "06 Jun", bookings: 25 },
  { day: "07 Jun", bookings: 38 },
  { day: "08 Jun", bookings: 42 },
  { day: "09 Jun", bookings: 65 },
  { day: "10 Jun", bookings: 45 },
  { day: "11 Jun", bookings: 58 },
  { day: "12 Jun", bookings: 88 },
];

export default function BookingOverview() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-black">Boat Bookings Overview</h2>
        <button className="rounded-xl border px-3 py-2 text-sm">This Week</button>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="bookings" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}