

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: any;
  trend?: string;
  trendType?: "up" | "down" | "neutral";
  colorClass?: string;
  loading?: boolean;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendType = "neutral",
  colorClass = "text-blue-600 bg-blue-50/50 dark:bg-blue-900/20",
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <div className="h-28 animate-pulse rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm" />
    );
  }

  return (
    <div className="rounded-3xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
          {label}
        </span>
        {Icon && (
          <div className={`rounded-2xl p-2.5 shrink-0 ${colorClass}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <h3 className="mt-2 text-2xl font-black text-slate-800 dark:text-white">
        {value}
      </h3>
      {trend && (
        <p
          className={`mt-1.5 text-[10px] font-bold ${
            trendType === "up"
              ? "text-green-600"
              : trendType === "down"
              ? "text-red-600"
              : "text-slate-400"
          }`}
        >
          {trend}
        </p>
      )}
    </div>
  );
}
