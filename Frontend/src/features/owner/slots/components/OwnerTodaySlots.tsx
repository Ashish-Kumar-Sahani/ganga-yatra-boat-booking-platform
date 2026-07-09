import { useEffect, useState } from "react";
import { getOwnerSlots } from "../api/slotApi";
import type { Slot } from "../types/slot.types";
import { getLocalDateKey } from "@/utils/dateKey";

const toNum = (value: unknown) => Number(value || 0);

export default function OwnerTodaySlots() {
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    getOwnerSlots()
      .then((data) => setSlots(Array.isArray(data) ? data : []))
      .catch(() => setSlots([]));
  }, []);

  const todayKey = getLocalDateKey(new Date());

  const todaySlots = slots.filter(
    (slot) => getLocalDateKey(slot.slotDate) === todayKey
  );

  return (
    <div className="mt-5 rounded-2xl bg-white p-6 shadow">
      <h2 className="text-lg font-bold text-blue-950">Today's Slots</h2>

      <div className="mt-5 overflow-x-auto">
        {todaySlots.length === 0 ? (
          <p className="text-sm text-slate-500">No slots found for today.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-3">Boat</th>
                <th>Route</th>
                <th>Time</th>
                <th>Booked</th>
                <th>Available</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {todaySlots.map((slot) => {
                const schedule = slot.scheduleId;
                const boat = schedule?.boatId;
                const route = schedule?.routeId;

                const bookedOnline = toNum(slot.bookedOnlineSeats);
                const bookedOffline = toNum(slot.bookedOfflineSeats);
                const bookedEmergency = toNum(slot.bookedEmergencySeats);

                const booked = bookedOnline + bookedOffline + bookedEmergency;
                const totalSeats = toNum(slot.totalSeats);
                const available = Math.max(totalSeats - booked, 0);

                return (
                  <tr key={slot._id} className="border-b last:border-0">
                    <td className="py-3 font-semibold">
                      {boat?.boatName || "N/A"}
                    </td>

                    <td>
                      {route?.sourceGhatId?.name || "N/A"} →{" "}
                      {route?.destinationGhatId?.name || "N/A"}
                    </td>

                    <td>
                      {schedule?.departureTime || "N/A"} -{" "}
                      {schedule?.arrivalTime || "N/A"}
                    </td>

                    <td>
                      <b>{booked}</b>
                      <p className="text-xs text-slate-500">
                        O:{bookedOnline} / F:{bookedOffline} / E:{bookedEmergency}
                      </p>
                    </td>

                    <td>
                      <b>{available}</b>
                      <p className="text-xs text-slate-500">
                        Total: {totalSeats}
                      </p>
                    </td>

                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          slot.status === "OPEN"
                            ? "bg-green-100 text-green-700"
                            : slot.status === "FULL"
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {slot.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}