import { useNavigate } from "react-router-dom";
import { ShieldCheck, Navigation, Heart, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="mt-20 border-t border-slate-100 bg-[#05102a] text-slate-400">
      {/* Top Footer Sections */}
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 md:grid-cols-4 lg:px-12">
        {/* Brand Info */}
        <div className="space-y-4">
          <div
            onClick={() => navigate("/")}
            className="flex cursor-pointer items-center gap-2 text-2xl font-black text-white"
          >
            <span className="text-3xl text-orange-500">⛵</span>
            <div>
              <span className="font-extrabold text-white">Ganga</span>
              <span className="font-bold text-orange-500">Yatra</span>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Book safe, verified boat rides across Varanasi's sacred ghats. Our multi-city platform ensures fare transparency, live tracking, and digital convenience.
          </p>
          <div className="flex gap-4 pt-2">
            <span className="rounded-full bg-slate-800 p-2 text-white hover:bg-slate-700 cursor-pointer transition">
              <ShieldCheck size={18} />
            </span>
            <span className="rounded-full bg-slate-800 p-2 text-white hover:bg-slate-700 cursor-pointer transition">
              <Navigation size={18} />
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Explore</h4>
          <ul className="mt-4 space-y-3.5 text-sm font-semibold">
            <li>
              <button onClick={() => navigate("/")} className="hover:text-white transition-colors">
                Home Page
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/cities")} className="hover:text-white transition-colors">
                Explore Cities
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/ghats")} className="hover:text-white transition-colors">
                Explore Ghats
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/search-route")} className="hover:text-white transition-colors">
                Search Boat Routes
              </button>
            </li>
          </ul>
        </div>

        {/* Safety & Trust */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Safety & Policies</h4>
          <ul className="mt-4 space-y-3.5 text-sm">
            <li>
              <span className="text-slate-400 font-semibold block">Verified Crew</span>
              <span className="text-xs text-slate-500">All operators hold verified permits</span>
            </li>
            <li>
              <span className="text-slate-400 font-semibold block">Life Jackets Mandatory</span>
              <span className="text-xs text-slate-500">Safety gear equipped on every ride</span>
            </li>
            <li>
              <span className="text-slate-400 font-semibold block">Government Approved Ready</span>
              <span className="text-xs text-slate-500">Compliance with local water-transit rules</span>
            </li>
          </ul>
        </div>

        {/* Contacts */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Get in Touch</h4>
          <div className="mt-4 space-y-3 text-sm font-semibold text-slate-400">
            <p className="flex items-center gap-3">
              <Phone size={16} className="text-orange-500 shrink-0" />
              <span>+91 542 245 1234</span>
            </p>
            <p className="flex items-center gap-3">
              <Mail size={16} className="text-orange-500 shrink-0" />
              <span>support@gangayatra.gov.in</span>
            </p>
            <p className="flex items-center gap-3">
              <MapPin size={16} className="text-orange-500 shrink-0" />
              <span>Assi Ghat Office, Varanasi, UP, India</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom copyright line */}
      <div className="border-t border-slate-800 bg-[#030a1c] py-6 text-center text-xs">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row text-slate-500">
          <p>&copy; {new Date().getFullYear()} GangaYatra platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={12} className="text-red-500 animate-pulse" /> for safe river tourism.
          </p>
        </div>
      </div>
    </footer>
  );
}
