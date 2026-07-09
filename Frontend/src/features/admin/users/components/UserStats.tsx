import { Users, UserCheck, Ship, User } from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "12,845",
    icon: Users,
  },
  {
    title: "Active Users",
    value: "10,245",
    icon: UserCheck,
  },
  {
    title: "Customers",
    value: "8,520",
    icon: User,
  },
  {
    title: "Boat Owners",
    value: "1,240",
    icon: Ship,
  },
];

export default function UserStats() {
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
                <p className="text-slate-500">
                  {item.title}
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {item.value}
                </h3>
              </div>

              <Icon
                className="text-blue-600"
                size={32}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}