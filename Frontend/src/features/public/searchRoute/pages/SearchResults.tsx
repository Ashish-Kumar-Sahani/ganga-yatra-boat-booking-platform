import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Ship, AlertCircle } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RouteResultCard from "../components/RouteResultCard";
import MonthlySlotCalendar from "@/features/customer/search/components/MonthlySlotCalendar";
import axiosInstance from "@/api/axiosInstance";
import { getMonthlySlotAvailability } from "@/features/owner/slots/api/slotApi";
import type { MonthlySlotAvailability as MonthlyType } from "@/features/owner/slots/types/slot.types";

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [slots, setSlots] = useState<any[]>([]);
  const [monthData, setMonthData] = useState<MonthlyType[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cityId = searchParams.get("cityId") || "";
  const sourceGhatId = searchParams.get("sourceGhatId") || "";
  const destinationGhatId = searchParams.get("destinationGhatId") || "";
  const routeId = searchParams.get("routeId") || "";
  const date = searchParams.get("date") || "";

  const activeMonth = selectedDate
    ? selectedDate.slice(0, 7)
    : date
    ? date.slice(0, 7)
    : new Date().toISOString().slice(0, 7);

  useEffect(() => {
    if (date) {
      setSelectedDate(date);
    }
  }, [date]);

  useEffect(() => {
    const fetchData = async () => {
      if (!sourceGhatId || !destinationGhatId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch monthly slot availability calendar if routeId exists
        if (routeId) {
          try {
            const monthly = await getMonthlySlotAvailability(routeId, activeMonth);
            setMonthData(Array.isArray(monthly) ? monthly : []);
          } catch (mErr) {
            console.error("Monthly slot availability error:", mErr);
            setMonthData([]);
          }
        }

        // Fetch available slots from the new public endpoint
        const response = await axiosInstance.get("/search/routes", {
          params: {
            cityId,
            sourceGhatId,
            destinationGhatId,
            date: selectedDate || date,
          },
        });

        setSlots(Array.isArray(response.data) ? response.data : []);
      } catch (err: any) {
        console.error("Search results fetch error:", err);
        setError("Search query failed. Please verify selections and retry.");
        setSlots([]);
        setMonthData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cityId, sourceGhatId, destinationGhatId, routeId, selectedDate, date, activeMonth]);

  const handleSelectDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    // Update URL parameter
    const params = new URLSearchParams(searchParams);
    params.set("date", newDate);
    navigate(`/search?${params.toString()}`, { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#f8faff] text-[#071b4d] flex flex-col justify-between">
      <div>
        <Navbar />

        <section className="mx-auto max-w-5xl px-6 pt-32 pb-16 w-full lg:px-12">
          {/* Header */}
          <div className="rounded-[2rem] bg-blue-800 p-8 text-white shadow-xl relative overflow-hidden mb-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent)] pointer-events-none" />
            <div className="relative z-10 space-y-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/25 border border-blue-400/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-blue-200">
                <Ship size={12} /> Live Availability
              </span>
              <h1 className="text-3xl font-black md:text-4xl">Available Boat Rides</h1>
              <p className="text-blue-100 text-sm font-semibold">
                Compare boat times, capacities, and fare pricing. Book directly.
              </p>
            </div>
          </div>

          {/* Monthly slot availability calendar */}
          {monthData.length > 0 && (
            <div className="mb-8">
              <MonthlySlotCalendar
                monthData={monthData}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDateChange}
              />
            </div>
          )}

          {/* Results list */}
          <div className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse rounded-3xl bg-slate-100 h-28" />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-3xl bg-red-50 border border-red-100 p-8 text-center">
                <p className="font-bold text-red-700">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 rounded-xl bg-red-650 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 transition animate-bounce"
                >
                  Refresh Results
                </button>
              </div>
            ) : slots.length === 0 ? (
              <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-3">
                <AlertCircle className="text-slate-300 w-12 h-12" />
                <div>
                  <p className="font-extrabold text-slate-800 text-lg">No Boat Rides Found</p>
                  <p className="text-slate-400 text-xs mt-1 font-semibold">
                    No active slots were scheduled on {selectedDate || "the selected date"} for this route.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/search-route")}
                  className="mt-2 rounded-xl border border-blue-700/20 px-5 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition"
                >
                  Adjust Filters
                </button>
              </div>
            ) : (
              slots.map((slot) => (
                <RouteResultCard key={slot.slotId || slot._id} slot={slot} />
              ))
            )}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
