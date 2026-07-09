import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CalendarDays, MapPin, Navigation, Search, Info } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getCities } from "@/features/admin/cities/api/cityApi";
import { getGhatsByCity } from "@/features/admin/ghats/api/ghatApi";
import { getRoutes } from "@/features/owner/routes/api/routeApi";

type City = {
  _id: string;
  name: string;
};

type Ghat = {
  _id: string;
  name: string;
};

export default function SearchRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [cities, setCities] = useState<City[]>([]);
  const [ghats, setGhats] = useState<Ghat[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);

  const [cityId, setCityId] = useState("");
  const [sourceGhatId, setSourceGhatId] = useState("");
  const [destinationGhatId, setDestinationGhatId] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    getCities().then(setCities).catch(console.error);
    getRoutes().then(setRoutes).catch(console.error);
  }, []);

  // Pre-fill query params from URL if navigated from other public pages
  useEffect(() => {
    const qCityId = searchParams.get("cityId") || "";
    const qSourceGhatId = searchParams.get("sourceGhatId") || "";
    if (qCityId) {
      setCityId(qCityId);
      getGhatsByCity(qCityId)
        .then((g) => {
          setGhats(g || []);
          if (qSourceGhatId) setSourceGhatId(qSourceGhatId);
        })
        .catch(console.error);
    }
  }, [searchParams]);

  useEffect(() => {
    if (cityId) {
      getGhatsByCity(cityId).then(setGhats).catch(console.error);
      setSourceGhatId("");
      setDestinationGhatId("");
    } else {
      setGhats([]);
    }
  }, [cityId]);

  const handleSearch = () => {
    if (!cityId || !sourceGhatId || !destinationGhatId || !date) {
      alert("Please select city, source ghat, destination ghat, and date.");
      return;
    }

    if (sourceGhatId === destinationGhatId) {
      alert("Source and destination ghats cannot be the same.");
      return;
    }

    const matchedRoute = routes.find((route: any) => {
      const sourceId =
        typeof route.sourceGhatId === "string"
          ? route.sourceGhatId
          : route.sourceGhatId?._id;

      const destinationId =
        typeof route.destinationGhatId === "string"
          ? route.destinationGhatId
          : route.destinationGhatId?._id;

      return sourceId === sourceGhatId && destinationId === destinationGhatId;
    });

    if (!matchedRoute) {
      alert("No active route found for the selected ghats.");
      return;
    }

    navigate(
      `/search?cityId=${cityId}&sourceGhatId=${sourceGhatId}&destinationGhatId=${destinationGhatId}&routeId=${matchedRoute._id}&date=${date}`
    );
  };

  return (
    <main className="min-h-screen bg-[#f8faff] text-[#071b4d] flex flex-col justify-between">
      <div>
        <Navbar />

        <section className="mx-auto max-w-4xl px-6 pt-32 pb-16">
          <div className="rounded-[2.5rem] bg-white p-8 md:p-12 shadow-xl border border-slate-100/50">
            <div className="space-y-3">
              <h1 className="text-3xl font-black text-slate-900 md:text-4xl">Search Boat Routes</h1>
              <p className="text-slate-500 font-semibold text-sm uppercase tracking-wider text-orange-500">
                Book safe rides across Ganga ghats
              </p>
              <p className="text-slate-400 text-sm">
                Select your city, boarding & destination ghats, and travel date to find verified boat operators.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <Select
                icon={<MapPin size={18} />}
                label="Select City"
                value={cityId}
                onChange={setCityId}
                options={cities}
              />

              <InputDate
                icon={<CalendarDays size={18} />}
                label="Travel Date"
                value={date}
                onChange={setDate}
              />

              <Select
                icon={<Navigation size={18} />}
                label="From Ghat (Boarding)"
                value={sourceGhatId}
                onChange={setSourceGhatId}
                options={ghats}
                disabled={!cityId}
              />

              <Select
                icon={<Navigation size={18} className="rotate-90" />}
                label="To Ghat (Destination)"
                value={destinationGhatId}
                onChange={setDestinationGhatId}
                options={ghats}
                disabled={!cityId}
              />
            </div>

            {/* Note box */}
            <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-blue-50 border border-blue-100 p-4 text-xs font-semibold text-blue-800">
              <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
              <span>
                Note: Public users can search and view boat slots. Initiating a book request will require account authentication. Logged-in customers will enjoy instant bookings.
              </span>
            </div>

            <button
              onClick={handleSearch}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-800 py-4 font-bold text-white shadow-lg shadow-blue-800/10 hover:bg-blue-900 hover:shadow-blue-900/25 active:scale-[0.99] transition duration-150"
            >
              <Search size={20} />
              Search Available Boats
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

function Select({ icon, label, value, onChange, options, disabled }: any) {
  return (
    <div className="space-y-2 text-left">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{label}</label>
      <div className={`flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 focus-within:border-blue-500 focus-within:bg-white transition ${disabled ? "opacity-60" : ""}`}>
        <span className="text-orange-500">{icon}</span>

        <select
          className="w-full bg-transparent font-semibold text-slate-800 outline-none text-sm disabled:cursor-not-allowed"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">Select Option</option>
          {options.map((item: any) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function InputDate({ icon, label, value, onChange }: any) {
  return (
    <div className="space-y-2 text-left">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{label}</label>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 focus-within:border-blue-500 focus-within:bg-white transition">
        <span className="text-orange-500">{icon}</span>

        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          className="w-full bg-transparent font-semibold text-slate-800 outline-none text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
