import { CreditCard, IndianRupee, Receipt, Wallet } from "lucide-react";
import type { StaffPaymentBooking } from "../types/payment.types";

type Props = {
  bookings?: StaffPaymentBooking[];
};

const money = (value: number) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function PaymentStats({ bookings = [] }: Props) {
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  const paidBookings = safeBookings.filter((b) => b.paymentStatus === "PAID");
  const pendingBookings = safeBookings.filter(
    (b) => b.paymentStatus === "PENDING"
  );

  const totalRevenue = paidBookings.reduce(
    (sum, item) => sum + Number(item.totalAmount || 0),
    0
  );

  const offlineRevenue = paidBookings
    .filter((b) => b.bookingType === "OFFLINE")
    .reduce((sum, item) => sum + Number(item.totalAmount || 0), 0);

  const onlineRevenue = paidBookings
    .filter((b) => b.bookingType === "ONLINE")
    .reduce((sum, item) => sum + Number(item.totalAmount || 0), 0);

  const stats = [
    { title: "Total Revenue", value: money(totalRevenue), icon: IndianRupee },
    { title: "Paid Bookings", value: paidBookings.length, icon: Receipt },
    { title: "Pending Payments", value: pendingBookings.length, icon: CreditCard },
    { title: "Offline Cash", value: money(offlineRevenue), icon: Wallet },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div key={item.title} className="rounded-2xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  {item.title}
                </p>
                <h3 className="mt-2 text-2xl font-black text-blue-950">
                  {item.value}
                </h3>
              </div>

              <div className="rounded-xl bg-blue-50 p-3">
                <Icon size={28} className="text-blue-600" />
              </div>
            </div>
          </div>
        );
      })}

      <div className="rounded-2xl bg-white p-6 shadow md:col-span-2 xl:col-span-4">
        <p className="text-sm font-semibold text-slate-500">Revenue Split</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-xs font-bold text-slate-500">Online</p>
            <h4 className="mt-1 text-xl font-black text-blue-700">
              {money(onlineRevenue)}
            </h4>
          </div>

          <div className="rounded-xl bg-green-50 p-4">
            <p className="text-xs font-bold text-slate-500">Offline</p>
            <h4 className="mt-1 text-xl font-black text-green-700">
              {money(offlineRevenue)}
            </h4>
          </div>

          <div className="rounded-xl bg-orange-50 p-4">
            <p className="text-xs font-bold text-slate-500">Emergency</p>
            <h4 className="mt-1 text-xl font-black text-orange-700">
              {money(
                paidBookings
                  .filter((b) => b.bookingType === "EMERGENCY")
                  .reduce((sum, item) => sum + Number(item.totalAmount || 0), 0)
              )}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}