import { CalendarDays, CheckCircle, Clock3, Route } from "lucide-react";

type Props = {
  schedules?: any[];
};

export default function ScheduleStats({ schedules = [] }: Props) {
  const totalSchedules = schedules.length;
  const activeSchedules = schedules.filter((item) => item.isActive).length;
  const inactiveSchedules = schedules.filter((item) => !item.isActive).length;

  const uniqueRoutes = new Set(
    schedules.map((item) => item.routeId?._id).filter(Boolean)
  ).size;

  const stats = [
    {
      title: "Total Schedules",
      value: totalSchedules,
      icon: CalendarDays,
    },
    {
      title: "Active Schedules",
      value: activeSchedules,
      icon: Clock3,
    },
    {
      title: "Active Routes",
      value: uniqueRoutes,
      icon: Route,
    },
    {
      title: "Inactive",
      value: inactiveSchedules,
      icon: CheckCircle,
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