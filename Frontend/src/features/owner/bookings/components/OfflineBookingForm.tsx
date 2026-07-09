import { useMemo, useState } from "react";
import OfflineSlotPicker from "./OfflineSlotPicker";

import {
  createEmergencyBooking,
  createOfflineBooking,
} from "@/features/owner/bookings/api/bookingApi";

import type { Slot } from "@/features/owner/slots/types/slot.types";

type BookingMode = "OFFLINE" | "EMERGENCY";

type Props = {
  slots: Slot[];
  onSuccess: () => Promise<void>;
};

export default function OfflineBookingForm({ slots, onSuccess }: Props) {
  const [mode, setMode] = useState<BookingMode>("OFFLINE");
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const [formData, setFormData] = useState({
    slotId: "",
    passengerName: "",
    passengerPhone: "",
    seatsBooked: "1",
    reason: "",
  });

  const openSlots = useMemo(
    () => slots.filter((slot) => slot.status === "OPEN"),
    [slots]
  );

  const selectedSlot = openSlots.find((slot) => slot._id === formData.slotId);

  const availableOfflineSeats = selectedSlot
    ? Math.max(
        (selectedSlot.offlineSeats || 0) -
          (selectedSlot.bookedOfflineSeats || 0),
        0
      )
    : 0;

  const availableEmergencySeats = selectedSlot
    ? Math.max(
        (selectedSlot.emergencySeats || 0) -
          (selectedSlot.bookedEmergencySeats || 0),
        0
      )
    : 0;

  const availableSeats =
    mode === "OFFLINE" ? availableOfflineSeats : availableEmergencySeats;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setMode("OFFLINE");
    setSelectedDate("");
    setFormData({
      slotId: "",
      passengerName: "",
      passengerPhone: "",
      seatsBooked: "1",
      reason: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.slotId) {
      alert("Please select slot");
      return;
    }

    if (!formData.passengerName.trim() || !formData.passengerPhone.trim()) {
      alert("Please fill passenger details");
      return;
    }

    const seats = Number(formData.seatsBooked);

    if (!Number.isFinite(seats) || seats <= 0) {
      alert("Seats must be greater than 0");
      return;
    }

    if (seats > availableSeats) {
      alert(`Only ${availableSeats} ${mode.toLowerCase()} seats available`);
      return;
    }

    if (mode === "EMERGENCY" && !formData.reason.trim()) {
      alert("Emergency reason is required");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        slotId: formData.slotId,
        seatsBooked: seats,
        passengerName: formData.passengerName.trim(),
        passengerPhone: formData.passengerPhone.trim(),
      };

      if (mode === "OFFLINE") {
        await createOfflineBooking(payload);
      } else {
        await createEmergencyBooking({
          ...payload,
          reason: formData.reason.trim(),
        });
      }

      alert(`${mode} booking created successfully`);
      resetForm();
      await onSuccess();
    } catch (error: any) {
      alert(error?.response?.data?.message || `${mode} booking failed`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-8 shadow">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-blue-950">
            Create Offline / Emergency Booking
          </h2>
          <p className="text-sm text-slate-500">
            Walk-in booking aur urgent seat allocation ke liye
          </p>
        </div>

        <select
          value={mode}
          onChange={(e) => {
            setMode(e.target.value as BookingMode);
            setFormData((prev) => ({ ...prev, slotId: "", reason: "" }));
          }}
          className="rounded-xl border px-4 py-3 font-semibold"
        >
          <option value="OFFLINE">Offline Booking</option>
          <option value="EMERGENCY">Emergency Booking</option>
        </select>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <OfflineSlotPicker
            slots={openSlots}
            selectedDate={selectedDate}
            selectedSlotId={formData.slotId}
            onSelectDate={setSelectedDate}
            onSelectSlot={(slotId) =>
              setFormData((prev) => ({
                ...prev,
                slotId,
              }))
            }
          />
        </div>

        <InputField
          label="Passenger Name"
          name="passengerName"
          value={formData.passengerName}
          onChange={handleChange}
        />

        <InputField
          label="Passenger Phone"
          name="passengerPhone"
          value={formData.passengerPhone}
          onChange={handleChange}
        />

        <InputField
          label="Seats"
          name="seatsBooked"
          value={formData.seatsBooked}
          onChange={handleChange}
          type="number"
        />

        <div
          className={`rounded-xl p-4 ${
            mode === "OFFLINE" ? "bg-blue-50" : "bg-orange-50"
          }`}
        >
          <p className="text-sm text-slate-500">
            Available {mode === "OFFLINE" ? "Offline" : "Emergency"} Seats
          </p>
          <h3 className="mt-1 text-2xl font-bold text-blue-950">
            {formData.slotId ? availableSeats : 0}
          </h3>
        </div>

        {mode === "EMERGENCY" && (
          <div className="md:col-span-2">
            <InputField
              label="Emergency Reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Example: VIP request / urgent local need"
            />
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="submit"
          disabled={submitting}
          className={`rounded-xl px-6 py-3 font-semibold text-white disabled:opacity-50 ${
            mode === "OFFLINE" ? "bg-blue-600" : "bg-orange-600"
          }`}
        >
          {submitting ? "Creating..." : `Create ${mode} Booking`}
        </button>

        <button
          type="button"
          onClick={resetForm}
          className="rounded-xl border px-6 py-3"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  value: string;
  type?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full rounded-xl border p-3"
      />
    </div>
  );
}