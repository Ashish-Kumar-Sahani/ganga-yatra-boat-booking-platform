import { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";
import type { Boat } from "../types/boat.types";
import { getCities } from "@/features/admin/cities/api/cityApi";
import type { City } from "@/features/admin/cities/types/city.types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  boat: Boat;
  onSave: (id: string, formData: FormData) => Promise<boolean>;
};

const boatTypes = ["MANUAL", "MOTOR", "LUXURY", "CRUISE", "WATER_TAXI"];
const boatStatuses = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"];

const getImageUrl = (imagePath?: string | null) => {
  if (!imagePath) return null;
  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:")
  ) {
    return imagePath;
  }
  const normalizedPath = imagePath.replace(/\\/g, "/");
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:7000/api";
  const baseDomain = apiBase.replace(/\/api\/?$/, "");
  const path = normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;
  return `${baseDomain}${path}`;
};

export default function BoatEditModal({ isOpen, onClose, boat, onSave }: Props) {
  const [cities, setCities] = useState<City[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Initialize form state
  const [formData, setFormData] = useState({
    boatName: "",
    boatNumber: "",
    cityId: "",
    boatType: "MOTOR",
    capacity: "",
    price: "",
    description: "",
    registrationNumber: "",
    insuranceNumber: "",
    permitNumber: "",
    isAvailable: "true",
    status: "PENDING",
  });

  useEffect(() => {
    if (isOpen) {
      // Fetch cities
      getCities()
        .then((data) => setCities(Array.isArray(data) ? data : []))
        .catch(console.error);

      // Extract city ID
      const cityId =
        typeof boat.cityId === "object" && boat.cityId !== null
          ? boat.cityId._id
          : boat.cityId || "";

      // Set initial values
      setFormData({
        boatName: boat.boatName || "",
        boatNumber: boat.boatNumber || "",
        cityId: cityId,
        boatType: boat.boatType || "MOTOR",
        capacity: String(boat.capacity || ""),
        price: String(boat.price || ""),
        description: boat.description || "",
        registrationNumber: boat.documents?.registrationNumber || "",
        insuranceNumber: boat.documents?.insuranceNumber || "",
        permitNumber: boat.documents?.permitNumber || "",
        isAvailable: boat.isAvailable ? "true" : "false",
        status: boat.status || "PENDING",
      });

      // Clear preview
      setImageFile(null);
      setPreview(getImageUrl(boat.image));
    }
  }, [isOpen, boat]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.boatName || !formData.boatNumber || !formData.cityId) {
      alert("Boat Name, Boat Number, and City are required");
      return;
    }

    if (!formData.capacity || Number(formData.capacity) <= 0) {
      alert("Valid capacity is required");
      return;
    }

    try {
      setSubmitting(true);

      const payload = new FormData();
      payload.append("boatName", formData.boatName.trim());
      payload.append("boatNumber", formData.boatNumber.trim().toUpperCase());
      payload.append("cityId", formData.cityId);
      payload.append("boatType", formData.boatType);
      payload.append("capacity", formData.capacity);
      payload.append("price", formData.price || "0");
      payload.append("description", formData.description.trim());
      payload.append("registrationNumber", formData.registrationNumber.trim());
      payload.append("insuranceNumber", formData.insuranceNumber.trim());
      payload.append("permitNumber", formData.permitNumber.trim());
      payload.append("isAvailable", formData.isAvailable);
      payload.append("status", formData.status);

      if (imageFile) {
        payload.append("image", imageFile);
      }

      const success = await onSave(boat._id, payload);
      if (success) {
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to save changes");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative my-8 w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl p-6 md:p-8 animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 hover:bg-slate-100 text-slate-400 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-black text-blue-950">Edit Boat Details</h2>
          <p className="text-sm font-semibold text-slate-400 mt-1">
            Update boat specifications, availability, and documents
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Main Form Fields */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Boat Name *
                  </label>
                  <input
                    type="text"
                    name="boatName"
                    value={formData.boatName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Boat Number *
                  </label>
                  <input
                    type="text"
                    name="boatNumber"
                    value={formData.boatNumber}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    City *
                  </label>
                  <select
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
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
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Boat Type *
                  </label>
                  <select
                    name="boatType"
                    value={formData.boatType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  >
                    {boatTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Capacity (Seats) *
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Price per hour (INR)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Availability
                  </label>
                  <select
                    name="isAvailable"
                    value={formData.isAvailable}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  >
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  >
                    {boatStatuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Tell clients about the boat (facilities, features...)"
                />
              </div>
            </div>

            {/* Side Image Upload Panel */}
            <div className="flex flex-col">
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Boat Image
              </label>
              <div className="flex-1 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 flex flex-col items-center justify-center text-center">
                {preview ? (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden group">
                    <img
                      src={preview}
                      alt="Boat Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/VaranasiBanner.png";
                      }}
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white p-3 text-slate-400 shadow-sm mb-2 border border-slate-100">
                    <Upload size={20} />
                  </div>
                )}

                <p className="text-[10px] font-bold text-slate-500 mt-2">
                  JPG, PNG or WEBP accepted
                </p>

                <label className="mt-3 inline-block rounded-xl bg-blue-50 hover:bg-blue-100 px-4 py-2 text-xs font-bold text-blue-700 cursor-pointer transition">
                  Browse File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Document Section */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
              Boat Documentation Numbers
            </h4>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Insurance Number
                </label>
                <input
                  type="text"
                  name="insuranceNumber"
                  value={formData.insuranceNumber}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Permit Number
                </label>
                <input
                  type="text"
                  name="permitNumber"
                  value={formData.permitNumber}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-200 hover:bg-slate-50 px-6 py-3 text-sm font-bold text-slate-600 transition disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm font-bold shadow-md shadow-blue-500/10 transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
