import { CalendarCheck, Ship, Star } from "lucide-react";
import CustomerStatCard from "./CustomerStatCard";

type Props = {
  stats: {
    upcomingBookings: number;
    totalRides: number;
    completedRides: number;
    cancelledBookings: number;
    totalSpent: number;
    loyaltyPoints: number;
  };
};

export default function CustomerStatsGrid({ stats }: Props) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <CustomerStatCard
        title="Upcoming Booking"
        value={stats.upcomingBookings}
        link="View Details"
        icon={<CalendarCheck />}
        color="blue"
      />

      <CustomerStatCard
        title="Total Rides"
        value={stats.totalRides}
        link="Explore More"
        icon={<Ship />}
        color="green"
      />

      <CustomerStatCard
        title="Loyalty Points"
        value={stats.loyaltyPoints}
        link="Redeem Now"
        icon={<Star />}
        color="purple"
      />
    </section>
  );
}