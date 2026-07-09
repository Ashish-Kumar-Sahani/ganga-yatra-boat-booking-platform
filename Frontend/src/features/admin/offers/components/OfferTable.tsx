import { useEffect, useState } from "react";
import { Edit2, Trash2, Plus, X, Search, Ticket, Calendar, IndianRupee } from "lucide-react";
import { useOfferStore } from "../store/offerStore";
import { useCityStore } from "@/features/admin/cities/store/cityStore";
import type { Offer } from "../types/offer.types";

export default function OfferTable() {
  const { offers, loading, error, fetchOffers, addOffer, editOffer, removeOffer } = useOfferStore();
  const { cities, fetchCities } = useCityStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);

  // Form State
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FLAT">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("");
  const [maxDiscountAmount, setMaxDiscountAmount] = useState("0");
  const [minBookingAmount, setMinBookingAmount] = useState("0");
  const [validFrom, setValidFrom] = useState("");
  const [validTill, setValidTill] = useState("");
  const [cityId, setCityId] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchOffers();
    fetchCities();
  }, [fetchOffers, fetchCities]);

  const openAddModal = () => {
    setCurrentOffer(null);
    setCode("");
    setDiscountType("PERCENTAGE");
    setDiscountValue("");
    setMaxDiscountAmount("0");
    setMinBookingAmount("0");
    
    // Default valid dates (today to next month)
    const today = new Date().toISOString().split("T")[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextMonthStr = nextMonth.toISOString().split("T")[0];

    setValidFrom(today);
    setValidTill(nextMonthStr);
    setCityId("");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (offer: Offer) => {
    const offerCityId = typeof offer.cityId === "object" ? offer.cityId?._id : offer.cityId;

    setCurrentOffer(offer);
    setCode(offer.code);
    setDiscountType(offer.discountType);
    setDiscountValue(offer.discountValue.toString());
    setMaxDiscountAmount(offer.maxDiscountAmount.toString());
    setMinBookingAmount(offer.minBookingAmount.toString());
    setValidFrom(new Date(offer.validFrom).toISOString().split("T")[0]);
    setValidTill(new Date(offer.validTill).toISOString().split("T")[0]);
    setCityId(offerCityId || "");
    setIsActive(offer.isActive !== false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentOffer(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountValue || !validFrom || !validTill) return;

    const payload: Partial<Offer> = {
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: parseFloat(discountValue),
      maxDiscountAmount: parseFloat(maxDiscountAmount || "0"),
      minBookingAmount: parseFloat(minBookingAmount || "0"),
      validFrom: new Date(validFrom).toISOString(),
      validTill: new Date(validTill).toISOString(),
      cityId: cityId || null,
      isActive,
    };

    let success = false;
    if (currentOffer) {
      success = await editOffer(currentOffer._id, payload);
    } else {
      success = await addOffer(payload);
    }

    if (success) {
      closeModal();
    }
  };

  const handleDelete = async (id: string, offerCode: string) => {
    if (confirm(`Are you sure you want to delete offer coupon "${offerCode}"?`)) {
      await removeOffer(id);
    }
  };

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch = offer.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const offerCityId = typeof offer.cityId === "object" ? offer.cityId?._id : offer.cityId;
    const matchesCity = !cityFilter || offerCityId === cityFilter;

    return matchesSearch && matchesCity;
  });

  return (
    <div className="mt-6">
      {/* Top Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row max-w-xl">
          <div className="flex items-center gap-3 rounded-xl border px-3 py-2 bg-white flex-1 shadow-sm focus-within:border-blue-500 transition">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search coupon code..."
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
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-semibold transition shadow-sm cursor-pointer self-start md:self-auto"
        >
          <Plus size={16} /> Add Offer
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-center justify-between">
          <span><b>Error:</b> {error}</span>
          <button onClick={() => fetchOffers()} className="font-bold underline hover:text-red-800 transition">Retry</button>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl bg-white shadow border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50/80 text-blue-950 font-semibold border-b">
              <tr>
                <th className="p-4">Coupon Info</th>
                <th className="p-4">Discount Rate</th>
                <th className="p-4">Rules</th>
                <th className="p-4">Validity</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading && offers.length === 0 ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-4 w-40 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-20 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-32 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-36 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-6 w-16 bg-slate-200 rounded-full"></div></td>
                    <td className="p-4"><div className="h-8 w-20 bg-slate-200 rounded mx-auto"></div></td>
                  </tr>
                ))
              ) : filteredOffers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500 font-medium">
                    No offers found. {offers.length === 0 ? "Create your first coupon code!" : "Try adjusting filters."}
                  </td>
                </tr>
              ) : (
                filteredOffers.map((offer) => {
                  const isExpired = new Date() > new Date(offer.validTill);
                  const isUpcoming = new Date() < new Date(offer.validFrom);
                  const scope = typeof offer.cityId === "object" ? offer.cityId?.name : cities.find(c => c._id === offer.cityId)?.name || "All Cities";

                  return (
                    <tr key={offer._id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                            <Ticket size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-blue-950 text-base">{offer.code}</div>
                            <div className="text-[10px] text-slate-400">Scope: {scope}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-800">
                          {offer.discountType === "PERCENTAGE" ? `${offer.discountValue}%` : `₹${offer.discountValue}`}
                        </div>
                        {offer.discountType === "PERCENTAGE" && offer.maxDiscountAmount > 0 && (
                          <div className="text-xs text-slate-500">Max ₹{offer.maxDiscountAmount}</div>
                        )}
                      </td>
                      <td className="p-4 text-xs font-medium text-slate-600">
                        <div className="flex items-center gap-1">
                          <IndianRupee size={12} />
                          <span>Min Spend: ₹{offer.minBookingAmount}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-500 text-xs">
                        <div className="flex items-center gap-1 font-semibold text-slate-700">
                          <Calendar size={12} />
                          <span>{new Date(offer.validFrom).toLocaleDateString("en-IN")} → {new Date(offer.validTill).toLocaleDateString("en-IN")}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
                          isExpired
                            ? "bg-red-50 text-red-700"
                            : isUpcoming
                            ? "bg-blue-50 text-blue-700"
                            : offer.isActive !== false
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}>
                          {isExpired ? "Expired" : isUpcoming ? "Upcoming" : offer.isActive !== false ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openEditModal(offer)}
                            className="rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 text-xs font-bold transition cursor-pointer"
                            title="Edit Offer"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(offer._id, offer.code)}
                            className="rounded-lg bg-red-50 hover:bg-red-100 text-red-700 p-2 text-xs font-bold transition cursor-pointer"
                            title="Delete Offer"
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
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-blue-950">
                {currentOffer ? "Edit Coupon Settings" : "Create New Coupon"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Promo / Coupon Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GHAT20, GANGA50"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm uppercase outline-none focus:border-blue-500 text-slate-800 font-bold tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-white outline-none focus:border-blue-500 text-slate-800"
                  >
                    <option value="PERCENTAGE">PERCENTAGE (%)</option>
                    <option value="FLAT">FLAT AMOUNT (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    required
                    placeholder={discountType === "PERCENTAGE" ? "e.g. 20" : "e.g. 100"}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Min Booking Spend (₹)
                  </label>
                  <input
                    type="number"
                    value={minBookingAmount}
                    onChange={(e) => setMinBookingAmount(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Max Discount Limit (₹)
                  </label>
                  <input
                    type="number"
                    disabled={discountType === "FLAT"}
                    value={maxDiscountAmount}
                    onChange={(e) => setMaxDiscountAmount(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 text-slate-800 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Valid From
                  </label>
                  <input
                    type="date"
                    required
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Valid Till
                  </label>
                  <input
                    type="date"
                    required
                    value={validTill}
                    onChange={(e) => setValidTill(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  City Scope (Optional)
                </label>
                <select
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-white outline-none focus:border-blue-500 text-slate-800"
                >
                  <option value="">All Cities (Global Coupon)</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.name}
                    </option>
                  ))}
                </select>
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
                  Coupon is active & usable by customers
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
                  {loading ? "Saving..." : currentOffer ? "Update Coupon" : "Add Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}