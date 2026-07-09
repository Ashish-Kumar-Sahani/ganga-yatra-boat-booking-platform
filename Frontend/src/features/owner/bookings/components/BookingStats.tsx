import { CalendarCheck, CheckCircle, IndianRupee, Users } from "lucide-react";
import type { Booking } from "@/features/owner/bookings/types/booking.types";

type Props = {
  bookings?: Booking[];
};

export default function BookingStats({ bookings = [] }: Props) {
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  const passengers = safeBookings.reduce(
    (sum, booking) => sum + (booking.seatsBooked || 0),
    0
  );

  const revenue = safeBookings.reduce(
    (sum, booking) => sum + (booking.totalAmount || 0),
    0
  );

  const confirmed = safeBookings.filter(
    (booking) => booking.bookingStatus === "CONFIRMED"
  ).length;

  const stats = [
    { title: "Total Bookings", value: safeBookings.length, icon: CalendarCheck },
    { title: "Confirmed", value: confirmed, icon: CheckCircle },
    { title: "Passengers", value: passengers, icon: Users },
    { title: "Revenue", value: `₹${revenue}`, icon: IndianRupee },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div key={item.title} className="rounded-2xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500">{item.title}</p>
                <h3 className="mt-2 text-3xl font-bold">{item.value}</h3>
              </div>

              <Icon size={30} className="text-blue-600" />
            </div>
          </div>
        );
      })}
    </div>
  );
}