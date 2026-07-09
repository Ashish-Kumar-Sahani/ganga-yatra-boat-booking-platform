import { useEffect, useState } from "react";

import OwnerSlotCalendar from "@/features/owner/slots/components/OwnerSlotCalendar";
import SlotStats from "@/features/owner/slots/components/SlotStats";
import SlotTable from "@/features/owner/slots/components/SlotTable";
import SlotGeneratePanel from "@/features/owner/slots/components/SlotGeneratePanel";
import SlotPassengersDrawer from "@/features/owner/slots/components/SlotPassengerDrawer";

import { useSlotStore } from "../store/slotStore";
import { getMySchedules } from "@/features/owner/schedules/api/scheduleApi";
import {
  generateSlots,
  getSlotPassengers,
} from "@/features/owner/slots/api/slotApi";
import { getLocalDateKey } from "@/utils/dateKey";

export default function MySlots() {
  const { slots, loading, error, fetchMonthlySlots } = useSlotStore();

  const [days, setDays] = useState(30);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedDate, setSelectedDate] = useState("");

  const [schedules, setSchedules] = useState<any[]>([]);
  const [scheduleId, setScheduleId] = useState("");
  const [generateDays, setGenerateDays] = useState(30);
  const [generating, setGenerating] = useState(false);

  const [passengerOpen, setPassengerOpen] = useState(false);
  const [passengerData, setPassengerData] = useState<any>(null);
  const [passengerLoading, setPassengerLoading] = useState(false);

  useEffect(() => {
    fetchMonthlySlots(days);
    setSelectedDate("");
  }, [days, fetchMonthlySlots]);

  useEffect(() => {
    getMySchedules()
      .then((data) => setSchedules(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const handleGenerateSlots = async () => {
    try {
      if (!scheduleId) {
        alert("Please select schedule");
        return;
      }

      setGenerating(true);

      await generateSlots({
        scheduleId,
        days: generateDays,
      });

      alert("Slots generated successfully");
      await fetchMonthlySlots(days);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Slot generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleViewPassengers = async (slotId: string) => {
    try {
      setPassengerLoading(true);
      setPassengerOpen(true);

      const data = await getSlotPassengers(slotId);
      setPassengerData(data);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Passengers fetch failed");
      setPassengerOpen(false);
    } finally {
      setPassengerLoading(false);
    }
  };

  const safeSlots = Array.isArray(slots) ? slots : [];

  const filteredSlots =
    statusFilter === "ALL"
      ? safeSlots
      : safeSlots.filter((slot) => slot.status === statusFilter);

  const dateFilteredSlots = selectedDate
    ? filteredSlots.filter(
        (slot) =>
         getLocalDateKey(slot.slotDate) === selectedDate
      )
    : filteredSlots;

  return (
    <div className="space-y-6 p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">
            30 Days Slot Planner
          </h1>

          <p className="text-slate-500">
            Manage slots, availability, passengers and trip preparation
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="rounded-xl border bg-white px-4 py-3"
          >
            <option value={7}>Next 7 Days</option>
            <option value={15}>Next 15 Days</option>
            <option value={30}>Next 30 Days</option>
            <option value={60}>Next 60 Days</option>
            <option value={90}>Next 90 Days</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setSelectedDate("");
            }}
            className="rounded-xl border bg-white px-4 py-3"
          >
            <option value="ALL">All Status</option>
            <option value="OPEN">Open</option>
            <option value="FULL">Full</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="EXPIRED">Expired</option>
          </select>

          {selectedDate && (
            <button
              onClick={() => setSelectedDate("")}
              className="rounded-xl bg-slate-100 px-4 py-3 font-semibold text-slate-700"
            >
              Clear Date
            </button>
          )}
        </div>
      </div>

      <SlotGeneratePanel
        schedules={schedules}
        scheduleId={scheduleId}
        setScheduleId={setScheduleId}
        generateDays={generateDays}
        setGenerateDays={setGenerateDays}
        generating={generating}
        onGenerate={handleGenerateSlots}
      />

      <SlotStats slots={dateFilteredSlots} />

      <OwnerSlotCalendar
        slots={filteredSlots}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {error && (
        <div className="rounded-xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl bg-white p-6 text-center font-semibold">
          Loading slots...
        </div>
      ) : (
        <SlotTable
          slots={dateFilteredSlots}
          onViewPassengers={handleViewPassengers}
        />
      )}

      <SlotPassengersDrawer
        open={passengerOpen}
        data={passengerData}
        loading={passengerLoading}
        onClose={() => {
          setPassengerOpen(false);
          setPassengerData(null);
        }}
      />
    </div>
  );
}