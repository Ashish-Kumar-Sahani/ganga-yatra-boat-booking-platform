import { useNavigate } from "react-router-dom";
import { Star, Users, ShieldCheck, ArrowRight } from "lucide-react";

const boats = [
  {
    name: "Luxury Bajra Cruise",
    type: "LUXURY",
    seats: 30,
    price: 1500,
    rating: 4.9,
    description: "Premium large double-decker cruise boat suitable for Ganga Aarti ceremonies and group tours.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600",
  },
  {
    name: "Classic Motor Boat",
    type: "MOTOR",
    seats: 12,
    price: 600,
    rating: 4.8,
    description: "Medium-sized motorized boat, ideal for fast transit between ghats and early morning sunrise tours.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600",
  },
  {
    name: "Traditional Rowing Boat",
    type: "MANUAL",
    seats: 6,
    price: 300,
    rating: 4.7,
    description: "Traditional manual boat for a quiet, peaceful experience on the sacred river.",
    image: "https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?q=80&w=600",
  },
  {
    name: "River Water Taxi",
    type: "WATER_TAXI",
    seats: 10,
    price: 450,
    rating: 4.9,
    description: "High-speed modern commuter water taxi for punctual travels across distant ghats.",
    image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=600",
  },
];

export default function TopBoats() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
            Featured Ganga Boats
          </h2>
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            Choose from our government-inspected verified vessels
          </p>
        </div>

        <button
          onClick={() => navigate("/search-route")}
          className="flex items-center gap-2 rounded-xl bg-blue-800 px-6 py-3 font-bold text-white shadow-lg shadow-blue-800/10 hover:bg-blue-900 hover:shadow-blue-900/20 transition duration-200"
        >
          Check Route Availability
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {boats.map((boat) => (
          <div
            key={boat.name}
            className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group"
          >
            {/* Image section */}
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img
                src={boat.image}
                alt={boat.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-slate-800 shadow-sm">
                <Star size={12} className="fill-orange-400 text-orange-400" />
                {boat.rating}
              </span>
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 rounded-full bg-blue-800/90 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                {boat.type.replace("_", " ")}
              </span>
            </div>

            {/* Info details */}
            <div className="flex flex-1 flex-col p-5">
              <div className="flex-1 space-y-2">
                <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">
                  {boat.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  {boat.description}
                </p>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 pt-2 pb-4">
                  <span className="flex items-center gap-1">
                    <Users size={14} className="text-blue-600" />
                    Up to {boat.seats} passengers
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={14} className="text-green-600" />
                    Safety Equipped
                  </span>
                </div>
              </div>

              {/* Price & booking CTA */}
              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Est. fare
                  </p>
                  <h4 className="text-2xl font-black text-blue-800">
                    ₹{boat.price}
                    <span className="text-xs font-semibold text-slate-400">/hr</span>
                  </h4>
                </div>

                <button
                  onClick={() => navigate("/search-route")}
                  className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white hover:bg-orange-600 shadow-md shadow-orange-500/10 hover:shadow-orange-600/20 active:scale-[0.98] transition duration-150"
                >
                  Book Ride
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}