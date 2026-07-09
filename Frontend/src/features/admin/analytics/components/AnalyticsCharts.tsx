import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { AnalyticsResponse } from "@/features/admin/analytics/types";

interface AnalyticsChartsProps {
  data: AnalyticsResponse;
}

export default function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const bookingData = [
    { name: "Total Bookings", value: data.totalBookings },
    { name: "Confirmed", value: data.confirmedBookings ?? 0 },
    { name: "Cancelled", value: data.cancelledBookings ?? 0 },
  ];

  const revenueData = [
    { name: "Total Revenue", value: data.totalRevenue },
    { name: "Payments", value: data.totalPayments ?? 0 },
  ];

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="text-lg font-bold text-blue-950">Booking Analytics</h2>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bookingData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="text-lg font-bold text-blue-950">Revenue Analytics</h2>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}