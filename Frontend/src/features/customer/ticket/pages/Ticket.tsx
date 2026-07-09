import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  MapPin,
  Phone,
  Printer,
  Ship,
  Ticket as TicketIcon,
  User,
  Users,
} from "lucide-react";

import { getTicketByBookingId } from "@/features/customer/dashboard/api/customerApi";
import { formatLocalDate } from "@/utils/dateKey";

export default function Ticket() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const ticketRef = useRef<HTMLDivElement | null>(null);

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const data = await getTicketByBookingId(String(bookingId));
      setTicket(data);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Ticket fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) fetchTicket();
  }, [bookingId]);

  const details = useMemo(() => {
    const schedule = ticket?.slotId?.scheduleId;
    const boat = schedule?.boatId;
    const route = schedule?.routeId;

    return {
      bookingCode: ticket?.bookingCode || bookingId || "-",
      passengerName: ticket?.passengerName || "Customer",
      passengerPhone: ticket?.passengerPhone || "-",
      boatName: boat?.boatName || "Boat Ride",
      boatNumber: boat?.boatNumber || "-",
      routeName: `${route?.sourceGhatId?.name || "Source"} → ${
        route?.destinationGhatId?.name || "Destination"
      }`,
      travelDate: ticket?.slotId?.slotDate || ticket?.createdAt || "",
      travelTime: `${schedule?.departureTime || "--"} - ${
        schedule?.arrivalTime || "--"
      }`,
      seatsBooked: ticket?.seatsBooked || 1,
      totalAmount: ticket?.totalAmount || 0,
      paymentStatus: ticket?.paymentStatus || "PENDING",
      bookingStatus: ticket?.bookingStatus || "CONFIRMED",
      checkInStatus: ticket?.checkInStatus || "PENDING",
      bookingType: ticket?.bookingType || "ONLINE",
      qrCode: ticket?.qrCode || null,
    };
  }, [ticket, bookingId]);

  if (loading) {
    return <div className="p-6 font-bold text-blue-700">Loading ticket...</div>;
  }

  if (!ticket) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate("/customer/bookings", { replace: true })}
          className="rounded-xl bg-white px-4 py-3 font-bold shadow"
        >
          Back
        </button>
        <p className="mt-5 font-bold text-red-600">Ticket not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8ff] p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between print:hidden">
          <button
            onClick={() =>
            navigate("/customer/bookings", {
            replace: true,
              })
            }
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-bold text-slate-700 shadow-sm"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-bold text-white"
            >
              <Printer size={18} />
              Print
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-bold text-white"
            >
              <Download size={18} />
              Download
            </button>
          </div>
        </div>

        <section
          ref={ticketRef}
          className="overflow-hidden rounded-3xl bg-white shadow-lg print:shadow-none"
        >
          <div className="bg-gradient-to-r from-blue-700 to-cyan-500 p-6 text-white">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                  <TicketIcon size={30} />
                </div>

                <h1 className="text-3xl font-extrabold">GangaYatra Ticket</h1>
                <p className="text-sm font-semibold text-blue-100">
                  Safe & Verified Boat Ride Booking
                </p>
              </div>

              <div className="rounded-2xl bg-white/15 p-4 text-right">
                <p className="text-xs font-bold uppercase text-blue-100">
                  Booking Code
                </p>
                <h2 className="text-2xl font-extrabold">
                  {details.bookingCode}
                </h2>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-[220px_1fr]">
            <div className="flex flex-col items-center justify-center rounded-3xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-white text-center text-xs font-bold text-slate-400">
                {details.qrCode ? (
                  <img
                    src={details.qrCode}
                    alt="QR Code"
                    className="h-full w-full"
                  />
                ) : (
                  "QR CODE"
                )}
              </div>

              <StatusBadge status={details.bookingStatus} />

              <p className="mt-3 text-center text-xs font-semibold text-slate-500">
                {details.bookingType} • {details.checkInStatus}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TicketInfo icon={<User size={18} />} label="Passenger" value={details.passengerName} />
              <TicketInfo icon={<Phone size={18} />} label="Phone" value={details.passengerPhone} />
              <TicketInfo icon={<Ship size={18} />} label="Boat" value={`${details.boatName} (${details.boatNumber})`} />
              <TicketInfo icon={<MapPin size={18} />} label="Route" value={details.routeName} />
              <TicketInfo icon={<CalendarDays size={18} />} label="Travel Date" value={details.travelDate ? formatLocalDate(details.travelDate) : "-"} />
              <TicketInfo icon={<Clock size={18} />} label="Travel Time" value={details.travelTime} />
              <TicketInfo icon={<Users size={18} />} label="Seats" value={String(details.seatsBooked)} />
              <TicketInfo icon={<CreditCard size={18} />} label="Payment" value={details.paymentStatus} />
            </div>
          </div>

          <div className="border-t border-blue-100 p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Total Amount
                </p>
                <h3 className="text-3xl font-extrabold text-blue-700">
                  ₹{Number(details.totalAmount).toLocaleString("en-IN")}
                </h3>
              </div>

              <p className="max-w-md text-sm font-semibold text-slate-500">
                Please carry this ticket and a valid ID proof while boarding.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function TicketInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
      <div className="mb-2 text-blue-700">{icon}</div>
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-bold text-slate-900">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style =
    status === "CONFIRMED"
      ? "bg-green-50 text-green-700"
      : status === "COMPLETED"
      ? "bg-blue-50 text-blue-700"
      : status === "CANCELLED"
      ? "bg-red-50 text-red-700"
      : "bg-orange-50 text-orange-700";

  return (
    <span
      className={`mt-4 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${style}`}
    >
      <CheckCircle size={16} />
      {status}
    </span>
  );
}