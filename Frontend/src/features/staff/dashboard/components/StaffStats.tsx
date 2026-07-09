import { Wallet, ArrowUpRight, CheckCircle2 } from "lucide-react";

interface Props {
  data: any;
}

export default function StaffStats({ data }: Props) {
  const stats = [
    {
      title: "Today's Collection",
      value: `₹${Number(data.todayCollection || 0).toLocaleString("en-IN")}`,
      icon: Wallet,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Current Shift Collection",
      value: `₹${Number(data.shiftCollection || 0).toLocaleString("en-IN")}`,
      icon: ArrowUpRight,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Offline Collection",
      value: `₹${Number(data.offlineCollection || 0).toLocaleString("en-IN")}`,
      icon: Wallet,
      color: "text-teal-600 bg-teal-50",
    },
    {
      title: "Cash Collection",
      value: `₹${Number(data.cashCollection || 0).toLocaleString("en-IN")}`,
      icon: Wallet,
      color: "text-amber-600 bg-amber-50",
    },
    {
      title: "UPI Collection",
      value: `₹${Number(data.upiCollection || 0).toLocaleString("en-IN")}`,
      icon: Wallet,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      title: "Completed Trips",
      value: (data.completedTripsCount || 0).toLocaleString("en-IN"),
      icon: CheckCircle2,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-3xl bg-white p-5 shadow-sm border border-blue-50/50 flex flex-col justify-between hover:shadow transition-all duration-300"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500">
                {item.title}
              </p>

              <h3 className="mt-2 text-xl font-black text-slate-900">
                {item.value}
              </h3>
            </div>

            <div className="mt-4 flex justify-end">
              <div className={`rounded-2xl p-2.5 ${item.color}`}>
                <Icon size={18} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}