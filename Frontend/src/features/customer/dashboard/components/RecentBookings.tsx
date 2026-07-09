import { useNavigate } from "react-router-dom";
import BookingMiniCard from "./BookingMiniCard";
import CustomerEmptyCard from "./CustomerEmptyCard";
import type { CustomerDashboardBooking } from "@/features/customer/dashboard/types/customerDashboard.types";

type Props = {
  bookings: CustomerDashboardBooking[];
  loading: boolean;
};

export default function RecentBookings({ bookings, loading }: Props) {
  const navigate = useNavigate();

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900">Recent Bookings</h3>

        <button
          onClick={() => navigate("/customer/bookings")}
          className="text-sm font-bold text-blue-700"
        >
          View All
        </button>
      </div>

      {loading && (
        <div className="rounded-3xl bg-white p-6 font-bold text-blue-700">
          Loading bookings...
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <CustomerEmptyCard text="No recent bookings found." />
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {bookings.map((booking) => (
          <BookingMiniCard key={booking._id} booking={booking} />
        ))}
      </div>
    </section>
  );
}