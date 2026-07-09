import { useEffect, useState } from "react";
import { Edit2, Trash2, Plus, X, Search, CheckCircle, XCircle, Route, Navigation, Landmark } from "lucide-react";
import { useRouteStore } from "../store/routeStore";
import { useGhatStore } from "@/features/admin/ghats/store/ghatStore";
import { useCityStore } from "@/features/admin/cities/store/cityStore";
import type { Route as RouteType } from "../types/route.types";

export default function RouteTable() {
  const { routes, loading, error, fetchRoutes, addRoute, editRoute, removeRoute, approve, reject } = useRouteStore();
  const { ghats, fetchGhats } = useGhatStore();
  const { cities, fetchCities } = useCityStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<RouteType | null>(null);

  // Form State
  const [cityId, setCityId] = useState("");
  const [sourceGhatId, setSourceGhatId] = useState("");
  const [destinationGhatId, setDestinationGhatId] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [estimatedDurationMinutes, setEstimatedDurationMinutes] = useState("");
  const [baseFare, setBaseFare] = useState("");
  const [nightFare, setNightFare] = useState("0");
  const [weekendFare, setWeekendFare] = useState("0");
  const [festivalFare, setFestivalFare] = useState("0");
  const [safetyNote, setSafetyNote] = useState("");

  useEffect(() => {
    fetchRoutes();
    fetchGhats();
    fetchCities();
  }, [fetchRoutes, fetchGhats, fetchCities]);

  // When city changes in form, reset ghat selections
  useEffect(() => {
    if (cityId) {
      const cityGhats = ghats.filter((g) => {
        const gCityId = typeof g.cityId === "object" ? g.cityId._id : g.cityId;
        return gCityId === cityId;
      });
      setSourceGhatId(cityGhats[0]?._id || "");
      setDestinationGhatId(cityGhats[1]?._id || cityGhats[0]?._id || "");
    }
  }, [cityId, ghats]);

  const openAddModal = () => {
    setCurrentRoute(null);
    setCityId(cities[0]?._id || "");
    setSourceGhatId("");
    setDestinationGhatId("");
    setDistanceKm("");
    setEstimatedDurationMinutes("");
    setBaseFare("");
    setNightFare("0");
    setWeekendFare("0");
    setFestivalFare("0");
    setSafetyNote("");
    setIsModalOpen(true);
  };

  const openEditModal = (route: RouteType) => {
    const routeCityId = typeof route.cityId === "object" ? route.cityId._id : route.cityId;
    const routeSrcGhatId = typeof route.sourceGhatId === "object" ? route.sourceGhatId._id : route.sourceGhatId;
    const routeDstGhatId = typeof route.destinationGhatId === "object" ? route.destinationGhatId._id : route.destinationGhatId;

    setCurrentRoute(route);
    setCityId(routeCityId);
    setSourceGhatId(routeSrcGhatId);
    setDestinationGhatId(routeDstGhatId);
    setDistanceKm(route.distanceKm.toString());
    setEstimatedDurationMinutes(route.estimatedDurationMinutes.toString());
    setBaseFare(route.baseFare.toString());
    setNightFare(route.nightFare?.toString() || "0");
    setWeekendFare(route.weekendFare?.toString() || "0");
    setFestivalFare(route.festivalFare?.toString() || "0");
    setSafetyNote(route.safetyNote || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentRoute(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityId || !sourceGhatId || !destinationGhatId || !distanceKm || !estimatedDurationMinutes || !baseFare) return;
    if (sourceGhatId === destinationGhatId) {
      alert("Source and Destination ghats cannot be the same.");
      return;
    }

    const payload: Partial<RouteType> = {
      cityId,
      sourceGhatId,
      destinationGhatId,
      distanceKm: parseFloat(distanceKm),
      estimatedDurationMinutes: parseInt(estimatedDurationMinutes, 10),
      baseFare: parseFloat(baseFare),
      nightFare: parseFloat(nightFare),
      weekendFare: parseFloat(weekendFare),
      festivalFare: parseFloat(festivalFare),
      safetyNote,
    };

    let success = false;
    if (currentRoute) {
      success = await editRoute(currentRoute._id, payload);
    } else {
      success = await addRoute(payload);
    }

    if (success) {
      closeModal();
    }
  };

  const handleDelete = async (id: string, label: string) => {
    if (confirm(`Are you sure you want to delete the route "${label}"?`)) {
      await removeRoute(id);
    }
  };

  const filteredRoutes = routes.filter((route) => {
    const srcName = typeof route.sourceGhatId === "object" ? route.sourceGhatId.name : ghats.find(g => g._id === route.sourceGhatId)?.name || "";
    const dstName = typeof route.destinationGhatId === "object" ? route.destinationGhatId.name : ghats.find(g => g._id === route.destinationGhatId)?.name || "";
    const term = searchTerm.toLowerCase();
    
    const matchesSearch = srcName.toLowerCase().includes(term) || dstName.toLowerCase().includes(term);

    const routeCityId = typeof route.cityId === "object" ? route.cityId._id : route.cityId;
    const matchesCity = !cityFilter || routeCityId === cityFilter;

    const matchesStatus = !statusFilter || route.approvalStatus === statusFilter;

    return matchesSearch && matchesCity && matchesStatus;
  });

  // Filter ghats belonging to currently selected city in form
  const formCityGhats = ghats.filter((g) => {
    const gCityId = typeof g.cityId === "object" ? g.cityId._id : g.cityId;
    return gCityId === cityId;
  });

  return (
    <div className="mt-6">
      {/* Top Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row max-w-3xl">
          <div className="flex items-center gap-3 rounded-xl border px-3 py-2 bg-white flex-1 shadow-sm focus-within:border-blue-500 transition">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search by ghat name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400 text-slate-800"
            />
          </div>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="rounded-xl border px-4 py-2 text-sm bg-white focus:border-blue-500 outline-none cursor-pointer shadow-sm text-slate-800"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border px-4 py-2 text-sm bg-white focus:border-blue-500 outline-none cursor-pointer shadow-sm text-slate-800"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-semibold transition shadow-sm cursor-pointer self-start md:self-auto"
        >
          <Plus size={16} /> Add Route
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-center justify-between">
          <span><b>Error:</b> {error}</span>
          <button onClick={() => fetchRoutes()} className="font-bold underline hover:text-red-800 transition">Retry</button>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl bg-white shadow border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50/80 text-blue-950 font-semibold border-b">
              <tr>
                <th className="p-4">Route Path (Ghats)</th>
                <th className="p-4">City</th>
                <th className="p-4">Distance & Duration</th>
                <th className="p-4">Base Fare</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading && routes.length === 0 ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-4 w-48 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-20 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-32 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-16 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-6 w-16 bg-slate-200 rounded-full"></div></td>
                    <td className="p-4"><div className="h-8 w-24 bg-slate-200 rounded mx-auto"></div></td>
                  </tr>
                ))
              ) : filteredRoutes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500 font-medium">
                    No routes found. {routes.length === 0 ? "Add your first route above!" : "Try adjusting your filters."}
                  </td>
                </tr>
              ) : (
                filteredRoutes.map((route) => {
                  const srcName = typeof route.sourceGhatId === "object" ? route.sourceGhatId.name : ghats.find(g => g._id === route.sourceGhatId)?.name || "Unknown Ghat";
                  const dstName = typeof route.destinationGhatId === "object" ? route.destinationGhatId.name : ghats.find(g => g._id === route.destinationGhatId)?.name || "Unknown Ghat";
                  const cityName = typeof route.cityId === "object" ? route.cityId.name : cities.find(c => c._id === route.cityId)?.name || "—";
                  
                  return (
                    <tr key={route._id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Route size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-blue-950 text-sm flex items-center gap-1">
                              <span>{srcName}</span>
                              <span className="text-slate-400">→</span>
                              <span>{dstName}</span>
                            </div>
                            <div className="text-[10px] text-slate-400">ID: {route._id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">{cityName}</td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{route.distanceKm} KM</div>
                        <div className="text-xs text-slate-400">{route.estimatedDurationMinutes} Mins</div>
                      </td>
                      <td className="p-4 font-bold text-blue-950">₹{route.baseFare}</td>
                      <td className="p-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
                          route.approvalStatus === "APPROVED"
                            ? "bg-green-50 text-green-700"
                            : route.approvalStatus === "PENDING"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-red-50 text-red-700"
                        }`}>
                          {route.approvalStatus}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          {route.approvalStatus === "PENDING" && (
                            <>
                              <button
                                onClick={() => approve(route._id)}
                                className="rounded-lg bg-green-50 hover:bg-green-100 text-green-700 p-2 text-xs font-bold transition cursor-pointer"
                                title="Approve Route"
                              >
                                <CheckCircle size={14} />
                              </button>
                              <button
                                onClick={() => reject(route._id)}
                                className="rounded-lg bg-red-50 hover:bg-red-100 text-red-700 p-2 text-xs font-bold transition cursor-pointer"
                                title="Reject Route"
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => openEditModal(route)}
                            className="rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 text-xs font-bold transition cursor-pointer"
                            title="Edit Route"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(route._id, `${srcName} to ${dstName}`)}
                            className="rounded-lg bg-red-50 hover:bg-red-100 text-red-700 p-2 text-xs font-bold transition cursor-pointer"
                            title="Delete Route"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Backdrop & Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-blue-950">
                {currentRoute ? "Edit Route Settings" : "Create New Route Path"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    City Jurisdiction
                  </label>
                  <select
                    required
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-white outline-none focus:border-blue-500 text-slate-800 font-semibold"
                  >
                    {cities.map((city) => (
                      <option key={city._id} value={city._id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Source Ghat (Boarding)
                  </label>
                  <select
                    required
                    value={sourceGhatId}
                    onChange={(e) => setSourceGhatId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-white outline-none focus:border-blue-500 text-slate-800"
                  >
                    <option value="" disabled>Select Ghat</option>
                    {formCityGhats.map((ghat) => (
                      <option key={ghat._id} value={ghat._id}>
                        {ghat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Destination Ghat (Landing)
                  </label>
                  <select
                    required
                    value={destinationGhatId}
                    onChange={(e) => setDestinationGhatId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-white outline-none focus:border-blue-500 text-slate-800"
                  >
                    <option value="" disabled>Select Ghat</option>
                    {formCityGhats.map((ghat) => (
                      <option key={ghat._id} value={ghat._id}>
                        {ghat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Distance (KM)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 5.5"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Est. Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 30"
                    value={estimatedDurationMinutes}
                    onChange={(e) => setEstimatedDurationMinutes(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Base Fare (INR)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 150"
                    value={baseFare}
                    onChange={(e) => setBaseFare(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Night Premium (₹)
                  </label>
                  <input
                    type="number"
                    value={nightFare}
                    onChange={(e) => setNightFare(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Weekend Premium (₹)
                  </label>
                  <input
                    type="number"
                    value={weekendFare}
                    onChange={(e) => setWeekendFare(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Festival Premium (₹)
                  </label>
                  <input
                    type="number"
                    value={festivalFare}
                    onChange={(e) => setFestivalFare(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Safety & Route Notes
                </label>
                <textarea
                  placeholder="Note safety protocols or depth issues here..."
                  value={safetyNote}
                  onChange={(e) => setSafetyNote(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 text-slate-800 h-20 resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end border-t pt-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-blue-700 shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Saving..." : currentRoute ? "Update Settings" : "Add Route"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}