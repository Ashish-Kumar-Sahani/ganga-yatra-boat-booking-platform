type Props = {
  title: string;
  value: string | number;
  link: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple";
};

const colorMap = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
  purple: "bg-purple-50 text-purple-700",
};

export default function CustomerStatCard({
  title,
  value,
  link,
  icon,
  color,
}: Props) {
  return (
    <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-5">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl ${colorMap[color]}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm font-extrabold text-blue-950">{title}</p>
          <h2 className="mt-1 text-3xl font-black text-blue-950">{value}</h2>
          <button className="mt-2 text-sm font-bold text-blue-700">
            {link} →
          </button>
        </div>
      </div>
    </div>
  );
}