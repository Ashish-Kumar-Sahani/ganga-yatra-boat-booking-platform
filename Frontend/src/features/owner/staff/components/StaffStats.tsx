import { ShieldCheck, UserCheck, Users, UserX } from "lucide-react";

type Props = {
  staff?: any[];
};

export default function StaffStats({ staff = [] }: Props) {
  const total = staff.length;
  const active = staff.filter((item) => item.status === "ACTIVE").length;
  const inactive = staff.filter((item) => item.status === "INACTIVE").length;
  const managers = staff.filter((item) => item.role === "MANAGER").length;

  const stats = [
    { title: "Total Staff", value: total, icon: Users },
    { title: "Active Staff", value: active, icon: UserCheck },
    { title: "Managers", value: managers, icon: ShieldCheck },
    { title: "Inactive Staff", value: inactive, icon: UserX },
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
                <h3 className="mt-2 text-3xl font-bold">{item.value}</h3>
              </div>

              <Icon size={30} className="text-blue-600" />
            </div>
          </div>
        );
      })}
    </div>
  );
}