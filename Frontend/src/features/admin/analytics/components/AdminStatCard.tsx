import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string;
  icon: LucideIcon;
};

export default function AdminStatCard({
  title,
  value,
  icon: Icon,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {value}
          </h3>
        </div>

        <Icon
          size={32}
          className="text-blue-600"
        />
      </div>
    </div>
  );
}