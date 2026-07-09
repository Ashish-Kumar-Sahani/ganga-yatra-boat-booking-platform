import { CalendarCheck, Clock, MapPin } from "lucide-react";
import type { CustomerDashboardBooking } from "@/features/customer/dashboard/types/customerDashboard.types";
import { formatLocalDate } from "@/utils/dateKey";

type Props = {
  booking: CustomerDashboardBooking;
};

export default function BookingMiniCard({ booking }: Props) {
  const schedule = booking.slotId?.scheduleId;
  const route = schedule?.routeId;

  const routeName = `${route?.sourceGhatId?.name || "Source"} → ${
    route?.destinationGhatId?.name || "Destination"
  }`;

  const travelTime = `${schedule?.departureTime || "--"} - ${
    schedule?.arrivalTime || "--"
  }`;

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
          <CalendarCheck size={20} />
        </div>

        <div>
          <h4 className="font-bold text-slate-900">
            {schedule?.boatId?.boatName || "Boat Ride"}
          </h4>
          <p className="text-sm text-slate-500">{booking.bookingCode}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <Clock size={16} />
          {booking.slotId?.slotDate ? formatLocalDate(booking.slotId.slotDate) : "-"} • {travelTime}
        </p>

        <p className="flex items-center gap-2">
          <MapPin size={16} />
          {routeName}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xl font-extrabold text-blue-700">
          ₹{Number(booking.totalAmount || 0).toLocaleString("en-IN")}
        </p>

        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
          {booking.bookingStatus}
        </span>
      </div>
    </div>
  );
}