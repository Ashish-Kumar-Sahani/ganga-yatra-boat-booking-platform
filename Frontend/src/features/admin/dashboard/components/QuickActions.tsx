import {
  Plus,
  Ship,
  MapPin,
  Users,
} from "lucide-react";

const actions = [
  {
    title: "Add Boat",
    icon: Ship,
  },
  {
    title: "Add Ghat",
    icon: MapPin,
  },
  {
    title: "Add Owner",
    icon: Users,
  },
  {
    title: "Create Route",
    icon: Plus,
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="font-bold text-blue-950">
        Quick Actions
      </h2>

      <div className="mt-5 grid grid-cols-2 gap-4">
        {actions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className="rounded-xl border p-4 transition hover:bg-blue-50"
            >
              <Icon
                size={28}
                className="mx-auto text-blue-700"
              />

              <p className="mt-3 text-sm font-semibold">
                {item.title}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}