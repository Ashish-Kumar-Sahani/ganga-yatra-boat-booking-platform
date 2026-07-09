import { CalendarDays, Clock, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function OwnerHero() {
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
      className="relative overflow-hidden rounded-3xl bg-cover bg-center px-8 py-10"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(255,255,255,0.88), rgba(255,255,255,0.28)), url('/images/VaranasiBanner.png')",
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

      <div className="mt-8 max-w-3xl">
        <p className="text-xl font-semibold text-blue-950">
          Welcome back, Boat Owner! 👋
        </p>

        <h1 className="mt-4 text-5xl font-extrabold leading-tight text-blue-950">
          Grow Your Business with <br />
          <span className="text-blue-600">GangaYatra</span> in Varanasi
        </h1>

        <p className="mt-5 flex items-center gap-2 text-lg font-semibold text-blue-950">
          <ShieldCheck className="text-green-600" />
          Safe • Verified • Government Approved
        </p>
      </div>
    </section>
  );
}