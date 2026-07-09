import { useState } from "react";
import {
  CalendarPlus,
  Ship,
  MapPin,
  Clock,
  Save,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddSchedule() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    boatId: "",
    routeId: "",
    scheduleDate: "",
    startTime: "",
    endTime: "",
    pricePerSeat: "",
    totalSeats: "",
    status: "ACTIVE",
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    if (!form.boatId || !form.routeId || !form.scheduleDate || !form.startTime) {
      alert("Boat, route, date and start time required");
      return;
    }

    console.log("Schedule form:", form);
    alert("Frontend ready. Backend connect later.");
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Add Schedule
          </h1>
          <p className="text-sm font-semibold text-slate-500">
            Create boat schedule with route, time, seats and fare
          </p>
        </div>

        <button
          onClick={() => navigate("/owner/schedules")}
          className="flex w-fit items-center gap-2 rounded-xl border border-blue-100 bg-white px-5 py-3 text-sm font-bold text-slate-700"
        >
          <ArrowLeft size={18} />
          Back to Schedules
        </button>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-extrabold text-slate-900">
            <CalendarPlus size={20} className="text-blue-700" />
            Schedule Information
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <SelectBox
              label="Select Boat"
              value={form.boatId}
              onChange={(v) => handleChange("boatId", v)}
              options={[
                { label: "Luxury Boat", value: "luxury-boat" },
                { label: "Family Boat", value: "family-boat" },
                { label: "Deluxe Boat", value: "deluxe-boat" },
              ]}
            />

            <SelectBox
              label="Select Route"
              value={form.routeId}
              onChange={(v) => handleChange("routeId", v)}
              options={[
                { label: "Assi Ghat → Dashashwamedh", value: "assi-dashashwamedh" },
                { label: "Raj Ghat → Assi Ghat", value: "raj-assi" },
                { label: "Manikarnika → Panchganga", value: "manikarnika-panchganga" },
              ]}
            />

            <InputBox
              label="Schedule Date"
              type="date"
              value={form.scheduleDate}
              onChange={(v) => handleChange("scheduleDate", v)}
            />

            <InputBox
              label="Start Time"
              type="time"
              value={form.startTime}
              onChange={(v) => handleChange("startTime", v)}
            />

            <InputBox
              label="End Time"
              type="time"
              value={form.endTime}
              onChange={(v) => handleChange("endTime", v)}
            />

            <InputBox
              label="Price Per Seat"
              type="number"
              value={form.pricePerSeat}
              onChange={(v) => handleChange("pricePerSeat", v)}
              placeholder="500"
            />

            <InputBox
              label="Total Seats"
              type="number"
              value={form.totalSeats}
              onChange={(v) => handleChange("totalSeats", v)}
              placeholder="20"
            />

            <SelectBox
              label="Status"
              value={form.status}
              onChange={(v) => handleChange("status", v)}
              options={[
                { label: "Active", value: "ACTIVE" },
                { label: "Cancelled", value: "CANCELLED" },
                { label: "Completed", value: "COMPLETED" },
              ]}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white"
          >
            <Save size={18} />
            Save Schedule
          </button>
        </div>

        <div className="space-y-5">
          <InfoCard
            icon={<Ship size={22} />}
            title="Boat"
            value={form.boatId || "Not selected"}
          />

          <InfoCard
            icon={<MapPin size={22} />}
            title="Route"
            value={form.routeId || "Not selected"}
          />

          <InfoCard
            icon={<Clock size={22} />}
            title="Timing"
            value={
              form.startTime
                ? `${form.startTime} - ${form.endTime || "--"}`
                : "Not selected"
            }
          />

          <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-cyan-500 p-6 text-white shadow-lg">
            <p className="text-sm font-semibold text-blue-100">Schedule Tips</p>
            <h3 className="mt-2 text-xl font-extrabold">
              Keep enough gap between trips
            </h3>
            <p className="mt-2 text-sm text-blue-100">
              Later backend will auto-generate slots from this schedule.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function InputBox({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500"
      />
    </label>
  );
}

function SelectBox({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500"
      >
        <option value="">Select {label}</option>

        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
        {icon}
      </div>

      <p className="text-sm font-bold text-slate-500">{title}</p>
      <h3 className="mt-2 break-words text-lg font-extrabold text-slate-900">
        {value}
      </h3>
    </div>
  );
}