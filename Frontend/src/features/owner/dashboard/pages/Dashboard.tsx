import { useEffect } from "react";

import OwnerHero from "@/features/owner/dashboard/components/OwnerHero";
import OwnerStats from "@/features/owner/dashboard/components/OwnerStats";
import OwnerBookingChart from "@/features/owner/dashboard/components/OwnerBookingChart";
import OwnerBoatTypeChart from "@/features/owner/dashboard/components/OwnerBoatTypeChart";
import OwnerEarningsChart from "@/features/owner/earnings/components/OwnerEarningsChart";
import OwnerRecentBookings from "@/features/owner/dashboard/components/OwnerRecentBookings";
import OwnerBoatStatus from "@/features/owner/dashboard/components/OwnerBoatStatus";
import OwnerReviews from "@/features/owner/dashboard/components/OwnerReviews";
import OwnerTodaySlots from "@/features/owner/slots/components/OwnerTodaySlots";
import {
  useOwnerStore,
} from "@/features/owner/dashboard/store/ownerStore";

export default function Dashboard() {
  const {
    dashboard,
    loading,
    fetchDashboard,
  } = useOwnerStore();

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(() => {
      fetchDashboard();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="p-5">
      <OwnerHero />

      <OwnerStats dashboard={dashboard} />
      <OwnerTodaySlots />
      <section className="mt-5 grid gap-5 xl:grid-cols-3">
        <OwnerBookingChart dashboard={dashboard} />
        <OwnerBoatTypeChart dashboard={dashboard} />
       <OwnerEarningsChart dashboard={dashboard} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-3">
       <OwnerRecentBookings dashboard={dashboard} />
        <OwnerBoatStatus dashboard={dashboard} />
        <OwnerReviews dashboard={dashboard} />
      </section>
    </div>
  );
}