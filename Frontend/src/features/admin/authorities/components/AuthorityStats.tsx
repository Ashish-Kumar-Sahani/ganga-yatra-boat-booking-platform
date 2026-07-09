import { Shield, CheckCircle, XCircle, Building2 } from "lucide-react";
import type { AuthorityStats as StatsType } from "../types/authority.types";

interface Props {
  stats: StatsType;
}

export default function AuthorityStats({ stats }: Props) {
  const statCards = [
    {
      label: "Total Authorities",
      value: stats.total,
      icon: Shield,
      bg: "bg-blue-50 border-blue-100",
      textColor: "text-blue-900",
      iconColor: "text-blue-600",
    },
    {
      label: "Active Officials",
      value: stats.active,
      icon: CheckCircle,
      bg: "bg-green-50 border-green-100",
      textColor: "text-green-900",
      iconColor: "text-green-600",
    },
    {
      label: "Inactive Officials",
      value: stats.inactive,
      icon: XCircle,
      bg: "bg-red-50 border-red-100",
      textColor: "text-red-900",
      iconColor: "text-red-600",
    },
    {
      label: "Assigned Cities",
      value: stats.assignedCitiesCount,
      icon: Building2,
      bg: "bg-orange-50 border-orange-100",
      textColor: "text-orange-900",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between bg-white`}
          >
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.label}</p>
              <h3 className={`text-3xl font-black ${card.textColor} mt-2`}>{card.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${card.bg} border`}>
              <Icon size={24} className={card.iconColor} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
