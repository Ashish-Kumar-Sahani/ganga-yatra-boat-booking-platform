import { useEffect, useState } from "react";
import { Edit2, Trash2, Plus, X, Search, Building2, MapPin } from "lucide-react";
import { useCityStore } from "../store/cityStore";
import type { City } from "../types/city.types";

export default function CityTable() {
  const { cities, loading, error, fetchCities, addCity, editCity, removeCity } = useCityStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [riverName, setRiverName] = useState("");

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  const openAddModal = () => {
    setCurrentCity(null);
    setName("");
    setState("");
    setRiverName("");
    setIsModalOpen(true);
  };

  const openEditModal = (city: City) => {
    setCurrentCity(city);
    setName(city.name);
    setState(city.state || "");
    setRiverName(city.riverName || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCity(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !state || !riverName) return;

    const payload = { name, state, riverName };
    let success = false;
    
    if (currentCity) {
      success = await editCity(currentCity._id, payload);
    } else {
      success = await addCity(payload);
    }

    if (success) {
      closeModal();
    }
  };

  const handleDelete = async (id: string, cityName: string) => {
    if (confirm(`Are you sure you want to delete the city "${cityName}"?`)) {
      await removeCity(id);
    }
  };

  const filteredCities = cities.filter((city) => {
    const term = searchTerm.toLowerCase();
    return (
      city.name.toLowerCase().includes(term) ||
      (city.state && city.state.toLowerCase().includes(term)) ||
      (city.riverName && city.riverName.toLowerCase().includes(term))
    );
  });

  return (
    <div className="mt-6">
      {/* Top Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center gap-3 rounded-xl border px-3 py-2 bg-white flex-1 max-w-md shadow-sm focus-within:border-blue-500 transition">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by city name, state, or river..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400 text-slate-800"
          />
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-semibold transition shadow-sm cursor-pointer self-start md:self-auto"
        >
          <Plus size={16} /> Add City
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-center justify-between">
          <span><b>Error:</b> {error}</span>
          <button onClick={() => fetchCities()} className="font-bold underline hover:text-red-800 transition">Retry</button>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl bg-white shadow border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50/80 text-blue-950 font-semibold border-b">
              <tr>
                <th className="p-4">City Details</th>
                <th className="p-4">State</th>
                <th className="p-4">River Interface</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading && cities.length === 0 ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-28 bg-slate-200 rounded"></div>
                          <div className="h-3 w-16 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><div className="h-4 w-20 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-24 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-8 w-20 bg-slate-200 rounded mx-auto"></div></td>
                  </tr>
                ))
              ) : filteredCities.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500 font-medium">
                    No cities found. {cities.length === 0 ? "Add your first city above!" : "Try adjusting your search."}
                  </td>
                </tr>
              ) : (
                filteredCities.map((city) => (
                  <tr key={city._id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-blue-950 text-base">{city.name}</div>
                          <div className="text-xs text-slate-400">ID: {city._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">{city.state}</td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-1.5 text-sm font-semibold">
                        <MapPin size={14} className="text-slate-400" />
                        <span>{city.riverName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(city)}
                          className="rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 text-xs font-bold transition cursor-pointer"
                          title="Edit City"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(city._id, city.name)}
                          className="rounded-lg bg-red-50 hover:bg-red-100 text-red-700 p-2 text-xs font-bold transition cursor-pointer"
                          title="Delete City"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
                {currentCity ? "Edit City Info" : "Create New City"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  City Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Varanasi, Prayagraj"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Uttar Pradesh, Bihar"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  River Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ganga, Yamuna"
                  value={riverName}
                  onChange={(e) => setRiverName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 text-slate-800"
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
                  {loading ? "Saving..." : currentCity ? "Update City" : "Add City"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}