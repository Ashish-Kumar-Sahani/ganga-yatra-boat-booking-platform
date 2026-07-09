import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, Search, Anchor, ShieldCheck } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getGhats } from "@/features/admin/ghats/api/ghatApi";
import { getCities } from "@/features/admin/cities/api/cityApi";
import type { City } from "@/features/admin/cities/types/city.types";

export default function Ghats() {
  const navigate = useNavigate();

  const [ghats, setGhats] = useState<any[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [ghatData, cityData] = await Promise.all([getGhats(), getCities()]);
        setGhats(Array.isArray(ghatData) ? ghatData : []);
        setCities(Array.isArray(cityData) ? cityData : []);
      } catch (err: any) {
        console.error("Ghats fetch error:", err);
        setError("Unable to load ghats. Please try again later.");
        setGhats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredGhats = ghats.filter((ghat) => {
    const matchesSearch = ghat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCityId ? (ghat.cityId?._id === selectedCityId) : true;
    return matchesSearch && matchesCity;
  });

  return (
    <main className="min-h-screen bg-[#f8faff] text-[#071b4d] flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Hero Header */}
        <section
          className="relative flex h-[320px] w-full flex-col items-center justify-center bg-cover bg-center py-12 px-6 text-center text-white"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(3, 15, 41, 0.8), rgba(5, 23, 62, 0.9)), url('/images/VaranasiBanner.png')`,
          }}
        >
          <div className="relative z-10 space-y-4 max-w-3xl pt-12">
            <h1 className="text-4xl font-extrabold md:text-5xl">Explore Sacred Ghats</h1>
            <p className="text-slate-300 font-medium">
              Discover and navigate boarding points across the riverbanks. We standardise transits to ensure safety and comfort.
            </p>
          </div>
        </section>

        {/* Filter Controls & Cards Grid */}
        <section className="mx-auto max-w-7xl px-6 py-12 w-full lg:px-12">
          {/* Controls Bar */}
          <div className="mx-auto -mt-20 mb-12 w-full max-w-4xl rounded-2xl bg-white p-5 shadow-xl border border-slate-100/50 grid gap-4 md:grid-cols-2">
            {/* Search Input */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
              <Search className="text-slate-400 shrink-0" size={18} />
              <input
                type="text"
                placeholder="Search by ghat name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-slate-800 font-semibold outline-none placeholder-slate-400 bg-transparent text-sm"
              />
            </div>

            {/* City Dropdown Filter */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
              <MapPin className="text-orange-500 shrink-0" size={18} />
              <select
                value={selectedCityId}
                onChange={(e) => setSelectedCityId(e.target.value)}
                className="w-full font-semibold text-slate-700 bg-transparent outline-none text-sm"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-3xl bg-slate-100 h-72" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl bg-red-50 border border-red-100 p-8 text-center shadow-sm">
              <p className="font-bold text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
              >
                Retry
              </button>
            </div>
          ) : filteredGhats.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-slate-100">
              <p className="font-bold text-slate-500">No ghats match your search/filter criteria.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredGhats.map((ghat) => (
                <div
                  key={ghat._id}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300"
                >
                  {/* Photo cover */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=700"
                      alt={ghat.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-black text-slate-800 shadow-sm border border-white">
                      <Anchor size={12} className="text-blue-800" />
                      ACTIVE
                    </span>
                  </div>

                  {/* Ghat info details */}
                  <div className="flex flex-1 flex-col p-5 space-y-4">
                    <div className="flex-1 space-y-2">
                      <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                        {ghat.name}
                      </h2>

                      <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <MapPin size={14} className="text-orange-500 shrink-0" />
                        <span>{ghat.cityId?.name || "Varanasi"}</span>
                      </p>
                    </div>

                    <div className="border-t pt-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                        <ShieldCheck size={14} /> Boarding Ready
                      </span>

                      <button
                        onClick={() =>
                          navigate(
                            `/search-route?cityId=${ghat.cityId?._id || ""}&sourceGhatId=${ghat._id}`
                          )
                        }
                        className="flex items-center gap-1 rounded-xl bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-750 hover:bg-blue-600 hover:text-white transition duration-200"
                      >
                        <Navigation size={12} />
                        View Routes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
}