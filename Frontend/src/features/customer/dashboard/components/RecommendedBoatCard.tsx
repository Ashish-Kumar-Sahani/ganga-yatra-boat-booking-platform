import { Heart, Star, Users } from "lucide-react";
import type { RecommendedBoat } from "@/features/customer/dashboard/types/customerDashboard.types";

type Props = {
  boat: RecommendedBoat;
};

export default function RecommendedBoatCard({ boat }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
      <div className="relative">
        <img
          src={boat.image || "/images/VaranasiBanner.png"}
          alt={boat.boatName}
          className="h-36 w-full object-cover"
        />

        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-lg bg-slate-900/85 px-2 py-1 text-xs font-bold text-white">
          <Star size={13} className="fill-yellow-400 text-yellow-400" />
          {boat.rating || 4.5}
        </span>

        <button className="absolute right-3 top-3 rounded-full bg-white p-2 text-blue-700 shadow">
          <Heart size={17} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-black text-blue-950">{boat.boatName}</h3>

        <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1">
            <Users size={14} />
            {boat.capacity || 0} Seats
          </span>

          <span>{boat.boatType || "MOTOR"}</span>
        </div>

        <p className="mt-4 text-xl font-black text-blue-700">
          ₹{Number(boat.price || 100).toLocaleString("en-IN")}
          <span className="text-xs font-semibold text-slate-500"> /seat</span>
        </p>

        <button className="mt-4 w-full rounded-xl border border-blue-300 py-3 text-sm font-extrabold text-blue-700 hover:bg-blue-50">
          View Details
        </button>
      </div>
    </div>
  );
}