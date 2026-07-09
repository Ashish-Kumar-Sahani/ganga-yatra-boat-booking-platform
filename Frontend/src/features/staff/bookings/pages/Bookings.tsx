import { useEffect, useMemo, useState } from "react";
import BookingStats from "../components/BookingStats";
import BookingTable from "../components/BookingTable";
import { getStaffBookings } from "../api/bookingApi";
import type { StaffBooking, BookingStatus, BookingType } from "../types/booking.types";
import { RefreshCcw, Search, Calendar } from "lucide-react";

export default function Bookings() {
  const [bookings, setBookings] = useState<StaffBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterToday, setFilterToday] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"ALL" | BookingStatus>("ALL");
  const [filterType, setFilterType] = useState<"ALL" | BookingType>("ALL");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getStaffBookings();
      setBookings(data);
    } catch (err: any) {
      console.error("Staff bookings fetch error:", err);
      setError(err?.response?.data?.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    let result = bookings;

    const query = search.toLowerCase().trim();
    if (query) {
      result = result.filter((booking) => {
        return (
          booking.bookingCode?.toLowerCase().includes(query) ||
          booking.passengerName?.toLowerCase().includes(query) ||
          booking.passengerPhone?.toLowerCase().includes(query)
        );
      });
    }

    if (filterToday) {
      const todayStr = new Date().toISOString().split("T")[0];
      result = result.filter((booking) => {
        const bDateStr = booking.slotId?.slotDate
          ? new Date(booking.slotId.slotDate).toISOString().split("T")[0]
          : booking.createdAt ? new Date(booking.createdAt).toISOString().split("T")[0] : "";
        return bDateStr === todayStr;
      });
    }

    if (filterStatus !== "ALL") {
      result = result.filter((booking) => booking.bookingStatus === filterStatus);
    }

    if (filterType !== "ALL") {
      result = result.filter((booking) => booking.bookingType === filterType);
    }

    return result;
  }, [bookings, search, filterToday, filterStatus, filterType]);

  return (
    <div className="space-y-6 p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">Bookings</h1>
          <p className="text-slate-500">
            Manage passenger bookings, check-ins and cancellations
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <BookingStats bookings={bookings} />

      {/* Filters and search panel */}
      <div className="rounded-2xl bg-white p-5 shadow space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by booking code, passenger name or phone..."
            className="w-full rounded-xl border border-blue-50 pl-11 pr-4 py-3 outline-none focus:border-blue-500 transition-all text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setFilterToday(!filterToday)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold border transition-all ${
              filterToday
                ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Calendar size={16} />
            Today's Trips
          </button>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 outline-none hover:bg-slate-50 transition-colors"
          >
            <option value="ALL">All Status</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 outline-none hover:bg-slate-50 transition-colors"
          >
            <option value="ALL">All Types</option>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white p-12 text-center text-slate-500 font-semibold shadow flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
          Loading bookings...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center text-slate-500 font-semibold shadow">
          No bookings match the selected filters.
        </div>
      ) : (
        <BookingTable bookings={filteredBookings} onRefresh={fetchBookings} />
      )}
    </div>
  );
}