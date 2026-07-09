import type { RecommendedBoat } from "@/features/customer/dashboard/types/customerDashboard.types";
import RecommendedBoatCard from "./RecommendedBoatCard";

type Props = {
  boats?: RecommendedBoat[];
};

export default function RecommendedBoats({ boats = [] }: Props) {
  return (
    <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-black text-blue-950">
          Recommended for You
        </h2>
        <button className="text-sm font-bold text-blue-700">View All</button>
      </div>

      {boats.length === 0 ? (
        <p className="text-sm font-semibold text-slate-500">
          No recommended boats found.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {boats.map((boat) => (
            <RecommendedBoatCard key={boat._id} boat={boat} />
          ))}
        </div>
      )}
    </section>
  );
}