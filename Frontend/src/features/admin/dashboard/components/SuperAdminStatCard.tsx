import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string;
  growth: string;
  icon: LucideIcon;
};

export default function SuperAdminStatCard({
  title,
  value,
  growth,
  icon: Icon,
}: Props) {
  return (
    <div className="flex items-center gap-5 rounded-2xl bg-white/90 p-6 shadow-lg backdrop-blur">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
        <Icon size={30} />
      </div>

      <div>
        <p className="text-sm font-semibold text-blue-950">{title}</p>
        <h2 className="mt-1 text-2xl font-extrabold text-blue-950">
          {value}
        </h2>
        <p className="mt-1 text-sm font-semibold text-green-600">{growth}</p>
      </div>
    </div>
  );
}