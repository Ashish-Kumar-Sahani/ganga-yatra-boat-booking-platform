import { CalendarDays, MapPin, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGhats } from "@/features/admin/ghats/api/ghatApi";

type Props = {
  customerName?: string;
};

export default function CustomerHeroSearch({ customerName }: Props) {
  const navigate = useNavigate();

  const [ghats, setGhats] = useState<any[]>([]);
  const [form, setForm] = useState({
    sourceGhatId: "",
    destinationGhatId: "",
    date: "",
    passengers: "1",
  });

  useEffect(() => {
    getGhats()
      .then((data) => setGhats(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const handleSearch = () => {
    if (!form.sourceGhatId || !form.destinationGhatId || !form.date) {
      alert("Please select from ghat, to ghat and date");
      return;
    }

    if (form.sourceGhatId === form.destinationGhatId) {
      alert("Source and destination cannot be same");
      return;
    }

    const query = new URLSearchParams({
      sourceGhatId: form.sourceGhatId,
      destinationGhatId: form.destinationGhatId,
      date: form.date,
      passengers: form.passengers,
    });
    navigate(`/customer/search?${query.toString()}`);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-900">
      <img
        src="/images/VaranasiBanner.png"
        alt="Varanasi"
        className="absolute inset-0 h-full w-full object-cover opacity-90"
      />

      <div className="relative min-h-[330px] p-8">
        <p className="text-lg font-extrabold text-blue-950">
          Welcome back, {customerName || "Customer"} 👋
        </p>

        <h1 className="mt-4 max-w-xl text-4xl font-black leading-tight text-blue-950 md:text-5xl">
          Experience the Divine Boat Rides in{" "}
          <span className="text-blue-700">Varanasi</span>
        </h1>

        <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-slate-900">
          <span className="flex items-center gap-1">
            <ShieldCheck size={17} className="text-green-600" /> Safe
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck size={17} className="text-green-600" /> Verified
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck size={17} className="text-green-600" /> Government Approved
          </span>
        </div>

        <div className="absolute bottom-5 left-1/2 w-[88%] -translate-x-1/2 rounded-3xl bg-white p-5 shadow-xl">
          <div className="grid gap-4 md:grid-cols-5">
            <SearchSelect
              icon={<MapPin />}
              title="From Ghat"
              value={form.sourceGhatId}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, sourceGhatId: value }))
              }
              options={ghats}
            />

            <SearchSelect
              icon={<MapPin />}
              title="To Ghat"
              value={form.destinationGhatId}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, destinationGhatId: value }))
              }
              options={ghats}
            />

            <div className="flex items-center gap-3 border-r border-blue-100">
              <CalendarDays className="text-blue-700" />
              <div>
                <p className="text-sm font-bold text-blue-900">Date</p>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full text-sm text-slate-600 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 border-r border-blue-100">
              <User className="text-blue-700" />
              <div>
                <p className="text-sm font-bold text-blue-900">Passengers</p>
                <input
                  type="number"
                  min={1}
                  value={form.passengers}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, passengers: e.target.value }))
                  }
                  className="w-full text-sm text-slate-600 outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="rounded-xl bg-blue-700 px-6 py-4 text-sm font-extrabold text-white"
            >
              Search Boats
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchSelect({
  icon,
  title,
  value,
  onChange,
  options,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  onChange: (value: string) => void;
  options: any[];
}) {
  return (
    <div className="flex items-center gap-3 border-r border-blue-100">
      <div className="text-blue-700">{icon}</div>
      <div className="w-full">
        <p className="text-sm font-bold text-blue-900">{title}</p>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-600 outline-none"
        >
          <option value="">Select ghat</option>
          {options.map((ghat) => (
            <option key={ghat._id} value={ghat._id}>
              {ghat.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}