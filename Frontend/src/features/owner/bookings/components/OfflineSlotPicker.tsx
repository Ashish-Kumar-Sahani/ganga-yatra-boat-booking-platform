import { useMemo } from "react";
import type { Slot } from "@/features/owner/slots/types/slot.types";
import { formatLocalDate, getLocalDateKey } from "@/utils/dateKey";

type Props = {
  slots: Slot[];
  selectedDate: string;
  selectedSlotId: string;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slotId: string) => void;
};

export default function OfflineSlotPicker({
  slots,
  selectedDate,
  selectedSlotId,
  onSelectDate,
  onSelectSlot,
}: Props) {
  const grouped = useMemo(() => {
    return slots.reduce<Record<string, Slot[]>>((acc, slot) => {
      const key = getLocalDateKey(slot.slotDate);
      if (!acc[key]) acc[key] = [];
      acc[key].push(slot);
      return acc;
    }, {});
  }, [slots]);

  const dates = Object.keys(grouped).sort();
  const selectedSlots = selectedDate ? grouped[selectedDate] || [] : [];

  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-3 text-sm font-bold text-blue-950">
          Select Available Date
        </h3>

        <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-7">
          {dates.map((date) => {
            const daySlots = grouped[date];

            const offlineLeft = daySlots.reduce(
              (sum, slot) =>
                sum +
                Math.max(
                  (slot.offlineSeats || 0) - (slot.bookedOfflineSeats || 0),
                  0
                ),
              0
            );

            const emergencyLeft = daySlots.reduce(
              (sum, slot) =>
                sum +
                Math.max(
                  (slot.emergencySeats || 0) -
                    (slot.bookedEmergencySeats || 0),
                  0
                ),
              0
            );

            return (
              <button
                type="button"
                key={date}
                onClick={() => {
                  onSelectDate(date);
                  onSelectSlot("");
                }}
                className={`rounded-2xl border p-4 text-left transition hover:shadow ${
                  selectedDate === date
                    ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                    : "bg-white"
                }`}
              >
                <p className="text-lg font-black text-blue-950">
                  {new Date(date).getDate()}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(date).toLocaleDateString("en-IN", {
                    month: "short",
                  })}
                </p>

                <div className="mt-3 text-xs">
                  <p>Slots: {daySlots.length}</p>
                  <p>Offline: {offlineLeft}</p>
                  <p>Emergency: {emergencyLeft}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div>
          <h3 className="mb-3 text-sm font-bold text-blue-950">
            Select Slot - {formatLocalDate(selectedDate)}
          </h3>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {selectedSlots.map((slot) => {
              const schedule = slot.scheduleId;
              const boat = schedule?.boatId;
              const route = schedule?.routeId;

              const offlineLeft = Math.max(
                (slot.offlineSeats || 0) - (slot.bookedOfflineSeats || 0),
                0
              );

              const emergencyLeft = Math.max(
                (slot.emergencySeats || 0) - (slot.bookedEmergencySeats || 0),
                0
              );

              return (
                <button
                  type="button"
                  key={slot._id}
                  onClick={() => onSelectSlot(slot._id)}
                  className={`rounded-2xl border p-4 text-left transition hover:shadow ${
                    selectedSlotId === slot._id
                      ? "border-green-600 bg-green-50 ring-2 ring-green-100"
                      : "bg-white"
                  }`}
                >
                  <h4 className="font-bold text-blue-950">
                    {boat?.boatName || "Boat"}
                  </h4>

                  <p className="mt-1 text-sm text-slate-600">
                    {route?.sourceGhatId?.name || "Source"} →{" "}
                    {route?.destinationGhatId?.name || "Destination"}
                  </p>

                  <p className="mt-1 text-sm">
                    {schedule?.departureTime} - {schedule?.arrivalTime}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="rounded-xl bg-blue-50 p-2">
                      <b>{offlineLeft}</b>
                      <p>Offline</p>
                    </div>
                    <div className="rounded-xl bg-orange-50 p-2">
                      <b>{emergencyLeft}</b>
                      <p>Emergency</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}