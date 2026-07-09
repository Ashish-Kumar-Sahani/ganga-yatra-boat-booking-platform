import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { CustomerDashboardBooking } from "@/features/customer/dashboard/types/customerDashboard.types";
import { formatLocalDate } from "@/utils/dateKey";

type Props = {
  booking?: CustomerDashboardBooking | null;
};

export default function UpcomingBookingCard({ booking }: Props) {
  const navigate = useNavigate();

  if (!booking) {
    return (
      <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-blue-950">Your Upcoming Booking</h2>
        <p className="mt-4 text-sm font-semibold text-slate-500">
          No upcoming booking found.
        </p>
        <button
          onClick={() => navigate("/search")}
          className="mt-5 w-full rounded-xl bg-blue-700 py-3 text-sm font-extrabold text-white"
        >
          Book Now
        </button>
      </section>
    );
  }

  const schedule = booking.slotId?.scheduleId;
  const boat = schedule?.boatId;
  const route = schedule?.routeId;

  const routeName = `${route?.sourceGhatId?.name || "Source"} → ${
    route?.destinationGhatId?.name || "Destination"
  }`;

  return (
    <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-black text-blue-950">Your Upcoming Booking</h2>

        <button
          onClick={() => navigate("/customer/bookings")}
          className="text-sm font-bold text-blue-700"
        >
          View All
        </button>
      </div>

      <div className="flex gap-4">
        <img
          src={boat?.image || "/images/VaranasiBanner.png"}
          alt="booking"
          className="h-20 w-24 rounded-xl object-cover"
        />

        <div className="flex-1">
          <h3 className="font-black text-blue-950">
            {boat?.boatName || "Boat Ride"}
          </h3>

          <p className="mt-1 text-sm text-slate-600">{routeName}</p>

          <p className="mt-1 text-sm text-slate-600">
            {booking.slotId?.slotDate ? formatLocalDate(booking.slotId.slotDate) : "-"} •{" "}
            {schedule?.departureTime || "--"}
          </p>

          <span className="mt-2 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
            {booking.bookingStatus}
          </span>
        </div>
      </div>

      <button
        onClick={() => navigate(`/ticket/${booking.bookingCode || booking._id}`)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 py-3 text-sm font-extrabold text-blue-700"
      >
        View Booking Details <ArrowRight size={16} />
      </button>
    </section>
  );
}