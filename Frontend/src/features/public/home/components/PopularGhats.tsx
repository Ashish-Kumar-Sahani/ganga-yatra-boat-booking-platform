import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Anchor } from "lucide-react";
import { getGhats } from "@/features/admin/ghats/api/ghatApi";

export default function PopularGhats() {
  const navigate = useNavigate();
  const [ghats, setGhats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGhats()
      .then((data) => {
        setGhats(Array.isArray(data) ? data.slice(0, 5) : []);
      })
      .catch((err) => {
        console.error("Ghats fetch error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 flex items-end justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
            Popular Varanasi Ghats
          </h2>
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            Explore the spiritual banks of the Ganges
          </p>
        </div>

        <button
          onClick={() => navigate("/ghats")}
          className="rounded-xl border border-blue-700/20 px-5 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-50 transition duration-200"
        >
          View All Ghats
        </button>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-3xl bg-slate-100 h-64" />
          ))}
        </div>
      ) : ghats.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm border border-slate-100">
          <p className="font-bold text-slate-500">No ghats available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {ghats.map((ghat) => (
            <div
              key={ghat._id}
              className="group overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-40 overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=600"
                  alt={ghat.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              <div className="p-4 space-y-3">
                <h3 className="font-extrabold text-slate-900 line-clamp-1 group-hover:text-blue-700 transition-colors">
                  {ghat.name}
                </h3>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <MapPin size={14} className="text-orange-500 shrink-0" />
                  <span>{ghat.cityId?.name || "Varanasi"}</span>
                </div>

                <button
                  onClick={() => navigate(`/search-route?sourceGhatId=${ghat._id}&cityId=${ghat.cityId?._id || ""}`)}
                  className="mt-1 flex w-full items-center justify-center gap-1 rounded-xl bg-slate-50 py-2 text-xs font-bold text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition duration-200"
                >
                  <Anchor size={12} />
                  Book From Ghat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}