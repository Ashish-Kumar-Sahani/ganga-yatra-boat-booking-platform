import type { Boat } from "@/features/owner/boats/types/boat.types";
import { useBoatStore } from "@/features/owner/boats/store/boatStore";

type Props = {
  boat: Boat;
  onEdit: (boat: Boat) => void;
  onDelete: (id: string) => void;
};

const getImageUrl = (imagePath?: string | null) => {
  if (!imagePath) return "/images/VaranasiBanner.png";
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

export default function BoatCard({ boat, onEdit, onDelete }: Props) {
  const { toggleAvailability } = useBoatStore();

  const handleDelete = () => {
    const boatId = boat._id || (boat as any).id;
    if (!boatId) {
      alert("Boat ID missing");
      return;
    }
    onDelete(boatId);
  };

  const handleToggleAvailability = async () => {
    const boatId = boat._id || (boat as any).id;
    if (!boatId) {
      alert("Boat ID missing");
      return;
    }
    await toggleAvailability(boatId);
  };

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 hover:shadow-md transition duration-300">
      <img
        src={getImageUrl(boat.image)}
        alt={boat.boatName}
        onError={(e) => {
          e.currentTarget.src = "/images/VaranasiBanner.png";
        }}
        className="h-44 w-full rounded-2xl object-cover"
      />

      <div className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-blue-950">
              {boat.boatName || "Unnamed Boat"}
            </h3>
            <p className="text-sm text-slate-500 font-semibold mt-0.5">
              {boat.boatNumber || "No Number"}
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            {boat.boatType}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-slate-500 font-medium">Capacity</p>
            <b className="text-slate-900">{boat.capacity} Seats</b>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-slate-500 font-medium">Availability</p>
            <b className={boat.isAvailable ? "text-green-600" : "text-red-600"}>
              {boat.isAvailable ? "Available" : "Unavailable"}
            </b>
          </div>
        </div>

        {boat.price !== undefined && boat.price > 0 && (
          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm">
            <p className="text-slate-500 font-medium">Price per hour</p>
            <b className="text-slate-900">₹{boat.price}</b>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span
            className={`rounded-lg px-3 py-1 text-xs font-bold ${
              boat.status === "APPROVED"
                ? "bg-green-100 text-green-700"
                : boat.status === "PENDING"
                ? "bg-yellow-100 text-yellow-700"
                : boat.status === "REJECTED"
                ? "bg-red-100 text-red-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {boat.status}
          </span>

          <span
            className={`rounded-lg px-3 py-1 text-xs font-bold ${
              boat.permitVerified
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {boat.permitVerified ? "Permit Verified" : "Permit Pending"}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <button
            onClick={handleToggleAvailability}
            className={`rounded-xl px-2 py-2 text-xs font-bold shadow-sm transition cursor-pointer ${
              boat.isAvailable
                ? "bg-orange-50 hover:bg-orange-100 text-orange-700"
                : "bg-green-50 hover:bg-green-100 text-green-700"
            }`}
          >
            {boat.isAvailable ? "Disable" : "Enable"}
          </button>

          <button
            onClick={() => onEdit(boat)}
            className="rounded-xl bg-blue-50 hover:bg-blue-100 px-2 py-2 text-xs font-bold text-blue-700 shadow-sm transition cursor-pointer"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="rounded-xl bg-red-50 hover:bg-red-100 px-2 py-2 text-xs font-bold text-red-700 shadow-sm transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}