import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { OwnerDashboardData } from "../types/owner.types";

type Props = {
  dashboard: OwnerDashboardData | null;
};

export default function OwnerBookingChart({ dashboard }: Props) {
  const data = dashboard?.bookingChart || [];

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-lg font-bold text-blue-950">Bookings Overview</h2>

      <div className="mt-6 h-72">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No booking chart data found.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#2563eb"
                fill="#dbeafe"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}