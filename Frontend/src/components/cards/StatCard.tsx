import { useState } from "react";
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  Ship,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Schedule = {
  id: string;
  boatName: string;
  routeName: string;
  date: string;
  startTime: string;
  endTime: string;
  totalSlots: number;
  status: "ACTIVE" | "CANCELLED" | "COMPLETED";
};

const schedulesData: Schedule[] = [];

export default function MySchedules() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("ALL");

  const schedules =
    filter === "ALL"
      ? schedulesData
      : schedulesData.filter((item) => item.status === filter);

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            My Schedules
          </h1>
          <p className="text-sm font-semibold text-slate-500">
            Manage boat schedules, route timings and generated slots
          </p>
        </div>

        <button
          onClick={() => navigate("/owner/add-schedule")}
          className="flex w-fit items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white"
        >
          <Plus size={18} />
          Add Schedule
        </button>
      </header>

      <section className="flex flex-wrap gap-2 rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
        <div className="mr-2 flex items-center gap-2 text-sm font-bold text-slate-600">
          <Filter size={17} className="text-blue-700" />
          Filter:
        </div>

        {["ALL", "ACTIVE", "COMPLETED", "CANCELLED"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-xl px-4 py-2 text-xs font-extrabold ${
              filter === item
                ? "bg-blue-700 text-white"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {item}
          </button>
        ))}
      </section>

      {schedules.length === 0 && (
        <div className="rounded-3xl border border-dashed border-blue-200 bg-white p-10 text-center shadow-sm">
          <CalendarDays className="mx-auto mb-3 text-blue-700" size={36} />
          <p className="font-extrabold text-slate-800">
            No schedules found
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Your schedules will appear here after backend data is connected.
          </p>
        </div>
      )}

      <section className="grid gap-5 lg:grid-cols-2">
        {schedules.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {item.boatName}
                </h3>

                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <MapPin size={16} />
                  {item.routeName}
                </p>
              </div>

              <StatusBadge status={item.status} />
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-4">
              <Info
                icon={<CalendarDays size={17} />}
                label="Date"
                value={item.date}
              />

              <Info
                icon={<Clock size={17} />}
                label="Start"
                value={item.startTime}
              />

              <Info
                icon={<Clock size={17} />}
                label="End"
                value={item.endTime}
              />

              <Info
                icon={<Ship size={17} />}
                label="Slots"
                value={`${item.totalSlots}`}
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3 border-t border-blue-100 pt-5">
              <button className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white">
                View Slots
              </button>

              <button className="rounded-xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
                Edit
              </button>

              <button className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                Cancel
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-blue-50/60 p-4">
      <div className="mb-2 text-blue-700">{icon}</div>
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-bold text-slate-800">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Schedule["status"] }) {
  const style =
    status === "ACTIVE"
      ? "bg-green-50 text-green-700"
      : status === "COMPLETED"
      ? "bg-blue-50 text-blue-700"
      : "bg-red-50 text-red-700";

  return (
    <span
      className={`h-fit rounded-full px-4 py-2 text-xs font-extrabold ${style}`}
    >
      {status}
    </span>
  );
}