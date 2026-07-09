import {
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
  Users,
  XCircle,
} from "lucide-react";

type Props = {
  bookingCode?: string;
  boatName: string;
  routeName?: string;
  date?: string;
  time?: string;
  seats?: number;
  amount?: number;
  paymentStatus?: string;
  bookingStatus?: string;
  onViewTicket?: () => void;
  onCancel?: () => void;
};

export default function BookingCard({
  bookingCode,
  boatName,
  routeName,
  date,
  time,
  seats,
  amount,
  paymentStatus = "PENDING",
  bookingStatus = "PENDING",
  onViewTicket,
  onCancel,
}: Props) {
  return (
    <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">
            {boatName}
          </h3>

          {bookingCode && (
            <p className="mt-1 text-xs font-bold text-blue-700">
              #{bookingCode}
            </p>
          )}

          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-500">
            <MapPin size={16} />
            {routeName || "GangaYatra Route"}
          </p>
        </div>

        <StatusBadge status={bookingStatus} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Info icon={<CalendarDays size={17} />} label="Date" value={date || "-"} />
        <Info icon={<Clock size={17} />} label="Time" value={time || "-"} />
        <Info icon={<Users size={17} />} label="Seats" value={String(seats || 0)} />
      </div>

      <div className="mt-5 flex flex-col justify-between gap-4 border-t border-blue-100 pt-5 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-bold uppercase text-slate-400">
            Payment
          </p>
          <p className="mt-1 font-extrabold text-slate-900">
            {paymentStatus}
          </p>
        </div>

        <p className="text-2xl font-extrabold text-blue-700">
          ₹{Number(amount || 0).toLocaleString("en-IN")}
        </p>

        <div className="flex gap-3">
          {onViewTicket && (
            <button
              onClick={onViewTicket}
              className="flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white"
            >
              <Ticket size={17} />
              Ticket
            </button>
          )}

          {onCancel && (
            <button
              onClick={onCancel}
              className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
            >
              <XCircle size={17} />
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-blue-50/60 p-4">
      <div className="mb-2 text-blue-700">{icon}</div>
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-bold text-slate-800">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style =
    status === "CONFIRMED" || status === "UPCOMING"
      ? "bg-green-50 text-green-700"
      : status === "COMPLETED"
      ? "bg-blue-50 text-blue-700"
      : status === "CANCELLED"
      ? "bg-red-50 text-red-700"
      : "bg-orange-50 text-orange-700";

  return (
    <span className={`h-fit rounded-full px-4 py-2 text-xs font-extrabold ${style}`}>
      {status}
    </span>
  );
}