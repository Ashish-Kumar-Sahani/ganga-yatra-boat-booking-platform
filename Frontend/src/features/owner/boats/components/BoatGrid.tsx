import BoatCard from "./BoatCard";
import type { Boat } from "@/features/owner/boats/types/boat.types";

type Props = {
  boats: Boat[];
  onEdit: (boat: Boat) => void;
  onDelete: (id: string) => void;
};

export default function BoatGrid({ boats, onEdit, onDelete }: Props) {
  return (
    <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {boats.map((boat) => (
        <BoatCard
          key={boat._id || (boat as any).id}
          boat={boat}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}