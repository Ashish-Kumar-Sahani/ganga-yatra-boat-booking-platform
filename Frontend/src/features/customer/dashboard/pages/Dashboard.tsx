import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  ArrowRight,
  Award,
  Wallet as WalletIcon,
  Heart,
  Ship,
  Search,
  ChevronRight,
} from "lucide-react";
import { getCustomerDashboard } from "../api/customerApi";
import { getCities } from "@/features/admin/cities/api/cityApi";
import { getGhatsByCity } from "@/features/admin/ghats/api/ghatApi";
import { getRoutes } from "@/features/owner/routes/api/routeApi";
import { useCustomerStore } from "../../store/customerStore";
import { useAuthStore } from "@/features/auth/store/authStore";
import API from "@/api/axiosInstance";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { wishlist, notifications, fetchWishlist, fetchNotifications } = useCustomerStore();
  const { user } = useAuthStore();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);

  // Search form states
  const [cities, setCities] = useState<any[]>([]);
  const [ghats, setGhats] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [cityId, setCityId] = useState("");
  const [sourceGhatId, setSourceGhatId] = useState("");
  const [destinationGhatId, setDestinationGhatId] = useState("");
  const [travelDate, setTravelDate] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await getCustomerDashboard();
      setDashboardData(res || null);
    } catch (err) {
      console.error("Dashboard load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSearchData = async () => {
    try {
      const citiesRes = await getCities();
      setCities(citiesRes || []);
      const routesRes = await getRoutes();
      setRoutes(routesRes || []);

      // Load offers
      const offersRes = await API.get("/offers");
      setOffers(offersRes.data || []);
    } catch (err) {
      console.error("Failed to load search parameters:", err);
    }
  };

  useEffect(() => {
    loadDashboard();
    loadSearchData();
    fetchWishlist();
    fetchNotifications();

    const interval = setInterval(() => {
      loadDashboard();
      fetchNotifications();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (cityId) {
      getGhatsByCity(cityId).then(setGhats).catch(console.error);
      setSourceGhatId("");
      setDestinationGhatId("");
    }
  }, [cityId]);

  const handleQuickSearch = () => {
    if (!cityId || !sourceGhatId || !destinationGhatId) {
      alert("Please select city, source, and destination ghat");
      return;
    }
    if (sourceGhatId === destinationGhatId) {
      alert("Source and destination ghat cannot be same");
      return;
    }

    const matchedRoute = routes.find((route: any) => {
      const sId = typeof route.sourceGhatId === "string" ? route.sourceGhatId : route.sourceGhatId?._id;
      const dId = typeof route.destinationGhatId === "string" ? route.destinationGhatId : route.destinationGhatId?._id;
      return sId === sourceGhatId && dId === destinationGhatId;
    });

    if (!matchedRoute) {
      alert("No route found for selected ghats");
      return;
    }

    navigate(
      `/customer/search-trips?cityId=${cityId}&sourceGhatId=${sourceGhatId}&destinationGhatId=${destinationGhatId}&date=${travelDate}`
    );
  };

  const stats = dashboardData?.stats || {
    upcomingBookings: 0,
    totalRides: 0,
    completedRides: 0,
    cancelledBookings: 0,
    totalSpent: 0,
    loyaltyPoints: 0,
  };

  const upcomingBooking = dashboardData?.upcomingBooking;
  const recentBookings = dashboardData?.recentBookings || [];

  if (loading && !dashboardData) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 rounded-[2rem] bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-3xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800 md:col-span-2" />
          <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        {/* Welcome Banner Section */}
        <section
          className="relative rounded-[2rem] overflow-hidden shadow-xl min-h-[260px] md:min-h-[320px] flex items-center p-8 text-white transition-all"
          style={{
            backgroundImage: `url('/images/VaranasiBanner.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Rich Dark Gradient Overlay to ensure readability and contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent z-0" />

          <div className="relative z-10 max-w-lg space-y-4">
            <h1 className="text-3xl font-black md:text-4xl leading-tight drop-shadow">
              Hello, {dashboardData?.customerName || "Customer"} 👋
            </h1>
            <p className="text-slate-100 text-sm font-medium leading-relaxed drop-shadow">
              Ready to explore Varanasi's historic ghats? Book a boat ride instantly and experience the sacred Ganga river in comfort.
            </p>
            <button
              onClick={() => navigate("/customer/search-trips")}
              className="flex items-center gap-2 rounded-xl bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 px-5.5 py-3 text-xs font-black text-white hover:scale-105 active:scale-95 transition-all shadow-md shrink-0 animate-fadeIn"
            >
              <span>Explore Routes</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-blue-50/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-5 shadow-sm transition-colors">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Upcoming Rides</p>
            <h3 className="mt-2 text-2xl font-black text-slate-800 dark:text-white">{stats.upcomingBookings}</h3>
          </div>
          <div className="rounded-3xl border border-blue-50/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-5 shadow-sm transition-colors">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Total Spent</p>
            <h3 className="mt-2 text-2xl font-black text-blue-700 dark:text-blue-400">₹{stats.totalSpent?.toLocaleString()}</h3>
          </div>
          <div className="rounded-3xl border border-blue-50/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-5 shadow-sm transition-colors">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Completed Rides</p>
            <h3 className="mt-2 text-2xl font-black text-slate-800 dark:text-white">{stats.completedRides}</h3>
          </div>
          <div className="rounded-3xl border border-blue-50/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-5 shadow-sm transition-colors">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Loyalty Points</p>
            <h3 className="mt-2 text-2xl font-black text-yellow-600 dark:text-yellow-500 flex items-center gap-1.5">
              <Award size={20} />
              {stats.loyaltyPoints}
            </h3>
          </div>
        </section>

        {/* Quick Booking */}
        <section className="rounded-3xl border border-blue-50/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-6 shadow-sm transition-colors">
          <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
            <Search size={18} className="text-blue-600 dark:text-blue-400" />
            Quick Booking Search
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Select City</label>
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="w-full mt-2 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
              >
                <option value="" className="dark:bg-slate-800">Choose City</option>
                {cities.map((c) => <option key={c._id} value={c._id} className="dark:bg-slate-800">{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Depart Ghat</label>
              <select
                value={sourceGhatId}
                disabled={!cityId}
                onChange={(e) => setSourceGhatId(e.target.value)}
                className="w-full mt-2 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none disabled:opacity-50"
              >
                <option value="" className="dark:bg-slate-800">Departing Ghat</option>
                {ghats.map((g) => <option key={g._id} value={g._id} className="dark:bg-slate-800">{g.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Arrive Ghat</label>
              <select
                value={destinationGhatId}
                disabled={!cityId}
                onChange={(e) => setDestinationGhatId(e.target.value)}
                className="w-full mt-2 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none disabled:opacity-50"
              >
                <option value="" className="dark:bg-slate-800">Destination Ghat</option>
                {ghats.map((g) => <option key={g._id} value={g._id} className="dark:bg-slate-800">{g.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Travel Date</label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full mt-2 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
              />
            </div>
          </div>
          <button
            onClick={handleQuickSearch}
            className="w-full mt-5 rounded-2xl bg-blue-600 hover:bg-blue-700 py-3.5 text-sm font-black text-white shadow transition-all duration-150"
          >
            Search Available Rides
          </button>
        </section>

        {/* Favorite Boats (Wishlist) */}
        {wishlist.length > 0 && (
          <section className="rounded-3xl border border-blue-50/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-6 shadow-sm transition-colors">
            <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <Heart size={18} className="text-red-500 fill-red-500" />
              Favorite Boats ({wishlist.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {wishlist.slice(0, 3).map((boat) => (
                <div
                  key={boat._id}
                  onClick={() => navigate("/customer/search-trips")}
                  className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-900/30 p-4 hover:shadow-sm cursor-pointer transition-all flex items-center gap-3"
                >
                  <div className="h-10 w-10 overflow-hidden rounded-xl bg-blue-50 dark:bg-slate-950 flex items-center justify-center shrink-0">
                    {boat.image ? (
                      <img src={boat.image} alt={boat.boatName} className="h-full w-full object-cover" />
                    ) : (
                      <Ship size={20} className="text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">{boat.boatName}</h4>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{boat.boatNumber}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent Rides */}
        <section className="rounded-3xl border border-blue-50/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-6 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800 dark:text-white">Recent Rides</h2>
            <button
              onClick={() => navigate("/customer/history")}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              View History
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {recentBookings.length === 0 ? (
              <p className="py-6 text-center text-sm font-semibold text-slate-400">No recent rides found</p>
            ) : (
              recentBookings.slice(0, 3).map((booking: any) => {
                const route = booking.slotId?.scheduleId?.routeId;
                const boat = booking.slotId?.scheduleId?.boatId;
                return (
                  <div
                    key={booking._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b dark:border-slate-700 pb-3.5 last:border-0 last:pb-0"
                  >
                    <div>
                      <h4 className="text-sm font-black text-slate-800 dark:text-slate-250">{boat?.boatName || "Boat Ride"}</h4>
                      <p className="text-xs font-semibold text-slate-400 mt-0.5">
                        {route?.sourceGhatId?.name || "Start"} ➔ {route?.destinationGhatId?.name || "End"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-5">
                      <span className="text-sm font-black text-slate-700 dark:text-slate-200">₹{booking.totalAmount}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${booking.bookingStatus === "CONFIRMED" ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400" :
                          booking.bookingStatus === "COMPLETED" ? "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400" : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400"
                        }`}>
                        {booking.bookingStatus}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* Sidebar stats & updates */}
      <aside className="space-y-6">
        {/* Wallet & Points Panel */}
        <section className="rounded-3xl bg-slate-900 dark:bg-slate-950 border dark:border-slate-800 text-white p-6 relative overflow-hidden shadow-lg">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account Balance</span>
              <WalletIcon size={20} className="text-slate-400" />
            </div>

            <div>
              <h2 className="text-3xl font-black">
                ₹{(user as any)?.walletBalance?.toLocaleString("en-IN") || 0}
              </h2>
              <p className="text-[11px] font-semibold text-slate-400 mt-1">Available for quick payments</p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-850 dark:border-slate-800 pt-4">
              <div className="flex items-center gap-1.5">
                <Award size={16} className="text-yellow-500" />
                <span className="text-xs font-bold">Points: {stats.loyaltyPoints}</span>
              </div>
              <button
                onClick={() => navigate("/customer/wallet")}
                className="text-xs font-extrabold text-blue-400 hover:underline"
              >
                Top up balance
              </button>
            </div>
          </div>
        </section>

        {/* Upcoming Booking mini view */}
        {upcomingBooking ? (
          <section className="rounded-3xl border border-blue-50/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-5 shadow-sm space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Upcoming Ride</span>
              <span className="rounded-full bg-green-50 dark:bg-green-950/20 px-2.5 py-0.5 text-[10px] font-bold text-green-700 dark:text-green-400 uppercase">
                {upcomingBooking.bookingStatus}
              </span>
            </div>

            <div>
              <h3 className="font-black text-slate-800 dark:text-white">
                {upcomingBooking.slotId?.scheduleId?.boatId?.boatName || "Ganga Ride"}
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
                <MapPin size={12} className="text-slate-400" />
                {upcomingBooking.slotId?.scheduleId?.routeId?.sourceGhatId?.name} ➔ {upcomingBooking.slotId?.scheduleId?.routeId?.destinationGhatId?.name}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold border-t border-slate-50 dark:border-slate-700/30 pt-3">
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Date</p>
                <p className="text-slate-700 dark:text-slate-200 mt-0.5">
                  {upcomingBooking.slotId?.slotDate ? new Date(upcomingBooking.slotId.slotDate).toLocaleDateString() : "Today"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Time</p>
                <p className="text-slate-700 dark:text-slate-200 mt-0.5">
                  {upcomingBooking.slotId?.scheduleId?.departureTime || "--:--"}
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                onClick={() => navigate(`/ticket/${upcomingBooking.bookingCode || upcomingBooking._id}`)}
                className="flex-1 rounded-xl border border-slate-100 dark:border-slate-700 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-center"
              >
                Ticket PDF
              </button>
              <button
                onClick={() => navigate("/customer/tracking")}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 text-center shadow"
              >
                Track Live
              </button>
            </div>
          </section>
        ) : (
          <div className="rounded-3xl border border-slate-100/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-6 text-center shadow-sm transition-colors">
            <p className="text-xs font-extrabold text-slate-400 uppercase">Next Scheduled Ride</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-350 mt-2">No upcoming rides</p>
            <button
              onClick={() => navigate("/customer/search-trips")}
              className="mt-4 rounded-xl border border-blue-200 dark:border-slate-700 px-4 py-2 text-xs font-black text-blue-600 dark:text-blue-450 hover:bg-blue-50 dark:hover:bg-slate-700"
            >
              Book Now
            </button>
          </div>
        )}

        {/* Offers Feed */}
        {offers.length > 0 && (
          <section className="rounded-3xl border border-blue-50/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-5 shadow-sm transition-colors">
            <h3 className="text-sm font-black text-slate-800 dark:text-white mb-3">Active Promotional Deals</h3>
            <div className="space-y-3">
              {offers.slice(0, 2).map((offer: any) => (
                <div key={offer._id} className="rounded-2xl bg-orange-50/20 dark:bg-orange-950/10 border border-orange-100 dark:border-orange-900/30 p-3.5">
                  <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[8px] font-black text-white uppercase">
                    {offer.discountType === "PERCENTAGE" ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                  </span>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 mt-1.5">{offer.title || offer.offerCode}</h4>
                  <p className="text-[10px] font-semibold text-slate-405 mt-0.5">{offer.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent Alerts Feed */}
        <section className="rounded-3xl border border-blue-50/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-5 shadow-sm transition-colors">
          <h3 className="text-sm font-black text-slate-800 dark:text-white mb-3">Recent Alerts</h3>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="py-2 text-center text-xs font-semibold text-slate-400">No notifications</p>
            ) : (
              notifications.slice(0, 2).map((n) => (
                <div key={n._id} className="text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{n.title}</span>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-450 mt-0.5 ml-3 truncate">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </aside>
    </div>
  );
}