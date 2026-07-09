import { useEffect } from "react";
import { BadgePercent, Ticket } from "lucide-react";
import AdminPageHeader from "@/features/admin/analytics/components/AdminPageHeader";
import AdminStatsGrid from "@/features/admin/analytics/components/AdminStatsGrid";
import OfferTable from "@/features/admin/offers/components/OfferTable";
import { useOfferStore } from "../store/offerStore";

export default function Offers() {
  const { offers, fetchOffers } = useOfferStore();

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const activeOffers = offers.filter(o => o.isActive && new Date() <= new Date(o.validTill));

  const stats = [
    { title: "Total Coupons", value: offers.length.toLocaleString(), icon: Ticket },
    { title: "Active Campaigns", value: activeOffers.length.toLocaleString(), icon: BadgePercent },
  ];

  return (
    <div className="p-6">
      <AdminPageHeader
        title="Offers & Coupons"
        description="Monitor, update and verify promotional campaigns and discount codes"
      />
      <div className="max-w-md">
        <AdminStatsGrid stats={stats} />
      </div>
      <OfferTable />
    </div>
  );
}