import type { StaffBoat } from "../types/boat.types";
import { toggleBoatAvailability } from "../api/boatApi";

type Props = {
  boats?: StaffBoat[];
  onRefresh?: () => Promise<void>;
};

export default function BoatTable({ boats = [], onRefresh }: Props) {
  const handleToggle = async (boatId: string) => {
    try {
      await toggleBoatAvailability(boatId);
      await onRefresh?.();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Availability update failed");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-4">Boat</th>
              <th>Number</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>City</th>
              <th>Status</th>
              <th>Availability</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {boats.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-500">
                  No boats found.
                </td>
              </tr>
            ) : (
              boats.map((boat) => (
                <tr key={boat._id} className="border-t hover:bg-slate-50">
                  <td className="p-4 font-semibold text-blue-950">
                    <div className="flex items-center gap-3">
                      <img
                        src={boat.image || "/images/VaranasiBanner.png"}
                        alt={boat.boatName}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                      {boat.boatName}
                    </div>
                  </td>

                  <td>{boat.boatNumber}</td>
                  <td>{boat.boatType}</td>
                  <td>{boat.capacity}</td>
                  <td>{boat.cityId?.name || "N/A"}</td>

                  <td>
                    <StatusBadge status={boat.status} />
                  </td>

                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        boat.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {boat.isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => handleToggle(boat._id)}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white"
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style =
    status === "APPROVED"
      ? "bg-green-100 text-green-700"
      : status === "PENDING"
      ? "bg-orange-100 text-orange-700"
      : status === "REJECTED"
      ? "bg-red-100 text-red-700"
      : "bg-slate-100 text-slate-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
      {status}
    </span>
  );
}