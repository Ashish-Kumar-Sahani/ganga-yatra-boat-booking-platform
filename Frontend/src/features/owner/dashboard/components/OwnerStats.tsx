import {
  Ship,
  Wallet,
  CalendarCheck,
  TicketCheck,
} from "lucide-react";

import type { OwnerDashboardData } from "../types/owner.types";

type Props = {
  dashboard: OwnerDashboardData | null;
};

export default function OwnerStats({ dashboard }: Props) {
  const stats = [
    {
      title: "Total Boats",
      value: dashboard?.totalBoats ?? 0,
      icon: Ship,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Today Slots",
      value: dashboard?.todaySlots ?? 0,
      icon: CalendarCheck,
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
    {
      title: "Total Bookings",
      value: dashboard?.totalBookings ?? 0,
      icon: TicketCheck,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Today's Revenue",
      value: `₹${Number(dashboard?.todayEarnings ?? 0).toLocaleString("en-IN")}`,
      icon: Wallet,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Yesterday's Revenue",
      value: `₹${Number(dashboard?.yesterdayEarnings ?? 0).toLocaleString("en-IN")}`,
      icon: Wallet,
      bgColor: "bg-teal-50",
      textColor: "text-teal-600",
    },
    {
      title: "This Week's Revenue",
      value: `₹${Number(dashboard?.thisWeekEarnings ?? 0).toLocaleString("en-IN")}`,
      icon: Wallet,
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-600",
    },
    {
      title: "Last Week's Revenue",
      value: `₹${Number(dashboard?.lastWeekEarnings ?? 0).toLocaleString("en-IN")}`,
      icon: Wallet,
      bgColor: "bg-sky-50",
      textColor: "text-sky-600",
    },
    {
      title: "This Month's Revenue",
      value: `₹${Number(dashboard?.thisMonthEarnings ?? 0).toLocaleString("en-IN")}`,
      icon: Wallet,
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      title: "Previous Month's Revenue",
      value: `₹${Number(dashboard?.prevMonthEarnings ?? 0).toLocaleString("en-IN")}`,
      icon: Wallet,
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      title: "Current Year's Revenue",
      value: `₹${Number(dashboard?.thisYearEarnings ?? 0).toLocaleString("en-IN")}`,
      icon: Wallet,
      bgColor: "bg-rose-50",
      textColor: "text-rose-600",
    },
    {
      title: "Lifetime Revenue",
      value: `₹${Number(dashboard?.lifetimeEarnings ?? 0).toLocaleString("en-IN")}`,
      icon: Wallet,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
  ];

  return (
    <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-semibold">{item.title}</p>

                <h3 className="mt-2 text-2xl font-black text-slate-900">
                  {item.value}
                </h3>
              </div>

              <div className={`rounded-xl p-3 ${item.bgColor || "bg-blue-50"}`}>
                <Icon size={24} className={item.textColor || "text-blue-600"} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}