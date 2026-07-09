import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapPin, Navigation, CalendarDays, Users, Search, Ship, Clock, AlertCircle } from "lucide-react";
import { getCities } from "@/features/admin/cities/api/cityApi";
import { getGhatsByCity } from "@/features/admin/ghats/api/ghatApi";
import { searchCustomerTrips } from "@/features/customer/dashboard/api/customerApi";

type City = {
  _id: string;
  name: string;
};

type Ghat = {
  _id: string;
  name: string;
};

// Safe normalizer to parse new and legacy formats seamlessly
const normalizeRides = (rawResponse: any): any[] => {
  if (!rawResponse) return [];
  const list = Array.isArray(rawResponse)
    ? rawResponse
    : (rawResponse.data || rawResponse.rides || rawResponse.results || rawResponse.schedules || []);

  return list.map((item: any) => {
    const boat = item.boat || item.schedule?.boatId || item.boatId;
    const route = item.route || item.schedule?.routeId || item.routeId;
    const departureTime = item.departureTime || item.schedule?.departureTime || "";
    const arrivalTime = item.arrivalTime || item.schedule?.arrivalTime || "";
    const availableSeats = typeof item.availableSeats === "number" ? item.availableSeats : (item.availableOnlineSeats ?? item.onlineSeats ?? 0);
    const totalSeats = item.totalSeats ?? item.schedule?.totalSeats ?? 0;
    const baseFare = item.baseFare ?? route?.baseFare ?? 0;
    const slotId = item.slotId ?? item._id;
    const scheduleId = item.scheduleId ?? item.schedule?._id;

    return {
      slotId,
      scheduleId,
      boat,
      route,
      departureTime,
      arrivalTime,
      availableSeats,
      totalSeats,
      baseFare,
      scheduleType: item.scheduleType || item.schedule?.scheduleType || "DAILY",
      travelDate: item.travelDate || item.slotDate,
    };
  });
};

