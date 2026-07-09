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
  ArrowRight,
  Loader2,
} from "lucide-react";
import API from "@/api/axiosInstance";
import { useAuthStore } from "@/features/auth/store/authStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "CUSTOMER";

  // Manage Keyboard Shortcuts (CTRL + K & ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus Input on Open
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

  // Debounced API Search Query
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

  if (!isOpen) return null;

  // Filter Categories by Role
  const showCategory = (category: string) => {
    switch (role) {
      case "CUSTOMER":
        return category === "routes";
      case "BOAT_OWNER":
      case "MANAGER": // Check if user is owner panel
        if (user?.role === "MANAGER") {
          // If staff manager, let them see trips/bookings/boats
          return ["boats", "bookings", "staff", "routes"].includes(category);
        }
        return ["boats", "bookings", "staff"].includes(category);
      case "DRIVER":
      case "CAPTAIN":
      case "HELPER":
        return ["routes", "bookings"].includes(category);
      case "CITY_AUTHORITY":
        return ["boats", "permits", "routes"].includes(category);
      case "SUPER_ADMIN":
        return true;
      default:
        return false;
    }
  };

  // Redirection mappings per role
  const handleItemClick = (category: string, _itemId?: string) => {
    onClose();
    switch (category) {
      case "bookings":
        if (role === "SUPER_ADMIN") navigate("/admin/bookings");
        else if (role === "CITY_AUTHORITY") navigate("/authority/dashboard");
        else if (role === "BOAT_OWNER" || role === "MANAGER") navigate("/owner/bookings");
        else navigate("/staff/bookings");
        break;
      case "boats":
        if (role === "SUPER_ADMIN") navigate("/admin/boats");
        else if (role === "CITY_AUTHORITY") navigate("/authority/boats");
        else navigate("/owner/boats");
        break;
      case "routes":
        if (role === "SUPER_ADMIN") navigate("/admin/routes");
        else if (role === "CITY_AUTHORITY") navigate("/authority/routes");
        else if (role === "CUSTOMER") navigate("/customer/search-trips");
        else if (role === "BOAT_OWNER") navigate("/owner/trips");
        else navigate("/staff/live-tracking");
        break;
      case "permits":
        if (role === "SUPER_ADMIN") navigate("/admin/permits");
        else if (role === "CITY_AUTHORITY") navigate("/authority/permits");
        else navigate("/owner/permits");
        break;
      case "staff":
        if (role === "SUPER_ADMIN") navigate("/admin/users");
        else navigate("/owner/staff");
        break;
      case "users":
      case "owners":
        navigate("/admin/users");
        break;
      case "cities":
        navigate("/admin/cities");
        break;
      case "offers":
        navigate("/admin/offers");
        break;
      default:
        break;
    }
  };

  const getPlaceholderText = () => {
    switch (role) {
      case "CUSTOMER":
        return "Search available river trips & routes...";
      case "BOAT_OWNER":
        return "Search my boats, bookings, or staff members...";
      case "CITY_AUTHORITY":
        return "Search permits, routes, or boat audits...";
      case "DRIVER":
      case "CAPTAIN":
      case "HELPER":
        return "Search assigned trips and passenger bookings...";
      default:
        return "Search bookings, boats, routes, staff, offers...";
    }
  };

  const hasResults =
    results &&
    Object.keys(results).some((key) => showCategory(key) && results[key]?.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl transition-all duration-300 flex flex-col max-h-[80vh]">
        {/* Search header bar */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/80 px-5 py-4 shrink-0 bg-white dark:bg-slate-900">
          <Search className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="w-full text-base font-semibold text-slate-850 dark:text-slate-205 outline-none placeholder:text-slate-400 bg-transparent"
            placeholder={getPlaceholderText()}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="rounded-lg p-1 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-450 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block rounded border border-slate-200 dark:border-slate-800 bg-slate-55/30 px-2 py-0.5 text-xs text-slate-400 font-sans shadow-sm shrink-0 select-none">
            ESC
          </kbd>
        </div>

        {/* Search results body */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading && (
            <div className="flex h-40 flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium">Querying GangaYatra records...</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-100 dark:border-red-950/20 bg-red-50 p-4 text-center text-sm font-semibold text-red-650">
              {error}
            </div>
          )}

          {!loading && !searchTerm && (
            <div className="text-center py-8 text-slate-400">
              <p className="text-sm font-medium">Search for database records in your current console view.</p>
              <p className="text-xs mt-1 text-slate-405">Start typing details above to explore lists.</p>
            </div>
          )}

          {!loading && searchTerm && !hasResults && !error && (
            <div className="text-center py-10">
              <p className="text-base font-bold text-slate-800 dark:text-white">No matches found for "{searchTerm}"</p>
              <p className="text-xs text-slate-400 mt-1">Please try modifying your keywords or references.</p>
            </div>
          )}

          {!loading && hasResults && results && (
            <div className="space-y-6">
              {/* Bookings category */}
              {showCategory("bookings") && results.bookings?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b dark:border-slate-800 pb-1">
                    <BookOpen size={14} /> Bookings
                  </h4>
                  <div className="grid gap-2">
                    {results.bookings.map((booking: any) => (
                      <div
                        key={booking._id}
                        onClick={() => handleItemClick("bookings", booking._id)}
                        className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-850 p-3 hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50/20 dark:hover:bg-blue-950/10 transition cursor-pointer group"
                      >
                        <div>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600">
                            {booking.passengerName}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Code: {booking.bookingCode} • Phone: {booking.passengerPhone}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                            ₹{booking.totalAmount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Boats category */}
              {showCategory("boats") && results.boats?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b dark:border-slate-800 pb-1">
                    <Ship size={14} /> Boats
                  </h4>
                  <div className="grid gap-2">
                    {results.boats.map((boat: any) => (
                      <div
                        key={boat._id}
                        onClick={() => handleItemClick("boats", boat._id)}
                        className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-850 p-3 hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50/20 dark:hover:bg-blue-950/10 transition cursor-pointer group"
                      >
                        <div>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600">
                            {boat.boatName}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Reg: {boat.boatNumber} • Type: {boat.boatType}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-500">{boat.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Permits category */}
              {showCategory("permits") && results.permits?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b dark:border-slate-800 pb-1">
                    <Shield size={14} /> Safety Permits
                  </h4>
                  <div className="grid gap-2">
                    {results.permits.map((permit: any) => (
                      <div
                        key={permit._id}
                        onClick={() => handleItemClick("permits", permit._id)}
                        className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-850 p-3 hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50/20 dark:hover:bg-blue-950/10 transition cursor-pointer group"
                      >
                        <div>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600">
                            Permit No: {permit.permitNumber}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Type: {permit.permitType} • Boat: {permit.boatId?.boatName || "N/A"}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-500">{permit.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Routes category */}
              {showCategory("routes") && results.routes?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b dark:border-slate-800 pb-1">
                    <Route size={14} /> River Routes
                  </h4>
                  <div className="grid gap-2">
                    {results.routes.map((route: any) => (
                      <div
                        key={route._id}
                        onClick={() => handleItemClick("routes", route._id)}
                        className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-850 p-3 hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50/20 dark:hover:bg-blue-950/10 transition cursor-pointer group"
                      >
                        <div>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 flex items-center gap-1">
                            <span>{route.sourceGhatId?.name}</span>
                            <ArrowRight size={12} className="text-slate-400" />
                            <span>{route.destinationGhatId?.name}</span>
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Fare: ₹{route.baseFare} • Distance: {route.distanceKm} km
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Staff category */}
              {showCategory("staff") && results.staff?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b dark:border-slate-800 pb-1">
                    <Users size={14} /> Crew Staff
                  </h4>
                  <div className="grid gap-2">
                    {results.staff.map((crew: any) => (
                      <div
                        key={crew._id}
                        onClick={() => handleItemClick("staff", crew._id)}
                        className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-850 p-3 hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50/20 dark:hover:bg-blue-950/10 transition cursor-pointer group"
                      >
                        <div>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600">
                            {crew.name}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Phone: {crew.phone} • Role: {crew.role}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin-only Categories */}
              {role === "SUPER_ADMIN" && (
                <>
                  {/* Users */}
                  {results.users?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b pb-1">
                        <Users size={14} /> Customers
                      </h4>
                      <div className="grid gap-2">
                        {results.users.map((cust: any) => (
                          <div
                            key={cust._id}
                            onClick={() => handleItemClick("users", cust._id)}
                            className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:border-blue-200 hover:bg-blue-50/20 transition cursor-pointer"
                          >
                            <span className="text-sm font-bold text-slate-800">{cust.name}</span>
                            <span className="text-xs text-slate-400">{cust.email}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Owners */}
                  {results.owners?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b pb-1">
                        <Users size={14} /> Owners / Managers
                      </h4>
                      <div className="grid gap-2">
                        {results.owners.map((own: any) => (
                          <div
                            key={own._id}
                            onClick={() => handleItemClick("owners", own._id)}
                            className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:border-blue-200 hover:bg-blue-50/20 transition cursor-pointer"
                          >
                            <span className="text-sm font-bold text-slate-800">{own.name}</span>
                            <span className="text-xs text-slate-400">{own.email}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cities */}
                  {results.cities?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b pb-1">
                        <Building2 size={14} /> Cities
                      </h4>
                      <div className="grid gap-2">
                        {results.cities.map((city: any) => (
                          <div
                            key={city._id}
                            onClick={() => handleItemClick("cities", city._id)}
                            className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:border-blue-200 hover:bg-blue-50/20 transition cursor-pointer"
                          >
                            <span className="text-sm font-bold text-slate-800">{city.name}</span>
                            <span className="text-xs text-slate-400">({city.state})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Offers */}
                  {results.offers?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b pb-1">
                        <BadgePercent size={14} /> Offers
                      </h4>
                      <div className="grid gap-2">
                        {results.offers.map((offer: any) => (
                          <div
                            key={offer._id}
                            onClick={() => handleItemClick("offers", offer._id)}
                            className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:border-blue-200 hover:bg-blue-50/20 transition cursor-pointer"
                          >
                            <span className="text-sm font-bold text-slate-800">{offer.code}</span>
                            <span className="text-xs text-slate-400">Value: {offer.discountValue}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer info help */}
        <div className="flex justify-between border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 px-5 py-3.5 text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide shrink-0">
          <span>Search returns items based on your credentials & scope.</span>
          <span>ESC to exit</span>
        </div>
      </div>
    </div>
  );
}
