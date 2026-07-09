import { CalendarCheck, CheckCircle, XCircle, CreditCard } from "lucide-react";
import type { StaffBooking } from "../types/booking.types";

type Props = {
  bookings?: StaffBooking[];
};

export default function BookingStats({ bookings = [] }: Props) {
  const stats = [
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: CalendarCheck,
    },
    {
      title: "Confirmed",
      value: bookings.filter((b) => b.bookingStatus === "CONFIRMED").length,
      icon: CheckCircle,
    },
    {
      title: "Cancelled",
      value: bookings.filter((b) => b.bookingStatus === "CANCELLED").length,
      icon: XCircle,
    },
    {
      title: "Paid",
      value: bookings.filter((b) => b.paymentStatus === "PAID").length,
      icon: CreditCard,
    },
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