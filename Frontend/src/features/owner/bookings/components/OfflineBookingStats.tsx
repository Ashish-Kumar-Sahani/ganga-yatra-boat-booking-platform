import {
  AlertTriangle,
  CalendarCheck,
  IndianRupee,
  Ticket,
  Users,
} from "lucide-react";

import type { Booking } from "../../bookings/types/booking.types";
import { getLocalDateKey } from "@/utils/dateKey";

type Props = {
  bookings?: Booking[];
};

export default function OfflineBookingStats({ bookings = [] }: Props) {
  const offlineBookings = bookings.filter(
    (booking) => booking.bookingType === "OFFLINE"
  );

  const emergencyBookings = bookings.filter(
    (booking) => booking.bookingType === "EMERGENCY"
  );

  const passengers = bookings.reduce(
    (sum, booking) => sum + (booking.seatsBooked || 0),
    0
  );

  const revenue = bookings.reduce(
    (sum, booking) => sum + (booking.totalAmount || 0),
    0
  );

  const todayKey = getLocalDateKey(new Date());

  const todayBookings = bookings.filter(
    (booking) =>
      booking.createdAt && getLocalDateKey(booking.createdAt) === todayKey
  ).length;

  const stats = [
    { title: "Offline Bookings", value: offlineBookings.length, icon: Ticket },
    {
      title: "Emergency Bookings",
      value: emergencyBookings.length,
      icon: AlertTriangle,
    },
    { title: "Today Bookings", value: todayBookings, icon: CalendarCheck },
    { title: "Passengers", value: passengers, icon: Users },
    { title: "Offline Revenue", value: `₹${revenue}`, icon: IndianRupee },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div key={item.title} className="rounded-2xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500">{item.title}</p>
                <h3 className="mt-2 text-3xl font-bold text-blue-950">
                  {item.value}
                </h3>
              </div>

              <Icon size={30} className="text-blue-600" />
            </div>
          </div>
        );
      })}
    </div>
  );
}