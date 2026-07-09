import { Ship, CheckCircle, Clock, XCircle } from "lucide-react";
import type { StaffBoat } from "../types/boat.types";

type Props = {
  boats?: StaffBoat[];
};

export default function BoatStats({ boats = [] }: Props) {
  const stats = [
    { title: "Total Boats", value: boats.length, icon: Ship },
    {
      title: "Available",
      value: boats.filter((b) => b.isAvailable).length,
      icon: CheckCircle,
    },
    {
      title: "Pending",
      value: boats.filter((b) => b.status === "PENDING").length,
      icon: Clock,
    },
    {
      title: "Suspended",
      value: boats.filter((b) => b.status === "SUSPENDED").length,
      icon: XCircle,
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div key={item.title} className="rounded-2xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500">{item.title}</p>
                <h3 className="mt-2 text-3xl font-bold text-blue-950">
                  {item.value}
                </h3>
              </div>

              <Icon size={30} className="text-blue-600" />
            </div>
          </div>
        );
      })}
    </div>
  );
}