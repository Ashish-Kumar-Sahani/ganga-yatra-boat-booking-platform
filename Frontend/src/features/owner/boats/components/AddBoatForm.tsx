import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createBoat } from "@/features/owner/boats/api/boatApi";
import BoatImageUpload from "./BoatImageUpload";

import { getCities } from "@/features/admin/cities/api/cityApi";
import type { City } from "@/features/admin/cities/types/city.types";

const boatTypes = ["MANUAL", "MOTOR", "LUXURY", "CRUISE", "WATER_TAXI"];

export default function AddBoatForm() {
  const navigate = useNavigate();

  const [cities, setCities] = useState<City[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    cityId: "",
    boatName: "",
    boatNumber: "",
    boatType: "MOTOR",
    capacity: "",
    registrationNumber: "",
    insuranceNumber: "",
    permitNumber: "",
  });

  useEffect(() => {
    getCities()
      .then((data) => setCities(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.cityId || !formData.boatName || !formData.boatNumber) {
      alert("City, boat name and boat number are required");
      return;
    }

    if (!formData.capacity || Number(formData.capacity) <= 0) {
      alert("Valid capacity required");
      return;
    }

    try {
      setSubmitting(true);

      const payload = new FormData();
      payload.append("cityId", formData.cityId);
      payload.append("boatName", formData.boatName.trim());
      payload.append("boatNumber", formData.boatNumber.trim().toUpperCase());
      payload.append("boatType", formData.boatType);
      payload.append("capacity", formData.capacity);
      payload.append("registrationNumber", formData.registrationNumber);
      payload.append("insuranceNumber", formData.insuranceNumber);
      payload.append("permitNumber", formData.permitNumber);

      if (imageFile) {
        payload.append("image", imageFile);
      }

      await createBoat(payload);

      alert("Boat added successfully");
      navigate("/owner/boats");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Boat creation failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-8 shadow">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Boat Name"
              name="boatName"
              value={formData.boatName}
              onChange={handleChange}
              required
            />

            <InputField
              label="Boat Number"
              name="boatNumber"
              value={formData.boatNumber}
              onChange={handleChange}
              required
            />

            <div>
              <label className="mb-2 block text-sm font-semibold">City</label>
              <select
                name="cityId"
                value={formData.cityId}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
                required
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Boat Type
              </label>
              <select
                name="boatType"
                value={formData.boatType}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              >
                {boatTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <InputField
              label="Capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              type="number"
              required
            />

            <InputField
              label="Permit Number"
              name="permitNumber"
              value={formData.permitNumber}
              onChange={handleChange}
            />

            <InputField
              label="Registration Number"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
            />

            <InputField
              label="Insurance Number"
              name="insuranceNumber"
              value={formData.insuranceNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <BoatImageUpload preview={preview} onChange={handleImageChange} />
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Boat"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/owner/boats")}
          className="rounded-xl border px-6 py-3"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

type InputProps = {
  label: string;
  name: string;
  value: string;
  type?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: InputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        className="w-full rounded-xl border p-3"
      />
    </div>
  );
}