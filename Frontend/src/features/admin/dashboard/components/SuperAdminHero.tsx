import { CalendarDays, Clock,} from "lucide-react";
import { useEffect, useState } from "react";
import SuperAdminStats from "./SuperAdminStats";
// import ghatBanner from "../public/images/VaranasiBanner.png";

export default function SuperAdminHero() {
  const [currentDateTime, setCurrentDateTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setCurrentDateTime(
        now.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <section
    className="relative min-h-[390px] bg-cover bg-center px-8 py-12"
   style={{
  backgroundImage:
    "linear-gradient(90deg, rgba(255,255,255,0.92), rgba(255,255,255,0.35)), url('/images/VaranasiBanner.png')",
}}
    >
 <div className="flex justify-end">
        <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white/95 px-5 py-3 shadow-lg backdrop-blur">
          <CalendarDays size={18} className="text-blue-600" />

          <div>
            <p className="text-xs text-slate-500">Current Time</p>
            <p className="font-bold text-blue-950">{currentDateTime}</p>
          </div>

          <Clock size={18} className="text-green-600" />
        </div>
      </div>

      <div className="mt-6 max-w-3xl">
        <p className="text-xl font-semibold text-blue-950">
          Welcome back, Super Admin! 👋
        </p>

        <h1 className="mt-4 text-5xl font-extrabold leading-tight text-blue-950">
          Manage & Grow <br />
          <span className="text-blue-600">Varanasi</span> Boat Experiences
        </h1>

        <p className="mt-4 text-xl font-semibold text-blue-950">
          Monitor • Manage • Maximize
        </p>
      </div>

      <SuperAdminStats />
    </section>
  );
}