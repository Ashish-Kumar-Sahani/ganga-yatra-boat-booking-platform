import { useEffect, useState } from "react";

import StaffStats from "@/features/owner/staff/components/StaffStats";
import StaffTable from "@/features/owner/staff/components/StaffTable";
import {
  createStaff,
  getOwnerStaff,
} from "@/features/owner/staff/api/staffApi";
import { getMyBoats } from "@/features/owner/boats/api/boatApi";

export default function Staff() {
  const [staff, setStaff] = useState<any[]>([]);
  const [boats, setBoats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "DRIVER",
    assignedBoatId: "",
    status: "ACTIVE",
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const [staffData, boatData] = await Promise.all([
        getOwnerStaff(),
        getMyBoats(),
      ]);

      setStaff(Array.isArray(staffData) ? staffData : []);
      setBoats(Array.isArray(boatData) ? boatData : []);
    } catch (error) {
      console.error("Staff fetch error:", error);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!form.name || !form.phone || !form.email || !form.password) {
      alert("Name, phone, email, and password are required to create a staff account");
      return;
    }

    try {
      await createStaff({
        ...form,
        assignedBoatId: form.assignedBoatId || null,
      });

      setForm({
        name: "",
        phone: "",
        email: "",
        password: "",
        role: "DRIVER",
        assignedBoatId: "",
        status: "ACTIVE",
      });

      setShowForm(false);
      await fetchData();
      alert("Staff added successfully");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Staff create failed");
    }
  };

  return (
    <div className="space-y-6 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">
            Staff Management
          </h1>
          <p className="text-slate-500">
            Manage captains, drivers and boat managers
          </p>
        </div>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
        >
          {showForm ? "Close" : "Add Staff"}
        </button>
      </div>

      <StaffStats staff={staff} />

      {showForm && (
        <div className="rounded-3xl bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-bold text-blue-950">
            Add New Staff
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Name"
              value={form.name}
              onChange={(value) => setForm({ ...form, name: value })}
            />

            <Input
              label="Phone"
              value={form.phone}
              onChange={(value) => setForm({ ...form, phone: value })}
            />

            <Input
              label="Email"
              value={form.email}
              onChange={(value) => setForm({ ...form, email: value })}
            />

            <Input
              label="Password"
              value={form.password}
              onChange={(value) => setForm({ ...form, password: value })}
              type="password"
            />

            <Select
              label="Role"
              value={form.role}
              onChange={(value) => setForm({ ...form, role: value })}
              options={[
                { label: "Boat Manager", value: "MANAGER" },
                { label: "Driver", value: "DRIVER" },
                { label: "Captain", value: "CAPTAIN" },
                { label: "Helper", value: "HELPER" },
              ]}
            />

            <Select
              label="Assigned Boat"
              value={form.assignedBoatId}
              onChange={(value) =>
                setForm({ ...form, assignedBoatId: value })
              }
              options={[
                { label: "No Boat Assigned", value: "" },
                ...boats.map((boat) => ({
                  label: `${boat.boatName} (${boat.boatNumber})`,
                  value: boat._id,
                })),
              ]}
            />

            <Select
              label="Status"
              value={form.status}
              onChange={(value) => setForm({ ...form, status: value })}
              options={[
                { label: "Active", value: "ACTIVE" },
                { label: "Inactive", value: "INACTIVE" },
              ]}
            />
          </div>

          <button
            onClick={handleCreate}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
          >
            Save Staff
          </button>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl bg-white p-6 text-center font-semibold">
          Loading staff...
        </div>
      ) : (
        <StaffTable staff={staff} onRefresh={fetchData} />
      )}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border p-3"
      />
    </label>
  );
}

function Select({
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
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border p-3"
      >
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}