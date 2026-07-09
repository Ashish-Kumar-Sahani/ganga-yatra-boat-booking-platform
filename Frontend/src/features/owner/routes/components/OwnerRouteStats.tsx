import { MapPin, Route, Ship, Clock3 } from "lucide-react";

const stats = [
  { title: "My Routes", value: "12", icon: Route },
  { title: "Connected Ghats", value: "18", icon: MapPin },
  { title: "Assigned Boats", value: "8", icon: Ship },
  { title: "Avg Duration", value: "45 Min", icon: Clock3 },
];

export default function OwnerRouteStats() {
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