export default function SearchTrips() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [cities, setCities] = useState<City[]>([]);
  const [ghats, setGhats] = useState<Ghat[]>([]);
  const [rides, setRides] = useState<any[]>([]);

  // Form states
  const [cityId, setCityId] = useState("");
  const [sourceGhatId, setSourceGhatId] = useState("");
  const [destinationGhatId, setDestinationGhatId] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  // Status states
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCities().then(setCities).catch(console.error);
  }, []);

  // Handle URL query parameters
  useEffect(() => {
    const qCityId = searchParams.get("cityId") || "";
    const qSourceGhatId = searchParams.get("sourceGhatId") || "";
    const qDestinationGhatId = searchParams.get("destinationGhatId") || "";
    const qDate = searchParams.get("date") || "";

    if (qCityId) {
      setCityId(qCityId);
      getGhatsByCity(qCityId)
        .then((g) => {
          setGhats(g || []);
          if (qSourceGhatId) setSourceGhatId(qSourceGhatId);
          if (qDestinationGhatId) setDestinationGhatId(qDestinationGhatId);
        })
        .catch(console.error);
    }
    if (qDate) {
      setTravelDate(qDate);
    }

    if (qCityId && qSourceGhatId && qDestinationGhatId && qDate) {
      const triggerSearch = async () => {
        const payload = {
          cityId: qCityId,
          sourceGhatId: qSourceGhatId,
          destinationGhatId: qDestinationGhatId,
          date: qDate,
          passengers: 1,
        };

        try {
          setLoading(true);
          setError(null);
          setSearched(true);

          const rawResponse = await searchCustomerTrips(payload);
          const normalized = normalizeRides(rawResponse);

          if (process.env.NODE_ENV !== "production") {
            console.log("[SearchTrips URL mount] search payload:", payload);
            console.log("[SearchTrips URL mount] raw response:", rawResponse);
            console.log("[SearchTrips URL mount] normalized rides:", normalized);
          }

          setRides(normalized);
        } catch (err: any) {
          setError(err.response?.data?.message || "Search failed.");
        } finally {
          setLoading(false);
        }
      };
      triggerSearch();
    }
  }, [searchParams]);

  // Clean form values on cityId change only if it is user-initiated (no matching query param)
  const handleCityChange = (newCityId: string) => {
    setCityId(newCityId);
    if (newCityId) {
      getGhatsByCity(newCityId).then(setGhats).catch(console.error);
      setSourceGhatId("");
      setDestinationGhatId("");
    } else {
      setGhats([]);
      setSourceGhatId("");
      setDestinationGhatId("");
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityId || !sourceGhatId || !destinationGhatId || !travelDate) {
      alert("Please fill in all search parameters");
      return;
    }

    if (sourceGhatId === destinationGhatId) {
      alert("Source and destination ghat cannot be the same");
      return;
    }

    const payload = {
      cityId,
      sourceGhatId,
      destinationGhatId,
      date: travelDate,
      passengers,
    };

    try {
      setLoading(true);
      setError(null);
      setSearched(true);

      const rawResponse = await searchCustomerTrips(payload);
      const normalized = normalizeRides(rawResponse);

      if (process.env.NODE_ENV !== "production") {
        console.log("[SearchTrips handleSearch] search payload:", payload);
        console.log("[SearchTrips handleSearch] raw response:", rawResponse);
        console.log("[SearchTrips handleSearch] normalized rides:", normalized);
      }

      setRides(normalized);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Search failed. No routes found.");
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-black text-blue-950 dark:text-white">Search Trips</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Find available boat routes, select timings, and book your tickets securely
        </p>
      </header>

      {/* Search Panel */}
      <section className="rounded-3xl border border-blue-50/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-6 shadow-sm transition-colors">
        <form onSubmit={handleSearch} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {/* City Select */}
            <div>
              <label className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wide">
                City
              </label>
              <div className="mt-2 flex items-center gap-2.5 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-3 focus-within:border-blue-500 transition-all">
                <MapPin size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <select
                  required
                  value={cityId}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
                >
                  <option value="" className="dark:bg-slate-800">Select City</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id} className="dark:bg-slate-800">
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Travel Date */}
            <div>
              <label className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wide">
                Travel Date
              </label>
              <div className="mt-2 flex items-center gap-2.5 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2.5 focus-within:border-blue-500 transition-all">
                <CalendarDays size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <input
                  type="date"
                  required
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
                />
              </div>
            </div>

            {/* Depart Ghat */}
            <div>
              <label className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wide">
                Depart Ghat
              </label>
              <div className="mt-2 flex items-center gap-2.5 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-3 focus-within:border-blue-500 transition-all">
                <MapPin size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <select
                  required
                  disabled={!cityId}
                  value={sourceGhatId}
                  onChange={(e) => setSourceGhatId(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none disabled:opacity-50"
                >
                  <option value="" className="dark:bg-slate-800">From Ghat</option>
                  {ghats.map((ghat) => (
                    <option key={ghat._id} value={ghat._id} className="dark:bg-slate-800">
                      {ghat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Destination Ghat */}
            <div>
              <label className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wide">
                Destination Ghat
              </label>
              <div className="mt-2 flex items-center gap-2.5 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-3 focus-within:border-blue-500 transition-all">
                <Navigation size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <select
                  required
                  disabled={!cityId}
                  value={destinationGhatId}
                  onChange={(e) => setDestinationGhatId(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none disabled:opacity-50"
                >
                  <option value="" className="dark:bg-slate-800">To Ghat</option>
                  {ghats.map((ghat) => (
                    <option key={ghat._id} value={ghat._id} className="dark:bg-slate-800">
                      {ghat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Passenger Count */}
            <div>
              <label className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wide">
                Passengers
              </label>
              <div className="mt-2 flex items-center gap-2.5 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2.5 focus-within:border-blue-500 transition-all">
                <Users size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <input
                  type="number"
                  required
                  min="1"
                  max="20"
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 py-3.5 font-bold text-white shadow shadow-blue-200/50 dark:shadow-none hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
          >
            <Search size={18} />
            {loading ? "Searching Available Rides..." : "Search Available Rides"}
          </button>
        </form>
      </section>

      {/* Results Section */}
      <section className="space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-100 dark:border-red-950 bg-red-50/50 dark:bg-red-950/20 p-6 text-center text-red-600 dark:text-red-400">
            <AlertCircle size={32} className="mx-auto mb-2 text-red-500" />
            <p className="font-bold">{error}</p>
          </div>
        )}

        {!loading && searched && rides.length === 0 && !error && (
          <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-12 text-center transition-colors">
            <Ship size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">No Rides Available</h4>
            <p className="text-sm text-slate-400 mt-1">
              There are no matching schedules or free seats for this route on your selected date.
            </p>
          </div>
        )}

        {!loading && !searched && (
          <div className="rounded-3xl border border-dashed border-blue-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-12 text-center transition-colors">
            <Search size={40} className="mx-auto mb-3 text-blue-300 dark:text-blue-900" />
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">Search Ganga Yatra Rides</h4>
            <p className="text-sm text-slate-400 mt-1">
              Specify your travel details above and hit search to load live schedules and available seats.
            </p>
          </div>
        )}

        {/* Available Ride Cards */}
        {!loading && rides.length > 0 && (
          <div className="grid gap-5">
            {rides.map((ride: any) => {
              const route = ride.route;
              const boat = ride.boat;
              const availableSeats = ride.availableSeats;

              return (
                <div
                  key={ride.slotId || ride.scheduleId}
                  className="rounded-3xl border border-blue-50/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                      <div className="h-16 w-16 overflow-hidden rounded-2xl bg-blue-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700/50 flex items-center justify-center shrink-0">
                        {boat?.image ? (
                          <img src={boat.image} alt={boat.boatName} className="h-full w-full object-cover" />
                        ) : (
                          <Ship size={28} className="text-blue-600 dark:text-blue-400" />
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">
                          {boat?.boatName || "Ganga Cruiser"}
                        </h3>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                          <MapPin size={14} className="text-blue-500" />
                          {route?.sourceGhatId?.name} ➔ {route?.destinationGhatId?.name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400">
                          {route?.distanceKm || 0} km River Route • {boat?.boatType || "Standard"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3.5">
                      <span className="flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/30 px-3.5 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-400 border border-blue-100/10">
                        <Clock size={14} />
                        Depart: {ride.departureTime}
                      </span>

                      <span className="flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-950/30 px-3.5 py-1.5 text-xs font-bold text-green-700 dark:text-green-400 border border-green-100/10">
                        <Users size={14} />
                        {availableSeats} seats left
                      </span>
                    </div>

                    <div className="flex items-center justify-between md:flex-col md:items-end gap-3.5 border-t md:border-t-0 pt-4 md:pt-0">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 text-left md:text-right uppercase">Base Fare</p>
                        <h2 className="text-3xl font-black text-blue-600 dark:text-blue-400">
                          ₹{(ride.baseFare || 0).toLocaleString("en-IN")}
                        </h2>
                      </div>

                      <button
                        onClick={() => navigate(`/customer/boat-details/${ride.slotId}`)}
                        className="rounded-xl bg-orange-500 hover:bg-orange-600 px-6 py-3 text-xs font-black text-white shadow shadow-orange-100 dark:shadow-none hover:scale-105 active:scale-95 transition-all"
                      >
                        Book Ride
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
