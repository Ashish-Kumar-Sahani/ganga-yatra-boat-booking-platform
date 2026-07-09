import { useState } from "react";
import type { Slot } from "@/features/owner/slots/types/slot.types";

type Props = {
  slot: Slot | null;
  onClose: () => void;
  onSave: (
    id: string,
    payload: Partial<Slot>
  ) => Promise<boolean>;
};

export default function EditSlotModal({ slot, onClose, onSave }: Props) {
  const [onlineSeats, setOnlineSeats] = useState(slot?.onlineSeats || 0);
  const [offlineSeats, setOfflineSeats] = useState(slot?.offlineSeats || 0);
  const [emergencySeats, setEmergencySeats] = useState(
    slot?.emergencySeats || 0
  );

  if (!slot) return null;

  const handleSubmit = async () => {
    const totalSeats =
      Number(onlineSeats) + Number(offlineSeats) + Number(emergencySeats);

    const success = await onSave(slot._id, {
      totalSeats,
      onlineSeats: Number(onlineSeats),
      offlineSeats: Number(offlineSeats),
      emergencySeats: Number(emergencySeats),
    });

    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-blue-950">Edit Slot Seats</h2>

        <div className="mt-5 grid gap-4">
          <Input label="Online Seats" value={onlineSeats} setValue={setOnlineSeats} />
          <Input label="Offline Seats" value={offlineSeats} setValue={setOfflineSeats} />
          <Input label="Emergency Seats" value={emergencySeats} setValue={setEmergencySeats} />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border px-5 py-2">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, setValue }: any) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full rounded-xl border px-4 py-3"
      />
    </div>
  );
}