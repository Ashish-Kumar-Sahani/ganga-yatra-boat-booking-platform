import { Bell, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  customerName?: string;
};

export default function CustomerDashboardHeader({ customerName }: Props) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome, {customerName || "Customer"} 👋
        </h2>
        <p className="text-sm text-slate-500">
          Manage your GangaYatra bookings easily
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-full bg-blue-50 p-3 text-blue-700">
          <Bell size={20} />
        </button>

        <button
          onClick={() => navigate("/customer/profile")}
          className="rounded-full bg-blue-50 p-3 text-blue-700"
        >
          <UserCircle size={22} />
        </button>
      </div>
    </header>
  );
}