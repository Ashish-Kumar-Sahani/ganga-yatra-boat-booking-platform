import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Users,
  Ship,
  BookOpen,
  Route,
  Building2,
  Shield,
  BadgePercent,
  Bell,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import API from "@/api/axiosInstance";
import type { GroupedSearchResults } from "../../search/types/search.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GroupedSearchResults | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem("admin_recent_searches");
    return saved ? JSON.parse(saved) : [];
  });
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle modal on CTRL + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via parent
          onClose(); // This is just a fallback, the parent holds state
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setSearchTerm("");
      setResults(null);
    }
  }, [isOpen]);

  // Debounce API search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults(null);
      return;
    }

    const delay = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get(`/search?q=${encodeURIComponent(searchTerm)}`);
        setResults(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Search failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleSelectRecent = (term: string) => {
    setSearchTerm(term);
  };

  const handleClearRecent = () => {
    localStorage.removeItem("admin_recent_searches");
    setRecentSearches([]);
  };

  const handleItemClick = (path: string, termToSave?: string) => {
    if (termToSave && termToSave.trim()) {
      const updated = [termToSave, ...recentSearches.filter((t) => t !== termToSave)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("admin_recent_searches", JSON.stringify(updated));
    }
    onClose();
    navigate(path);
  };

  if (!isOpen) return null;

  const hasResults =
    results &&
    (results.users.length > 0 ||
      results.owners.length > 0 ||
      results.staff.length > 0 ||
      results.boats.length > 0 ||
      results.bookings.length > 0 ||
      results.routes.length > 0 ||
      results.cities.length > 0 ||
      results.permits.length > 0 ||
      results.offers.length > 0 ||
      results.notifications.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl transition-all duration-300 flex flex-col max-h-[80vh]">
        
        {/* Search Input Box */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 shrink-0 bg-white">
          <Search className="h-5 w-5 text-blue-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="w-full text-base font-medium text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="Search bookings, boats, ghats, users, routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="rounded-lg p-1 hover:bg-slate-50 text-slate-400"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-400 font-sans shadow-sm shrink-0 select-none">
            ESC
          </kbd>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading && (
            <div className="flex h-40 flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium">Querying GangaYatra databases...</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-center text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          {/* Empty search state: show history */}
          {!loading && !searchTerm && (
            <div>
              {recentSearches.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    <span>Recent Searches</span>
                    <button
                      onClick={handleClearRecent}
                      className="text-blue-600 hover:underline capitalize font-bold"
                    >
                      Clear history
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectRecent(term)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-blue-50/50 transition font-medium group"
                      >
                        <Clock className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                        <span className="flex-1 group-hover:text-blue-900">{term}</span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-blue-600 transition" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-sm font-medium">Search for bookings, city routes, permits, customers or ghat locations.</p>
                  <p className="text-xs mt-1 text-slate-400">Type anything to explore GangaYatra console records.</p>
                </div>
              )}
            </div>
          )}

          {/* Search results display */}
          {!loading && searchTerm && !hasResults && !error && (
            <div className="text-center py-10">
              <p className="text-base font-bold text-slate-800">No results found for "{searchTerm}"</p>
              <p className="text-xs text-slate-400 mt-1">Check spelling or search for another item code, name, or phone.</p>
            </div>
          )}

          {!loading && hasResults && (
            <div className="space-y-6">
              
              {/* Bookings */}
              {results.bookings.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <BookOpen size={14} className="text-slate-400" /> Bookings
                  </h4>
                  <div className="grid gap-2">
                    {results.bookings.map((booking) => (
                      <div
                        key={booking._id}
                        onClick={() => handleItemClick(`/admin/bookings`, searchTerm)}
                        className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:border-blue-200 hover:bg-blue-50/30 transition cursor-pointer group"
                      >
                        <div>
                          <div className="text-sm font-bold text-slate-800 group-hover:text-blue-900">
                            {booking.passengerName}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>Code: <strong className="text-slate-600">{booking.bookingCode}</strong></span>
                            <span>•</span>
                            <span>{booking.passengerPhone}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`inline-block rounded-md text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide ${
                            booking.bookingStatus === "CONFIRMED" || booking.bookingStatus === "COMPLETED"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {booking.bookingStatus}
                          </span>
                          <div className="text-xs font-bold text-slate-700 mt-1">₹{booking.totalAmount}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Boats */}
              {results.boats.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Ship size={14} className="text-slate-400" /> Boats
                  </h4>
                  <div className="grid gap-2">
                    {results.boats.map((boat) => (
                      <div
                        key={boat._id}
                        onClick={() => handleItemClick(`/admin/boats`, searchTerm)}
                        className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:border-blue-200 hover:bg-blue-50/30 transition cursor-pointer group"
                      >
                        <div>
                          <div className="text-sm font-bold text-slate-800 group-hover:text-blue-900">
                            {boat.boatName}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Number: <span className="font-semibold text-slate-600">{boat.boatNumber}</span> • Type: {boat.boatType}
                          </div>
                        </div>
                        {boat.ownerId && (
                          <div className="text-right text-xs text-slate-400 shrink-0">
                            Owner: <span className="font-bold text-slate-700">{boat.ownerId.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Routes */}
              {results.routes.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Route size={14} className="text-slate-400" /> Routes
                  </h4>
                  <div className="grid gap-2">
                    {results.routes.map((route) => (
                      <div
                        key={route._id}
                        onClick={() => handleItemClick(`/admin/routes`, searchTerm)}
                        className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:border-blue-200 hover:bg-blue-50/30 transition cursor-pointer group"
                      >
                        <div>
                          <div className="text-sm font-bold text-slate-800 group-hover:text-blue-900 flex items-center gap-1.5">
                            <span>{route.sourceGhatId?.name || "Ghat"}</span>
                            <ArrowRight size={12} className="text-slate-400" />
                            <span>{route.destinationGhatId?.name || "Ghat"}</span>
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            City: {route.cityId?.name || "Varanasi"} • Distance: {route.distanceKm} km
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-bold text-slate-800">Fare: ₹{route.baseFare}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users & Owners & Staff */}
              {(results.users.length > 0 || results.owners.length > 0 || results.staff.length > 0) && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Users size={14} className="text-slate-400" /> Users & Personnel
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[...results.users, ...results.owners, ...results.staff].map((user) => (
                      <div
                        key={user._id}
                        onClick={() => {
                          if (user.role === "BOAT_OWNER" || user.role === "MANAGER") {
                            handleItemClick(`/admin/boat-owners`, searchTerm);
                          } else if (user.role === "CITY_AUTHORITY") {
                            handleItemClick(`/admin/authorities`, searchTerm);
                          } else {
                            handleItemClick(`/admin/users`, searchTerm);
                          }
                        }}
                        className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 hover:border-blue-200 hover:bg-blue-50/30 transition cursor-pointer group"
                      >
                        <img
                          src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=dbeafe&color=2563eb&size=40`}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover shrink-0"
                        />
                        <div className="overflow-hidden">
                          <div className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-900">
                            {user.name}
                          </div>
                          <div className="text-xs text-slate-400 truncate">{user.email}</div>
                          <span className="inline-block mt-1 text-[9px] font-extrabold bg-blue-50 text-blue-600 rounded px-1.5 py-0.5 uppercase tracking-wide">
                            {user.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cities */}
              {results.cities.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Building2 size={14} className="text-slate-400" /> Cities
                  </h4>
                  <div className="grid gap-2">
                    {results.cities.map((city) => (
                      <div
                        key={city._id}
                        onClick={() => handleItemClick(`/admin/cities`, searchTerm)}
                        className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:border-blue-200 hover:bg-blue-50/30 transition cursor-pointer group"
                      >
                        <div>
                          <span className="text-sm font-bold text-slate-800 group-hover:text-blue-900">
                            {city.name}
                          </span>
                          <span className="ml-2 text-xs text-slate-400">({city.state})</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-500">
                          River: {city.riverName}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Permits */}
              {results.permits.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Shield size={14} className="text-slate-400" /> Permits
                  </h4>
                  <div className="grid gap-2">
                    {results.permits.map((permit) => (
                      <div
                        key={permit._id}
                        onClick={() => handleItemClick(`/admin/permits`, searchTerm)}
                        className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:border-blue-200 hover:bg-blue-50/30 transition cursor-pointer group"
                      >
                        <div>
                          <div className="text-sm font-bold text-slate-800 group-hover:text-blue-900">
                            Permit No: {permit.permitNumber}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Type: {permit.permitType} • Boat: {permit.boatId?.boatName || "N/A"}
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          permit.status === "APPROVED"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {permit.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Offers */}
              {results.offers.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <BadgePercent size={14} className="text-slate-400" /> Offers & Promo codes
                  </h4>
                  <div className="grid gap-2">
                    {results.offers.map((offer) => (
                      <div
                        key={offer._id}
                        onClick={() => handleItemClick(`/admin/offers`, searchTerm)}
                        className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:border-blue-200 hover:bg-blue-50/30 transition cursor-pointer group"
                      >
                        <div>
                          <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-extrabold text-blue-600 border border-blue-100 tracking-wide uppercase">
                            {offer.code}
                          </span>
                          <span className="ml-3 text-xs text-slate-400">Discount: {offer.discountType}</span>
                        </div>
                        <div className="text-right font-bold text-slate-800 shrink-0 text-sm">
                          {offer.discountType === "PERCENTAGE" ? `${offer.discountValue}% Off` : `₹${offer.discountValue} Flat`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notifications */}
              {results.notifications.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Bell size={14} className="text-slate-400" /> Admin Notifications
                  </h4>
                  <div className="grid gap-2">
                    {results.notifications.map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => handleItemClick(`/admin/notifications`, searchTerm)}
                        className="rounded-xl border border-slate-100 p-3 hover:border-blue-200 hover:bg-blue-50/30 transition cursor-pointer group"
                      >
                        <div className="text-sm font-bold text-slate-800 group-hover:text-blue-900">
                          {notif.title}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{notif.message}</p>
                        <span className="text-[9px] text-slate-400 block mt-2">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
        
        {/* Help footer */}
        <div className="flex justify-between border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-400 shrink-0">
          <span>Search records by entering partial phrases or numbers.</span>
          <span>Press ESC to leave search.</span>
        </div>
      </div>
    </div>
  );
}
