import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ticket as TicketIcon,
  MapPin,
  Search,
  RotateCcw,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { getMyBookings } from "@/features/customer/dashboard/api/customerApi";
import { formatLocalDate } from "@/utils/dateKey";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

type Booking = {
  _id: string;
  bookingCode?: string;
  bookingStatus?: BookingStatus;
  paymentStatus?: PaymentStatus;
  seatsBooked?: number;
  totalAmount?: number;
  passengerName?: string;
  passengerPhone?: string;
  createdAt?: string;
  slotId?: {
    _id?: string;
    slotDate?: string;
    scheduleId?: {
      departureTime?: string;
      arrivalTime?: string;
      boatId?: {
        boatName?: string;
        boatNumber?: string;
      };
      routeId?: {
        sourceGhatId?: { name?: string };
        destinationGhatId?: { name?: string };
      };
    };
  };
};

export default function Tickets() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState<"ALL" | "CONFIRMED" | "COMPLETED">("ALL");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getMyBookings();
      setBookings(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Bookings fetch error:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const ticketBookings = useMemo(() => {
    return bookings.filter(
      (b) => b.bookingStatus === "CONFIRMED" || b.bookingStatus === "COMPLETED"
    );
  }, [bookings]);

  const filteredTickets = useMemo(() => {
    return ticketBookings.filter((t) => {
      const matchesFilter = filter === "ALL" || t.bookingStatus === filter;
      const text = searchText.toLowerCase();
      const matchesSearch =
        !text ||
        t.bookingCode?.toLowerCase().includes(text) ||
        t.passengerName?.toLowerCase().includes(text) ||
        t.slotId?.scheduleId?.boatId?.boatName?.toLowerCase().includes(text);
      return matchesFilter && matchesSearch;
    });
  }, [ticketBookings, filter, searchText]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-black text-blue-950 dark:text-white flex items-center gap-2">
            <TicketIcon className="text-blue-600 dark:text-blue-450" size={28} />
            My Tickets
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View, print, and download your travel tickets and boarding passes
          </p>
        </div>

        <button
          onClick={fetchBookings}
          disabled={loading}
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 px-5 py-3 font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
        >
          <RotateCcw size={17} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      {/* Filter and Search */}
      <div className="flex flex-col gap-3 rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-sm md:flex-row border border-slate-100/30">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-700 px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50">
          <Search size={18} className="text-slate-400" />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by ticket code, passenger or boat..."
            className="w-full bg-transparent outline-none text-sm font-semibold placeholder:text-slate-400"
          />
        </div>

        <div className="flex gap-2">
          {(["ALL", "CONFIRMED", "COMPLETED"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-xl px-4 py-3 font-bold text-xs uppercase transition-colors ${
                filter === status
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              {status === "ALL" ? "All Tickets" : status}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 font-bold">Loading your tickets...</p>
        </div>
      )}

      {!loading && filteredTickets.length === 0 && (
        <div className="rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 p-12 text-center shadow-sm max-w-lg mx-auto">
          <AlertCircle size={40} className="mx-auto text-slate-350 mb-3 dark:text-slate-500" />
          <p className="font-extrabold text-slate-700 dark:text-slate-200">No active tickets found</p>
          <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">
            Tickets are generated only for confirmed or completed bookings.
          </p>
        </div>
      )}

      {/* Tickets list */}
      <div className="grid gap-6 lg:grid-cols-2">
        {filteredTickets.map((t) => {
          const schedule = t.slotId?.scheduleId;
          const boat = schedule?.boatId;
          const route = schedule?.routeId;
          const source = route?.sourceGhatId?.name || "Source";
          const destination = route?.destinationGhatId?.name || "Destination";
          const travelDate = t.slotId?.slotDate || t.createdAt;
          const departure = schedule?.departureTime || "--";
          const arrival = schedule?.arrivalTime || "--";

          return (
            <div
              key={t._id}
              className="relative overflow-hidden rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 p-6 shadow-sm flex flex-col justify-between transition-all hover:shadow-md"
            >
              {/* Top Section */}
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      t.bookingStatus === "CONFIRMED"
                        ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                        : "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400"
                    }`}>
                      {t.bookingStatus}
                    </span>
                    <h3 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
                      {boat?.boatName || "Ganga Ride"}
                    </h3>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5 tracking-wider">
                      {t.bookingCode || t._id}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-slate-750 text-blue-600 dark:text-blue-400">
                    <TicketIcon size={24} />
                  </div>
                </div>

                {/* Route */}
                <div className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                  <MapPin size={16} className="text-slate-400" />
                  <span>{source}</span>
                  <span className="text-slate-400">➔</span>
                  <span>{destination}</span>
                </div>

                {/* Details grid */}
                <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-50 dark:border-slate-700/50 pt-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Travel Date</p>
                    <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                      {travelDate ? formatLocalDate(travelDate) : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Time</p>
                    <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                      {departure} - {arrival}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Seats</p>
                    <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                      {t.seatsBooked || 1} {t.seatsBooked === 1 ? "Seat" : "Seats"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-50 dark:border-slate-700/50 pt-4">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Total Amount</p>
                  <p className="text-xl font-black text-slate-800 dark:text-white">
                    ₹{Number(t.totalAmount || 0).toLocaleString("en-IN")}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/ticket/${t.bookingCode || t._id}`)}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
                >
                  View Ticket
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
