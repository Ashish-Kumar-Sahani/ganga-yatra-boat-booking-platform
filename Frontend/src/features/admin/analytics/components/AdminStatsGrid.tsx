import AdminStatCard from "@/features/admin/analytics/components/AdminStatCard";

type Props = {
  stats: any[];
};

export default function AdminStatsGrid({
  stats,
}: Props) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <AdminStatCard
          key={item.title}
          {...item}
        />
      ))}
    </div>
  );
}