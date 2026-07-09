import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import RouteResultCard from "@/features/customer/search/components/RouteResultCard";
import MonthlySlotCalendar from "@/features/customer/search/components/MonthlySlotCalendar";
import { getLocalDateKey } from "@/utils/dateKey";

import {
  getSlots,
  getMonthlySlotAvailability,
} from "@/features/owner/slots/api/slotApi";

import type { MonthlySlotAvailability } from "@/features/owner/slots/types/slot.types";

export default function SearchResults() {
  const [searchParams] = useSearchParams();

  const [slots, setSlots] = useState<any[]>([]);
  const [monthData, setMonthData] = useState<MonthlySlotAvailability[]>([]);
  const [selectedDate, setSelectedDate] = useState("");

  const sourceGhatId = searchParams.get("sourceGhatId");
  const destinationGhatId = searchParams.get("destinationGhatId");
  const routeId = searchParams.get("routeId");
  const date = searchParams.get("date");

  const activeMonth = date
    ? date.slice(0, 7)
    : new Date().toISOString().slice(0, 7);

  useEffect(() => {
    if (date) {
      setSelectedDate(date);
    }
  }, [date]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (routeId) {
          const monthly = await getMonthlySlotAvailability(routeId, activeMonth);
          setMonthData(Array.isArray(monthly) ? monthly : []);
        }

        const allSlots = await getSlots();

        const filtered = allSlots.filter((slot: any) => {
          const route = slot.scheduleId?.routeId;

          return (
            route?.sourceGhatId?._id === sourceGhatId &&
            route?.destinationGhatId?._id === destinationGhatId &&
            slot.status === "OPEN"
          );
        });

        setSlots(filtered);
      } catch (error) {
        console.error("Search results error:", error);
        setSlots([]);
        setMonthData([]);
      }
    };

    fetchData();
  }, [sourceGhatId, destinationGhatId, routeId, activeMonth]);

const visibleSlots = selectedDate
  ? slots.filter((slot) => getLocalDateKey(slot.slotDate) === selectedDate)
  : slots;

  return (
    <main className="min-h-screen bg-[#f5f8ff] text-[#071b4d]">

      <section className="mx-auto max-w-7xl px-6 pt-28">
        <div className="rounded-3xl bg-blue-700 p-8 text-white">
          <h1 className="text-4xl font-black">Available Boat Routes</h1>
          <p className="mt-2 text-blue-100">
            Select your preferred date and schedule.
          </p>
        </div>

        {monthData.length > 0 && (
          <div className="mt-8">
            <MonthlySlotCalendar
              monthData={monthData}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>
        )}

        <div className="mt-8 grid gap-6">
          {visibleSlots.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center shadow">
              No boats available for this date.
            </div>
          ) : (
            visibleSlots.map((slot) => (
              <RouteResultCard key={slot._id} slot={slot} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}