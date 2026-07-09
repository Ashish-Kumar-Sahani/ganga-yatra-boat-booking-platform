import { MapPin } from "lucide-react";

type Props = {
  name: string;
  image: string;
  ghats: number;
  boats: number;
};

export default function CityCard({
  name,
  image,
  ghats,
  boats,
}: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1">
      <img
        src={image}
        alt={name}
        className="h-44 w-full object-cover"
      />

      <div className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <MapPin size={18} className="text-blue-600" />

          <h3 className="text-lg font-black text-slate-900">
            {name}
          </h3>
        </div>

        <div className="flex items-center justify-between text-sm font-semibold text-slate-500">
          <span>{ghats} Ghats</span>
          <span>{boats} Boats</span>
        </div>
      </div>
    </div>
  );
}