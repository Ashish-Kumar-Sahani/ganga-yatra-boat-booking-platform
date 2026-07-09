import { ShieldCheck, UserCheck, Users, UserX } from "lucide-react";
import type { TeamMember } from "../types/team.types";

type Props = {
  team: TeamMember[];
};

export default function TeamStats({ team }: Props) {
  const total = team.length;
  const active = team.filter((m) => m.status === "ACTIVE").length;
  const inactive = team.filter((m) => m.status === "INACTIVE").length;
  const managers = team.filter((m) => m.role === "MANAGER").length;

  const stats = [
    { title: "Total Team", value: total, icon: Users },
    { title: "Active", value: active, icon: UserCheck },
    { title: "Managers", value: managers, icon: ShieldCheck },
    { title: "Inactive", value: inactive, icon: UserX },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div key={item.title} className="rounded-2xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  {item.title}
                </p>
                <h3 className="mt-2 text-3xl font-black text-blue-950">
                  {item.value}
                </h3>
              </div>

              <div className="rounded-xl bg-blue-50 p-3">
                <Icon size={28} className="text-blue-600" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}