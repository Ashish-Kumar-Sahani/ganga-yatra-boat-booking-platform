import { useEffect, useState } from "react";
import { Edit2, Trash2, Plus, X, Search, MapPin, Building2 } from "lucide-react";
import { useGhatStore } from "../store/ghatStore";
import { useCityStore } from "@/features/admin/cities/store/cityStore";
import type { Ghat } from "../types/ghat.types";

export default function GhatTable() {
  const { ghats, loading, error, fetchGhats, addGhat, editGhat, removeGhat } = useGhatStore();
  const { cities, fetchCities } = useCityStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGhat, setCurrentGhat] = useState<Ghat | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [cityId, setCityId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchGhats();
    fetchCities();
  }, [fetchGhats, fetchCities]);

  const openAddModal = () => {
    setCurrentGhat(null);
    setName("");
    setCityId(cities[0]?._id || "");
    setLatitude("");
    setLongitude("");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (ghat: Ghat) => {
    setCurrentGhat(ghat);
    setName(ghat.name);
    setCityId(typeof ghat.cityId === "object" ? ghat.cityId._id : ghat.cityId);
    setLatitude(ghat.location?.latitude?.toString() || "");
    setLongitude(ghat.location?.longitude?.toString() || "");
    setIsActive(ghat.isActive !== false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentGhat(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cityId) return;

    const payload: Partial<Ghat> = {
      name,
      cityId,
      location: {
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
      },
      isActive,
    };

    let success = false;
    if (currentGhat) {
      success = await editGhat(currentGhat._id, payload);
    } else {
      success = await addGhat(payload);
    }

    if (success) {
      closeModal();
    }
  };

  const handleDelete = async (id: string, ghatName: string) => {
    if (confirm(`Are you sure you want to delete the ghat "${ghatName}"?`)) {
      await removeGhat(id);
    }
  };

  const filteredGhats = ghats.filter((ghat) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = ghat.name.toLowerCase().includes(term);
    
    const ghatCityId = typeof ghat.cityId === "object" ? ghat.cityId._id : ghat.cityId;
    const matchesCity = !cityFilter || ghatCityId === cityFilter;

    return matchesSearch && matchesCity;
  });

  return (
    <div className="mt-6">
      {/* Top Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row max-w-2xl">
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
            className="rounded-xl border px-4 py-2 text-sm bg-white focus:border-blue-500 outline-none cursor-pointer shadow-sm min-w-[150px] text-slate-800"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-semibold transition shadow-sm cursor-pointer self-start md:self-auto"
        >
          <Plus size={16} /> Add Ghat
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-center justify-between">
          <span><b>Error:</b> {error}</span>
          <button onClick={() => fetchGhats()} className="font-bold underline hover:text-red-800 transition">Retry</button>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl bg-white shadow border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50/80 text-blue-950 font-semibold border-b">
              <tr>
                <th className="p-4">Ghat Name</th>
                <th className="p-4">City</th>
                <th className="p-4">Coordinates (Lat, Lng)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading && ghats.length === 0 ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-4 w-32 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-24 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-36 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-6 w-16 bg-slate-200 rounded-full"></div></td>
                    <td className="p-4"><div className="h-8 w-20 bg-slate-200 rounded mx-auto"></div></td>
                  </tr>
                ))
              ) : filteredGhats.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">
                    No ghats found. {ghats.length === 0 ? "Add your first ghat above!" : "Try adjusting your search filters."}
                  </td>
                </tr>
              ) : (
                filteredGhats.map((ghat) => {
                  const cityName = typeof ghat.cityId === "object" ? ghat.cityId.name : cities.find(c => c._id === ghat.cityId)?.name || "—";
                  const stateName = typeof ghat.cityId === "object" ? ghat.cityId.state : cities.find(c => c._id === ghat.cityId)?.state || "";
                  const lat = ghat.location?.latitude?.toFixed(5) || "—";
                  const lng = ghat.location?.longitude?.toFixed(5) || "—";

                  return (
                    <tr key={ghat._id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-blue-950 text-base">{ghat.name}</div>
                            <div className="text-xs text-slate-400">ID: {ghat._id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-700">{cityName}</div>
                        {stateName && <div className="text-xs text-slate-400">{stateName}</div>}
                      </td>
                      <td className="p-4 text-slate-600 font-medium">
                        {lat !== "—" ? `${lat}, ${lng}` : "Not Set"}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
                          ghat.isActive !== false
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}>
                          {ghat.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openEditModal(ghat)}
                            className="rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 text-xs font-bold transition cursor-pointer"
                            title="Edit Ghat"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(ghat._id, ghat.name)}
                            className="rounded-lg bg-red-50 hover:bg-red-100 text-red-700 p-2 text-xs font-bold transition cursor-pointer"
                            title="Delete Ghat"
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
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-blue-950">
                {currentGhat ? "Edit Ghat Info" : "Create New Ghat"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Ghat Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Assi Ghat, Dashashwamedh Ghat"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Assigned City
                </label>
                <select
                  required
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-white outline-none focus:border-blue-500 text-slate-800"
                >
                  <option value="" disabled>Select a city</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.name} ({city.state})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Latitude (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    placeholder="25.3176"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Longitude (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    placeholder="83.0062"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 py-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-sm font-bold text-slate-600 cursor-pointer select-none">
                  Ghat is open & active for trips
                </label>
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
                  {loading ? "Saving..." : currentGhat ? "Update Ghat" : "Add Ghat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}