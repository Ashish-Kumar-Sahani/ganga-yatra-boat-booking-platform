import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Anchor,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Star,
  ArrowRight,
  Waves
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/features/public/home/components/HeroSection";
import TrustSection from "@/features/public/home/components/TrustSection";
import PopularGhats from "@/features/public/home/components/PopularGhats";
import TopBoats from "@/features/public/home/components/TopBoats";
import { getCities } from "@/features/admin/cities/api/cityApi";
import type { City } from "@/features/admin/cities/types/city.types";

export default function Home() {
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    getCities()
      .then((data) => {
        setCities(Array.isArray(data) ? data.slice(0, 3) : []);
      })
      .catch((err) => {
        console.error("Cities fetch error:", err);
      })
      .finally(() => {
        setLoadingCities(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#f8faff] text-[#071b4d] font-sans antialiased">
      {/* 1. Public Navbar */}
      <Navbar />

      {/* 2. Hero Section (includes 3. Search Box) */}
      <HeroSection />

      {/* 4. Trust Cards */}
      <TrustSection />

      {/* 5. Popular Cities */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
            Explore Holy Cities
          </h2>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
            Discover river transit routes across cities
          </p>
        </div>

        {loadingCities ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-3xl bg-slate-100 h-52" />
            ))}
          </div>
        ) : cities.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm border border-slate-100">
            <p className="font-semibold text-slate-500">No active cities registered yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {cities.map((city) => (
              <div
                key={city._id}
                onClick={() => navigate(`/search-route?cityId=${city._id}`)}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute top-0 right-0 -mt-6 -mr-6 h-24 w-24 rounded-full bg-blue-50 group-hover:bg-blue-600 transition-colors duration-300 pointer-events-none" />
                
                <div className="relative z-10 space-y-4">
                  <div className="w-fit rounded-2xl bg-orange-100 p-3.5 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                    <MapPin size={22} />
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-800 transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 mt-1 uppercase">
                      {city.state || "Uttar Pradesh"}
                    </p>
                  </div>

                  <p className="flex items-center gap-1.5 text-sm font-bold text-blue-700">
                    <Waves size={16} />
                    <span>{city.riverName || "Ganga River"}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. Popular Ghats */}
      <PopularGhats />

      {/* 7. Top Boats */}
      <TopBoats />

      {/* 8. How It Works */}
      <section className="bg-white py-20 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center space-y-2 mb-16">
            <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
              How GangaYatra Works
            </h2>
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
              Four simple steps to your next river ride
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 relative">
            {/* Step 1 */}
            <div className="space-y-4 relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 font-extrabold text-blue-800 text-lg shadow-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">Select Route</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Choose your city, search and pick boarding & destination ghats with your travel date.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 font-extrabold text-orange-600 text-lg shadow-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">Choose Slot</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Select your preferred slot timings and certified boat types from the verified schedules.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 font-extrabold text-blue-800 text-lg shadow-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">Secure Booking</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Log in securely to make your digital ticket payment through safe wallets, cards, or UPI.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 font-extrabold text-orange-600 text-lg shadow-sm">
                4
              </div>
              <h3 className="text-lg font-bold text-slate-900">Board with QR</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Receive your digital QR ticket, scan at the boarding ghat, and enjoy your tracked ride.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Safety & Government Approval Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-12 grid gap-12 lg:grid-cols-2 items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-1 bg-green-50 px-4 py-1.5 rounded-full text-xs font-bold text-green-700 border border-green-200">
            <ShieldCheck size={14} />
            100% Regulated & Insured
          </span>

          <h2 className="text-3xl font-black text-slate-900 md:text-4xl leading-tight">
            Government Approved Safety Standards
          </h2>

          <p className="text-slate-500 leading-relaxed">
            GangaYatra works directly in partnership with the local municipal corporations and water transport authorities to standardize and regulate all passenger water transits. We enforce high safety requirements for all active boats on the river.
          </p>

          <ul className="space-y-3 font-semibold text-slate-700">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-green-600 shrink-0" size={18} />
              <span>Life Jackets equipped on every seat</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-green-600 shrink-0" size={18} />
              <span>Fully certified captains and support crew</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-green-600 shrink-0" size={18} />
              <span>Standard base fares, preventing local pricing scams</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-green-600 shrink-0" size={18} />
              <span>Continuous river patrol tracking coordinates</span>
            </li>
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-100 shadow-xl shadow-slate-100/50 aspect-video lg:aspect-square">
          <img
            src="/images/VaranasiBanner.png"
            alt="Safety Boat on Ganga"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply" />
        </div>
      </section>

      {/* 10. Why Choose GangaYatra */}
      <section className="bg-slate-50/50 py-20 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center space-y-2 mb-16">
            <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
              Why Tourists Choose Us
            </h2>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Modern River mobility features
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100/50 space-y-4">
              <div className="w-fit rounded-2xl bg-blue-50 p-4 text-blue-700">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Fixed Fares</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Transparent base pricing. Say goodbye to stressful bargains and pricing uncertainties on the ghat steps.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100/50 space-y-4">
              <div className="w-fit rounded-2xl bg-orange-50 p-4 text-orange-500">
                <Anchor size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Tracked Rides</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Share your coordinates and view active boat positions live, ensuring high standards of passenger safety.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100/50 space-y-4">
              <div className="w-fit rounded-2xl bg-blue-50 p-4 text-blue-700">
                <QrCode size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Digital QR Convenience</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Fast and paperless boarding. Scan the booking QR code on your phone to check-in with the crew.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Reviews / Testimonials placeholder */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center space-y-2 mb-16">
          <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
            Customer Testimonials
          </h2>
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            Hear from hundreds of happy travelers
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Review 1 */}
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100 space-y-4 relative">
            <div className="flex gap-1 text-orange-400">
              <Star size={16} className="fill-orange-400" />
              <Star size={16} className="fill-orange-400" />
              <Star size={16} className="fill-orange-400" />
              <Star size={16} className="fill-orange-400" />
              <Star size={16} className="fill-orange-400" />
            </div>
            <p className="text-sm italic text-slate-600 leading-relaxed">
              "Booking a morning ride at Assi Ghat used to be so stressful with constant haggling. With GangaYatra, I got a fixed fare ticket online in 2 minutes. The boat was super clean, and life jackets were provided. High recommended!"
            </p>
            <div>
              <p className="font-extrabold text-slate-900 text-sm">Aarav Sharma</p>
              <p className="text-xs text-slate-400 font-semibold uppercase">Mumbai, tourist</p>
            </div>
          </div>

          {/* Review 2 */}
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100 space-y-4 relative">
            <div className="flex gap-1 text-orange-400">
              <Star size={16} className="fill-orange-400" />
              <Star size={16} className="fill-orange-400" />
              <Star size={16} className="fill-orange-400" />
              <Star size={16} className="fill-orange-400" />
              <Star size={16} className="fill-orange-400" />
            </div>
            <p className="text-sm italic text-slate-600 leading-relaxed">
              "The live boat tracking is awesome. I could see exactly when our booking was approaching the boarding ghat. Very professional crew, and digital payments meant I didn't need to carry physical cash on the river."
            </p>
            <div>
              <p className="font-extrabold text-slate-900 text-sm">Priya Patel</p>
              <p className="text-xs text-slate-400 font-semibold uppercase">Gujarat, traveler</p>
            </div>
          </div>

          {/* Review 3 */}
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100 space-y-4 relative">
            <div className="flex gap-1 text-orange-400">
              <Star size={16} className="fill-orange-400" />
              <Star size={16} className="fill-orange-400" />
              <Star size={16} className="fill-orange-400" />
              <Star size={16} className="fill-orange-400" />
              <Star size={16} className="fill-orange-400" />
            </div>
            <p className="text-sm italic text-slate-600 leading-relaxed">
              "Very smooth customer dashboard. We easily booked tickets for a family tour to watch the evening Ganga Aarti. QR check-in was fast, and the captain was extremely cooperative."
            </p>
            <div>
              <p className="font-extrabold text-slate-900 text-sm">Amit Verma</p>
              <p className="text-xs text-slate-400 font-semibold uppercase">Delhi, family tour</p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Call To Action */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[2.5rem] bg-[#05112e] px-8 py-16 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.1),transparent)] pointer-events-none" />
          
          <h2 className="text-3xl font-black md:text-4xl max-w-2xl mx-auto leading-tight">
            Ready to Experience the Ghats Safely?
          </h2>
          
          <p className="max-w-xl mx-auto text-slate-300 font-medium">
            Search active routes, select times, and purchase secure digital ride tickets instantly.
          </p>

          <button
            onClick={() => navigate("/search-route")}
            className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:shadow-orange-600/30 transition duration-200"
          >
            Start Search Now
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* 13. Footer */}
      <Footer />
    </main>
  );
}