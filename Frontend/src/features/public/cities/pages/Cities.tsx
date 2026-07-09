import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Waves, Search, ArrowRight, ShieldCheck } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getCities } from "@/features/admin/cities/api/cityApi";
import type { City } from "@/features/admin/cities/types/city.types";

export default function Cities() {
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCities();
        setCities(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Cities fetch error:", err);
        setError("Unable to load cities. Please try again later.");
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.riverName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-4xl font-extrabold md:text-5xl">Explore Our Active Cities</h1>
            <p className="text-slate-300 font-medium">
              We connect safe, digital water transits across India's most heritage-rich river cities. Select a city to explore routes and boarding ghats.
            </p>
          </div>
        </section>

        {/* Search & Cities Grid */}
        <section className="mx-auto max-w-7xl px-6 py-12 w-full lg:px-12">
          {/* Search bar */}
          <div className="mx-auto -mt-20 mb-12 w-full max-w-2xl rounded-2xl bg-white p-4 shadow-xl border border-slate-100/50 flex items-center gap-3">
            <Search className="text-slate-400 shrink-0" size={20} />
            <input
              type="text"
              placeholder="Search by city name, state, or river..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-slate-800 font-semibold outline-none placeholder-slate-400 bg-transparent text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-xs font-bold text-slate-400 hover:text-slate-650"
              >
                Clear
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-3xl bg-slate-100 h-64" />
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
          ) : filteredCities.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-slate-100">
              <p className="font-bold text-slate-500">No active cities match your search query.</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCities.map((city) => (
                <div
                  key={city._id}
                  onClick={() => navigate(`/search-route?cityId=${city._id}`)}
                  className="group flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  {/* City banner cover */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src="/images/VaranasiBanner.png"
                      alt={city.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-5 flex items-center gap-1.5 text-white">
                      <MapPin size={18} className="text-orange-400" />
                      <span className="text-lg font-black tracking-tight">{city.name}</span>
                    </div>
                  </div>

                  {/* City Details */}
                  <div className="flex flex-1 flex-col p-6 space-y-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <span>State: {city.state || "Uttar Pradesh"}</span>
                        <span className="text-green-600 flex items-center gap-1">
                          <ShieldCheck size={14} /> Active
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-500">
                        Explore reliable, verified boat schedules operating on the {city.riverName || "Ganga"} river.
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                      <span className="flex items-center gap-1.5 text-sm font-bold text-blue-700">
                        <Waves size={16} />
                        {city.riverName || "Ganga River"}
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-orange-50 px-3 py-2 text-xs font-bold text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition duration-200">
                        Book Ride
                        <ArrowRight size={12} />
                      </span>
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