import { useEffect, useState } from "react";
import { getMyBoats } from "@/features/owner/boats/api/boatApi";
import { getOwnerRoutes } from "@/features/owner/routes/api/routeApi";
import { createSchedule, updateSchedule } from "../api/scheduleApi";

type Props = {
  open: boolean;
  editingSchedule?: any | null;
  onClose: () => void;
  onSuccess: () => Promise<void>;
};

export default function ScheduleFormModal({
  open,
  editingSchedule,
  onClose,
  onSuccess,
}: Props) {
  const [boats, setBoats] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    boatId: "",
    routeId: "",
    departureTime: "",
    arrivalTime: "",
    totalSeats: "",
    onlineSeats: "",
    offlineSeats: "",
    emergencySeats: "0",
    scheduleType: "DAILY",
    isActive: true,
  });

  useEffect(() => {
    if (!open) return;

    getMyBoats().then(setBoats).catch(console.error);
    getOwnerRoutes().then(setRoutes).catch(console.error);
  }, [open]);

  useEffect(() => {
    if (editingSchedule) {
      setForm({
        boatId: editingSchedule.boatId?._id || editingSchedule.boatId || "",
        routeId: editingSchedule.routeId?._id || editingSchedule.routeId || "",
        departureTime: editingSchedule.departureTime || "",
        arrivalTime: editingSchedule.arrivalTime || "",
        totalSeats: String(editingSchedule.totalSeats || ""),
        onlineSeats: String(editingSchedule.onlineSeats || ""),
        offlineSeats: String(editingSchedule.offlineSeats || ""),
        emergencySeats: String(editingSchedule.emergencySeats || 0),
        scheduleType: editingSchedule.scheduleType || "DAILY",
        isActive: Boolean(editingSchedule.isActive),
      });
    } else {
      setForm({
        boatId: "",
        routeId: "",
        departureTime: "",
        arrivalTime: "",
        totalSeats: "",
        onlineSeats: "",
        offlineSeats: "",
        emergencySeats: "0",
        scheduleType: "DAILY",
        isActive: true,
      });
    }
  }, [editingSchedule, open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "isActive" ? value === "true" : value,
    }));
  };

  const handleSubmit = async () => {
    const totalSeats = Number(form.totalSeats);
    const onlineSeats = Number(form.onlineSeats);
    const offlineSeats = Number(form.offlineSeats);
    const emergencySeats = Number(form.emergencySeats);

    if (!form.boatId || !form.routeId || !form.departureTime || !form.arrivalTime) {
      alert("Boat, route, departure and arrival time required");
      return;
    }

    if (onlineSeats + offlineSeats + emergencySeats !== totalSeats) {
      alert("Online + Offline + Emergency seats must equal total seats");
      return;
    }

    const payload = {
      boatId: form.boatId,
      routeId: form.routeId,
      departureTime: form.departureTime,
      arrivalTime: form.arrivalTime,
      totalSeats,
      onlineSeats,
      offlineSeats,
      emergencySeats,
      scheduleType: form.scheduleType,
      isActive: form.isActive,
    };

    try {
      setSubmitting(true);

      if (editingSchedule?._id) {
        await updateSchedule(editingSchedule._id, payload);
      } else {
        await createSchedule(payload);
      }

      await onSuccess();
      onClose();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Schedule save failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-950">
              {editingSchedule ? "Edit Schedule" : "Add Schedule"}
            </h2>
            <p className="text-sm text-slate-500">
              Create or update boat schedule
            </p>
          </div>

          <button onClick={onClose} className="rounded-xl bg-slate-100 px-4 py-2">
            Close
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Select label="Boat" name="boatId" value={form.boatId} onChange={handleChange}>
            <option value="">Select Boat</option>
            {boats.map((boat) => (
              <option key={boat._id} value={boat._id}>
                {boat.boatName} - {boat.boatNumber}
              </option>
            ))}
          </Select>

          <Select label="Route" name="routeId" value={form.routeId} onChange={handleChange}>
            <option value="">Select Route</option>
            {routes.map((route) => (
              <option key={route._id} value={route._id}>
                {route.sourceGhatId?.name || "Source"} →{" "}
                {route.destinationGhatId?.name || "Destination"}
              </option>
            ))}
          </Select>

          <Input label="Departure Time" name="departureTime" type="time" value={form.departureTime} onChange={handleChange} />
          <Input label="Arrival Time" name="arrivalTime" type="time" value={form.arrivalTime} onChange={handleChange} />
          <Input label="Total Seats" name="totalSeats" type="number" value={form.totalSeats} onChange={handleChange} />
          <Input label="Online Seats" name="onlineSeats" type="number" value={form.onlineSeats} onChange={handleChange} />
          <Input label="Offline Seats" name="offlineSeats" type="number" value={form.offlineSeats} onChange={handleChange} />
          <Input label="Emergency Seats" name="emergencySeats" type="number" value={form.emergencySeats} onChange={handleChange} />

          <Select label="Schedule Type" name="scheduleType" value={form.scheduleType} onChange={handleChange}>
            <option value="DAILY">DAILY</option>
            <option value="WEEKLY">WEEKLY</option>
            <option value="SPECIAL">SPECIAL</option>
          </Select>

          <Select label="Status" name="isActive" value={String(form.isActive)} onChange={handleChange}>
            <option value="true">ACTIVE</option>
            <option value="false">INACTIVE</option>
          </Select>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Schedule"}
          </button>

          <button onClick={onClose} className="rounded-xl border px-6 py-3">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input {...props} className="w-full rounded-xl border p-3" />
    </label>
  );
}

function Select({ label, children, ...props }: any) {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <select {...props} className="w-full rounded-xl border p-3">
        {children}
      </select>
    </label>
  );
}