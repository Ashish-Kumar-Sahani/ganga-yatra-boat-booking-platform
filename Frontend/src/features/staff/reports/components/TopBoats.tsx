import type { TopBoat } from "../types/report.types";

interface Props {
  boats: TopBoat[];
}

export default function TopBoats({
  boats,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <h2 className="text-xl font-bold mb-4">
        Top Boats
      </h2>

      {boats.map((boat) => (
        <div
          key={boat.boatName}
          className="flex justify-between border-b py-3"
        >
          <span>{boat.boatName}</span>

          <span>
            ₹{boat.revenue}
          </span>
        </div>
      ))}
    </div>
  );
}