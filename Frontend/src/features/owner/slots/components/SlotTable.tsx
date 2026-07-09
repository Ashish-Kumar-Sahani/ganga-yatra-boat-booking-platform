import { useState } from "react";
import type { Slot, SlotStatus } from "@/features/owner/slots/types/slot.types";
import { useSlotStore } from "@/features/owner/slots/store/slotStore";
import EditSlotModal from "./EditSlotModal";
import ShiftSlotModal from "./ShiftSlotModal";

type Props = {
  slots?: Slot[];
  onViewPassengers?: (slotId: string) => void | Promise<void>;
};

export default function SlotTable({
  slots = [],
  onViewPassengers,
}: Props) {
  const { changeSlotStatus, editSlot, shiftSlot } = useSlotStore();

  const [editData, setEditData] = useState<Slot | null>(null);
  const [shiftData, setShiftData] = useState<Slot | null>(null);

  const safeSlots = Array.isArray(slots) ? slots : [];

  return (
    <>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow">
        <table className="w-full min-w-[1100px]">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Slot ID</th>
              <th>Boat</th>
              <th>Route</th>
              <th>Date</th>
              <th>Time</th>
              <th>Total</th>
              <th>Online</th>
              <th>Offline</th>
              <th>Booked</th>
              <th>Remaining</th>
              <th>Status</th>
              <th>Manage</th>
            </tr>
          </thead>

          <tbody>
            {safeSlots.length === 0 ? (
              <tr>
                <td colSpan={12} className="p-6 text-center text-slate-500">
                  No slots found
                </td>
              </tr>
            ) : (
              safeSlots.map((slot) => {
                const schedule = slot.scheduleId;
                const boat = schedule?.boatId;
                const route = schedule?.routeId;

                const booked =
                  (slot.bookedOnlineSeats || 0) +
                  (slot.bookedOfflineSeats || 0) +
                  (slot.bookedEmergencySeats || 0);

                const remaining = Math.max((slot.totalSeats || 0) - booked, 0);
                const canShift = booked === 0;

                return (
                  <tr key={slot._id} className="border-t hover:bg-slate-50">
                    <td className="p-4 font-semibold text-blue-950">
                      {slot._id.slice(-6)}
                    </td>

                    <td>{boat?.boatName || "N/A"}</td>

                    <td>
                      {route?.sourceGhatId?.name || "N/A"} →{" "}
                      {route?.destinationGhatId?.name || "N/A"}
                    </td>

                    <td>{new Date(slot.slotDate).toLocaleDateString("en-IN")}</td>

                    <td>
                      {schedule?.departureTime || "N/A"} -{" "}
                      {schedule?.arrivalTime || "N/A"}
                    </td>

                    <td>{slot.totalSeats}</td>
                    <td>{slot.onlineSeats}</td>
                    <td>{slot.offlineSeats}</td>
                    <td>{booked}</td>
                    <td>{remaining}</td>

                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          slot.status === "OPEN"
                            ? "bg-green-100 text-green-700"
                            : slot.status === "FULL"
                            ? "bg-red-100 text-red-700"
                            : slot.status === "EXPIRED"
                            ? "bg-slate-100 text-slate-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {slot.status}
                      </span>
                    </td>

                    <td>
                      <div className="flex flex-wrap gap-2">
                        <select
                          value={slot.status}
                          onChange={(e) =>
                            changeSlotStatus(slot._id, e.target.value as SlotStatus)
                          }
                          className="rounded-lg border px-2 py-1 text-xs"
                        >
                          <option value="OPEN">OPEN</option>
                          <option value="FULL">FULL</option>
                          <option value="CANCELLED">CANCELLED</option>
                          <option value="EXPIRED">EXPIRED</option>
                        </select>

                        <button
                          onClick={() => setEditData(slot)}
                          className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setShiftData(slot)}
                          disabled={!canShift}
                          className="rounded-lg bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Shift
                        </button>
                        <button
  onClick={() => onViewPassengers?.(slot._id)}
  className="rounded-lg bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700"
>
  Passengers
</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
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