import { useState } from "react";
import type { Slot } from "@/features/owner/slots/types/slot.types";

type Props = {
  slot: Slot | null;
  onClose: () => void;
  onShift: (id: string, slotDate: string) => Promise<boolean>;
};

export default function ShiftSlotModal({ slot, onClose, onShift }: Props) {
  const [slotDate, setSlotDate] = useState(
    slot ? new Date(slot.slotDate).toISOString().split("T")[0] : ""
  );

  if (!slot) return null;

  const handleSubmit = async () => {
    if (!slotDate) {
      alert("Please select new date");
      return;
    }

    const success = await onShift(slot._id, slotDate);

    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-blue-950">Shift Slot Date</h2>

        <div className="mt-5">
          <label className="mb-1 block text-sm font-semibold">New Date</label>
          <input
            type="date"
            value={slotDate}
            onChange={(e) => setSlotDate(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border px-5 py-2">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-xl bg-purple-600 px-5 py-2 font-semibold text-white"
          >
            Shift Slot
          </button>
        </div>
      </div>
    </div>
  );
}