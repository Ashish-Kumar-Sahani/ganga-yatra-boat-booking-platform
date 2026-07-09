import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Navigation, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";
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
    }
  }, [cityId]);

  const handleSearch = () => {
    if (!cityId || !sourceGhatId || !destinationGhatId) {
      alert("Please select city, source and destination ghat");
      return;
    }

    if (sourceGhatId === destinationGhatId) {
      alert("Source and destination ghat cannot be same");
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
      alert("No route found for selected ghats");
      return;
    }

    navigate(
      `/search?cityId=${cityId}&sourceGhatId=${sourceGhatId}&destinationGhatId=${destinationGhatId}&routeId=${matchedRoute._id}&date=${date}`
    );
  };

  return (
    <main className="min-h-screen bg-[#f5f8ff] text-[#071b4d]">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 pt-28">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl">
          <h1 className="text-4xl font-black">Search Boat Route</h1>
          <p className="mt-2 text-slate-500">
            Select city, ghats and travel date to find available boats.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Select
              icon={<MapPin />}
              label="City"
              value={cityId}
              onChange={setCityId}
              options={cities}
            />

            <InputDate
              icon={<CalendarDays />}
              label="Travel Date"
              value={date}
              onChange={setDate}
            />

            <Select
              icon={<MapPin />}
              label="From Ghat"
              value={sourceGhatId}
              onChange={setSourceGhatId}
              options={ghats}
            />

            <Select
              icon={<Navigation />}
              label="To Ghat"
              value={destinationGhatId}
              onChange={setDestinationGhatId}
              options={ghats}
            />
          </div>

          <button
            onClick={handleSearch}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 font-bold text-white hover:bg-orange-600"
          >
            <Search size={20} />
            Search Available Boats
          </button>
        </div>
      </section>
    </main>
  );
}

function Select({ icon, label, value, onChange, options }: any) {
  return (
    <div>
      <label className="font-bold">{label}</label>
      <div className="mt-2 flex items-center gap-3 rounded-2xl border bg-white px-4 py-3">
        <span className="text-blue-700">{icon}</span>

        <select
          className="w-full bg-transparent outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select {label}</option>

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
    <div>
      <label className="font-bold">{label}</label>

      <div className="mt-2 flex items-center gap-3 rounded-2xl border bg-white px-4 py-3">
        <span className="text-blue-700">{icon}</span>

        <input
          type="date"
          className="w-full bg-transparent outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}