import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, Navigation, Search } from "lucide-react";
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

export default function SearchBox() {
  const navigate = useNavigate();

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
      alert("Please select City, Source Ghat, Destination Ghat, and Travel Date");
      return;
    }

    if (sourceGhatId === destinationGhatId) {
      alert("Source and Destination Ghats cannot be the same");
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
    <div className="mx-auto mt-8 w-full max-w-5xl rounded-3xl bg-white/95 p-6 shadow-2xl backdrop-blur-md border border-slate-100">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end text-left">
        {/* City Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
            <MapPin size={14} className="text-orange-500" />
            Select City
          </label>
          <select
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all"
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* From Ghat Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
            <Navigation size={14} className="text-orange-500" />
            From Ghat
          </label>
          <select
            value={sourceGhatId}
            disabled={!cityId}
            onChange={(e) => setSourceGhatId(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all disabled:opacity-60"
          >
            <option value="">Select Boarding</option>
            {ghats.map((ghat) => (
              <option key={ghat._id} value={ghat._id}>
                {ghat.name}
              </option>
            ))}
          </select>
        </div>

        {/* To Ghat Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
            <Navigation size={14} className="text-orange-500 rotate-90" />
            To Ghat
          </label>
          <select
            value={destinationGhatId}
            disabled={!cityId}
            onChange={(e) => setDestinationGhatId(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all disabled:opacity-60"
          >
            <option value="">Select Destination</option>
            {ghats.map((ghat) => (
              <option key={ghat._id} value={ghat._id}>
                {ghat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
            <CalendarDays size={14} className="text-orange-500" />
            Travel Date
          </label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-800 py-3.5 font-bold text-white shadow-lg shadow-blue-800/20 hover:bg-blue-900 hover:shadow-blue-900/30 transition duration-200 active:scale-[0.98]"
        >
          <Search size={18} />
          Find Boats
        </button>
      </div>
    </div>
  );
}