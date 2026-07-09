import { Star, Users, ShieldCheck } from "lucide-react";

type Props = {
  name: string;
  image: string;
  price?: number;
  rating?: number;
  seats?: number;
  status?: string;
  onBook?: () => void;
};

export default function BoatCard({
  name,
  image,
  price,
  rating = 4.5,
  seats,
  status,
  onBook,
}: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
      <img src={image} alt={name} className="h-40 w-full object-cover" />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-slate-900">{name}</h3>

            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Star size={15} className="fill-yellow-400 text-yellow-400" />
              {rating}
            </div>
          </div>

          {status && (
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
              {status}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm font-semibold text-slate-500">
          {seats && (
            <span className="flex items-center gap-1">
              <Users size={15} />
              {seats} Seats
            </span>
          )}

          <span className="flex items-center gap-1">
            <ShieldCheck size={15} />
            Verified
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between">
          {price !== undefined && (
            <p className="text-xl font-extrabold text-blue-700">
              ₹{price.toLocaleString("en-IN")}
              <span className="text-xs text-slate-500"> /Seat</span>
            </p>
          )}

          {onBook && (
            <button
              onClick={onBook}
              className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white"
            >
              Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
}