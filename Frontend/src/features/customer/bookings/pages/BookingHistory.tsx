import { useEffect, useState } from "react";
import { CalendarDays, MapPin, CreditCard, Star, Users } from "lucide-react";
import { getBookingHistory } from "@/features/customer/dashboard/api/customerApi";

type HistoryBooking = {
  _id?: string;
  id?: string | number;
  bookingCode?: string;
  slotId?: any;
  seatsBooked?: number;
  totalAmount?: number;
  paymentStatus?: string;
  bookingStatus?: string;
  createdAt?: string;
  rating?: number;
};

export default function BookingHistory() {
  const [history, setHistory] = useState<HistoryBooking[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getBookingHistory();
      setHistory(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.log("Booking history error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Booking History</h2>
        <p className="text-sm text-slate-500">
          View all your completed and past rides
        </p>
      </header>

      {loading && (
        <p className="font-semibold text-blue-700">Loading history...</p>
      )}

      {!loading && history.length === 0 && (
        <div className="rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-sm">
          <p className="font-bold text-slate-700">No booking history found</p>
        </div>
      )}

      <section className="space-y-4">
        {history.map((item) => {
          const bookingId = String(item._id || item.id || "");

          const boatName =
            item.slotId?.boatId?.boatName ||
            item.slotId?.boatId?.name ||
            "Boat Ride";

          const routeName =
            item.slotId?.routeId?.routeName ||
            item.slotId?.routeId?.name ||
            "GangaYatra Route";

          const travelDate = item.slotId?.date || item.createdAt || "";
          const seats = item.seatsBooked || 1;

          return (
            <div
              key={bookingId}
              className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {boatName}
                  </h3>

                  <p className="mt-1 text-sm font-bold text-blue-700">
                    {item.bookingCode || bookingId}
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <MapPin size={16} />
                    {routeName}
                  </p>
                </div>

                <StatusBadge status={item.bookingStatus || "COMPLETED"} />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-4">
                <InfoBox
                  icon={<CalendarDays size={18} />}
                  title="Travel Date"
                  value={
                    travelDate
                      ? new Date(travelDate).toLocaleDateString()
                      : "-"
                  }
                />

                <InfoBox
                  icon={<Users size={18} />}
                  title="Seats"
                  value={String(seats)}
                />

                <InfoBox
                  icon={<CreditCard size={18} />}
                  title="Payment"
                  value={item.paymentStatus || "PAID"}
                />

                <InfoBox
                  icon={<Star size={18} />}
                  title="Rating"
                  value={item.rating ? `${item.rating}/5` : "Not Rated"}
                />
              </div>

              <div className="mt-5 border-t border-blue-100 pt-4">
                <p className="text-2xl font-extrabold text-blue-700">
                  ₹{Number(item.totalAmount || 0).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function InfoBox({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-blue-50/60 p-4">
      <div className="mb-2 text-blue-700">{icon}</div>
      <p className="text-xs font-bold uppercase text-slate-400">{title}</p>
      <p className="mt-1 font-bold text-slate-800">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style =
    status === "COMPLETED"
      ? "bg-blue-50 text-blue-700"
      : status === "CANCELLED"
      ? "bg-red-50 text-red-700"
      : status === "CONFIRMED"
      ? "bg-green-50 text-green-700"
      : "bg-orange-50 text-orange-700";

  return (
    <span className={`h-fit rounded-full px-4 py-2 text-xs font-extrabold ${style}`}>
      {status}
    </span>
  );
}