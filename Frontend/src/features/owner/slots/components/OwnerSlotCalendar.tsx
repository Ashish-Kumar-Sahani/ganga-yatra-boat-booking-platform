import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Ship,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { getLocalDateKey } from "@/utils/dateKey";
import type { Slot, SlotStatus } from "@/features/owner/slots/types/slot.types";
import { useSlotStore } from "@/features/owner/slots/store/slotStore";
import EditSlotModal from "./EditSlotModal";
import ShiftSlotModal from "./ShiftSlotModal";

type Props = {
  slots: Slot[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

export default function OwnerSlotCalendar({
  slots,
  selectedDate,
  onSelectDate,
}: Props) {
  const { changeSlotStatus, editSlot, shiftSlot } = useSlotStore();

  const [monthDate, setMonthDate] = useState(new Date());
  const [editData, setEditData] = useState<Slot | null>(null);
  const [shiftData, setShiftData] = useState<Slot | null>(null);

const todayKey = getLocalDateKey(new Date());

  const monthTitle = monthDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const grouped = useMemo(() => {
    return slots.reduce<Record<string, Slot[]>>((acc, slot) => {
      const key = getLocalDateKey(slot.slotDate);
      if (!acc[key]) acc[key] = [];
      acc[key].push(slot);
      return acc;
    }, {});
  }, [slots]);

  const calendarDays = useMemo(() => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const blanks = Array.from({ length: startDay }, () => null);

    const days = Array.from({ length: totalDays }, (_, index) => {
      const date = new Date(year, month, index + 1);
      return getLocalDateKey(date);
    });

    return [...blanks, ...days];
  }, [monthDate]);

  const getStats = (daySlots: Slot[]) => {
    let totalSeats = 0;
    let bookedSeats = 0;

    daySlots.forEach((slot) => {
      const booked =
        (slot.bookedOnlineSeats || 0) +
        (slot.bookedOfflineSeats || 0) +
        (slot.bookedEmergencySeats || 0);

      totalSeats += slot.totalSeats || 0;
      bookedSeats += booked;
    });

    const availableSeats = Math.max(totalSeats - bookedSeats, 0);
    const occupancy =
      totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;

    return {
      totalSeats,
      bookedSeats,
      availableSeats,
      occupancy,
    };
  };

  const getStatus = (daySlots: Slot[]) => {
    if (daySlots.length === 0) return "NO_SLOT";
    if (daySlots.every((slot) => slot.status === "EXPIRED")) return "EXPIRED";
    if (daySlots.every((slot) => slot.status === "CANCELLED"))
      return "CANCELLED";
    if (daySlots.every((slot) => slot.status === "FULL")) return "FULL";

    const { occupancy } = getStats(daySlots);
    if (occupancy >= 70) return "LIMITED";

    return "OPEN";
  };

  const cardStyle = (status: string) => {
    if (status === "OPEN") return "border-green-200 bg-green-50 text-green-800";
    if (status === "LIMITED")
      return "border-yellow-200 bg-yellow-50 text-yellow-800";
    if (status === "FULL") return "border-red-200 bg-red-50 text-red-800";
    if (status === "CANCELLED")
      return "border-orange-200 bg-orange-50 text-orange-800";
    if (status === "EXPIRED")
      return "border-slate-200 bg-slate-100 text-slate-600";
    return "border-slate-100 bg-white text-slate-400";
  };

  const badgeStyle = (status: string) => {
    if (status === "OPEN") return "bg-green-100 text-green-700";
    if (status === "FULL") return "bg-red-100 text-red-700";
    if (status === "CANCELLED") return "bg-orange-100 text-orange-700";
    if (status === "EXPIRED") return "bg-slate-100 text-slate-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const selectedSlots = selectedDate ? grouped[selectedDate] || [] : [];

  const changeMonth = (value: number) => {
    setMonthDate(
      new Date(monthDate.getFullYear(), monthDate.getMonth() + value, 1)
    );
    onSelectDate("");
  };

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-lg xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-blue-950">
                Monthly Slot Planner
              </h2>
              <p className="text-sm text-slate-500">
                Calendar view with availability and occupancy
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => changeMonth(-1)}
                className="rounded-xl border p-2 hover:bg-slate-50"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="min-w-36 text-center font-bold text-blue-950">
                {monthTitle}
              </span>

              <button
                onClick={() => changeMonth(1)}
                className="rounded-xl border p-2 hover:bg-slate-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-4 text-sm">
            <Legend color="bg-green-500" label="Open" />
            <Legend color="bg-yellow-500" label="Limited" />
            <Legend color="bg-red-500" label="Full" />
            <Legend color="bg-orange-500" label="Cancelled" />
            <Legend color="bg-slate-500" label="Expired" />
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-7 gap-3">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={`blank-${index}`} className="min-h-28" />;
              }

              const daySlots = grouped[date] || [];
              const stats = getStats(daySlots);
              const status = getStatus(daySlots);
              const isSelected = selectedDate === date;
              const isToday = todayKey === date;

              return (
                <button
                  key={date}
                  onClick={() => onSelectDate(date)}
                  className={`min-h-28 rounded-2xl border p-3 text-left transition hover:-translate-y-1 hover:shadow-md ${cardStyle(
                    status
                  )} ${isSelected ? "ring-2 ring-blue-300" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-black">
                        {new Date(date).getDate()}
                      </p>
                      <p className="text-[11px] font-semibold">
                        {new Date(date).toLocaleDateString("en-IN", {
                          month: "short",
                        })}
                      </p>
                    </div>

                    {isToday && (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700">
                        Today
                      </span>
                    )}
                  </div>

                  {daySlots.length > 0 ? (
                    <div className="mt-3 space-y-1 text-[11px]">
                      <p className="flex items-center gap-1">
                        <Ship size={12} /> {daySlots.length} slots
                      </p>
                      <p className="flex items-center gap-1">
                        <Users size={12} /> {stats.availableSeats} seats
                      </p>
                      <p className="font-bold">Occ: {stats.occupancy}%</p>
                      <p className="mt-1 rounded-full bg-white/70 px-2 py-1 text-center text-[10px] font-black">
                        {status}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-5 text-[11px] font-semibold">No slots</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-blue-950">Date Details</h2>
              <p className="text-sm text-slate-500">
                {selectedDate || "Select a date"}
              </p>
            </div>
            <CalendarDays className="text-blue-600" />
          </div>

          <div className="mt-5 space-y-4">
            {selectedSlots.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-slate-500">
                No slots found for selected date.
              </div>
            ) : (
              selectedSlots.map((slot) => {
                const schedule = slot.scheduleId;
                const boat = schedule?.boatId;
                const route = schedule?.routeId;

                const booked =
                  (slot.bookedOnlineSeats || 0) +
                  (slot.bookedOfflineSeats || 0) +
                  (slot.bookedEmergencySeats || 0);

                const available = Math.max((slot.totalSeats || 0) - booked, 0);
                const canShift = booked === 0;

                return (
                  <div key={slot._id} className="rounded-2xl border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-blue-950">
                        {boat?.boatName || "Boat"}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${badgeStyle(
                          slot.status
                        )}`}
                      >
                        {slot.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      {route?.sourceGhatId?.name || "Source"} →{" "}
                      {route?.destinationGhatId?.name || "Destination"}
                    </p>

                    <p className="mt-1 text-sm">
                      {schedule?.departureTime || "N/A"} -{" "}
                      {schedule?.arrivalTime || "N/A"}
                    </p>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="rounded-xl bg-slate-50 p-2">
                        <b>{slot.totalSeats}</b>
                        <p>Total</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-2">
                        <b>{booked}</b>
                        <p>Booked</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-2">
                        <b>{available}</b>
                        <p>Left</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <select
                        value={slot.status}
                        onChange={(e) =>
                          changeSlotStatus(
                            slot._id,
                            e.target.value as SlotStatus
                          )
                        }
                        className="rounded-lg border px-2 py-2 text-xs"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="FULL">FULL</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="EXPIRED">EXPIRED</option>
                      </select>

                      <button
                        onClick={() => setEditData(slot)}
                        className="rounded-lg bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setShiftData(slot)}
                        disabled={!canShift}
                        className="rounded-lg bg-purple-100 px-3 py-2 text-xs font-semibold text-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Shift
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <EditSlotModal
        slot={editData}
        onClose={() => setEditData(null)}
        onSave={editSlot}
      />

      <ShiftSlotModal
        slot={shiftData}
        onClose={() => setShiftData(null)}
        onShift={shiftSlot}
      />
    </>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}