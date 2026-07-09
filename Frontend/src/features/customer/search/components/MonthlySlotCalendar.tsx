import type { MonthlySlotAvailability } from "@/features/owner/slots/types/slot.types";

type Props = {
  monthData: MonthlySlotAvailability[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

export default function MonthlySlotCalendar({
  monthData,
  selectedDate,
  onSelectDate,
}: Props) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow">
      <h2 className="mb-4 text-2xl font-black text-blue-950">
        Monthly Availability
      </h2>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
        {monthData.map((day) => (
          <button
            key={day.date}
            disabled={day.status === "FULL" || day.status === "NO_SLOT"}
            onClick={() => onSelectDate(day.date)}
            className={`rounded-2xl border p-4 text-left ${
              selectedDate === day.date
                ? "border-blue-700 ring-2 ring-blue-200"
                : "border-transparent"
            } ${
              day.status === "AVAILABLE"
                ? "bg-green-100 text-green-800"
                : day.status === "LIMITED"
                ? "bg-yellow-100 text-yellow-800"
                : day.status === "FULL"
                ? "bg-red-100 text-red-800"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <p className="font-bold">
              {new Date(day.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
              })}
            </p>

            <p className="mt-1 text-xs font-semibold">
              {day.availableSeats} seats
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}