import {
  Ship,
  CalendarPlus,
  Ticket,
  Users,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function QuickActionsCard() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Add Boat",
      icon: Ship,
      path: "/owner/add-boat",
    },
    {
      title: "Add Schedule",
      icon: CalendarPlus,
      path: "/owner/add-schedule",
    },
    {
      title: "Bookings",
      icon: Ticket,
      path: "/owner/bookings",
    },
    {
      title: "Staff",
      icon: Users,
      path: "/owner/staff",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-black">
        Quick Actions
      </h2>

      <div className="grid gap-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={() =>
                navigate(action.path)
              }
              className="flex items-center gap-3 rounded-2xl bg-blue-50 p-4 text-left font-bold text-blue-700"
            >
              <Icon size={18} />
              {action.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}