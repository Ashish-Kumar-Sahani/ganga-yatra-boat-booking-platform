import {
  FileCheck,
  Clock3,
  AlertTriangle,
  BadgeCheck,
} from "lucide-react";

const stats = [
  { title: "Total Permits", value: "12", icon: FileCheck },
  { title: "Approved", value: "8", icon: BadgeCheck },
  { title: "Pending", value: "3", icon: Clock3 },
  { title: "Expired", value: "1", icon: AlertTriangle },
];

export default function PermitStats() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-2xl bg-white p-6 shadow"
          >
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