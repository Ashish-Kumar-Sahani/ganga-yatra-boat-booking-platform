type Props = {
  schedules: any[];
  scheduleId: string;
  setScheduleId: (value: string) => void;
  generateDays: number;
  setGenerateDays: (value: number) => void;
  generating: boolean;
  onGenerate: () => void;
};

export default function SlotGeneratePanel({
  schedules,
  scheduleId,
  setScheduleId,
  generateDays,
  setGenerateDays,
  generating,
  onGenerate,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <h2 className="mb-4 text-lg font-bold text-blue-950">
        Generate Slots
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        <select
          value={scheduleId}
          onChange={(e) => setScheduleId(e.target.value)}
          className="rounded-xl border px-4 py-3"
        >
          <option value="">Select Schedule</option>

          {schedules.map((schedule) => (
            <option key={schedule._id} value={schedule._id}>
              {schedule.boatId?.boatName || "Boat"} |{" "}
              {schedule.routeId?.sourceGhatId?.name || "Source"} →{" "}
              {schedule.routeId?.destinationGhatId?.name || "Destination"} |{" "}
              {schedule.departureTime}
            </option>
          ))}
        </select>

        <select
          value={generateDays}
          onChange={(e) => setGenerateDays(Number(e.target.value))}
          className="rounded-xl border px-4 py-3"
        >
          <option value={7}>Generate 7 Days</option>
          <option value={15}>Generate 15 Days</option>
          <option value={30}>Generate 30 Days</option>
          <option value={60}>Generate 60 Days</option>
          <option value={90}>Generate 90 Days</option>
        </select>

        <button
          onClick={onGenerate}
          disabled={generating}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
        >
          {generating ? "Generating..." : "Generate Slots"}
        </button>
      </div>
    </div>
  );
}