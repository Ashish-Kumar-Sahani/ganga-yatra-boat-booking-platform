import { CalendarCheck, Clock3, TicketCheck, Users } from "lucide-react";
import type { Slot } from "@/features/owner/slots/types/slot.types";

type Props = {
  slots?: Slot[];
};

export default function SlotStats({ slots = [] }: Props) {
  const safeSlots = Array.isArray(slots) ? slots : [];

  const bookedSeats = safeSlots.reduce(
    (sum, slot) =>
      sum +
      (slot.bookedOnlineSeats || 0) +
      (slot.bookedOfflineSeats || 0) +
      (slot.bookedEmergencySeats || 0),
    0
  );

  const totalSeats = safeSlots.reduce(
    (sum, slot) => sum + (slot.totalSeats || 0),
    0
  );

  const openSlots = safeSlots.filter((slot) => slot.status === "OPEN").length;

  const stats = [
    { title: "Total Slots", value: safeSlots.length, icon: Clock3 },
    { title: "Booked Seats", value: bookedSeats, icon: TicketCheck },
    { title: "Open Slots", value: openSlots, icon: CalendarCheck },
    { title: "Total Seats", value: totalSeats, icon: Users },
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