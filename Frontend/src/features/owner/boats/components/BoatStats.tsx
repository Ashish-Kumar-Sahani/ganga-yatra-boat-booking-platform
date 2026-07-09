import { Ship, CheckCircle, Clock, Ban } from "lucide-react";
import type { Boat } from "@/features/owner/boats/types/boat.types";

type Props = {
  boats: Boat[];
};

export default function BoatStats({ boats }: Props) {
  const stats = [
    {
      title: "Total Boats",
      value: boats.length,
      icon: Ship,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Approved",
      value: boats.filter((boat) => boat.status === "APPROVED").length,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Pending",
      value: boats.filter((boat) => boat.status === "PENDING").length,
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Suspended",
      value: boats.filter((boat) => boat.status === "SUSPENDED").length,
      icon: Ban,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div key={item.title} className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {item.title}
                </p>

                <h3 className="mt-2 text-3xl font-extrabold text-slate-900">
                  {item.value}
                </h3>
              </div>

              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.bg}`}
              >
                <Icon size={30} className={item.color} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}