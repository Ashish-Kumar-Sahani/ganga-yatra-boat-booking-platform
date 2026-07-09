import { useNavigate } from "react-router-dom";
import { Anchor, MapPin } from "lucide-react";
import SearchBox from "./SearchBox";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      className="relative flex min-h-[500px] w-full flex-col items-center justify-center bg-cover bg-center py-20 px-6 text-center text-white"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(3, 15, 41, 0.75), rgba(5, 23, 62, 0.85)), url('/images/VaranasiBanner.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Decorative Blur */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.15),transparent)] pointer-events-none" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center justify-center pt-16">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-200">
          <Anchor size={14} className="text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
          Verified Safe River Transit
        </span>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight leading-tight md:text-5xl lg:text-6xl max-w-4xl">
          Book Safe Boat Rides <br />
          Across <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">Varanasi Ghats</span>
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-base font-medium text-slate-200 md:text-lg lg:text-xl">
          Explore Ganga ghats with verified boats, transparent fares, live tracking, and secure digital tickets.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/search-route")}
            className="flex items-center gap-2 rounded-2xl bg-orange-500 px-7 py-3.5 font-bold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 hover:shadow-orange-600/35 transition duration-200"
          >
            <Anchor size={18} />
            Search Routes
          </button>

          <button
            onClick={() => navigate("/ghats")}
            className="flex items-center gap-2 rounded-2xl bg-white/10 border border-white/20 backdrop-blur px-7 py-3.5 font-bold text-white hover:bg-white/20 transition duration-200"
          >
            <MapPin size={18} className="text-orange-400" />
            Explore Ghats
          </button>
        </div>

        {/* Real Live Search Box */}
        <div className="w-full mt-10">
          <SearchBox />
        </div>
      </div>
    </section>
  );
}