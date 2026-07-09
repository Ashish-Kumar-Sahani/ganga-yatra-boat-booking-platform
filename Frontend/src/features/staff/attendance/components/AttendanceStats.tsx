import type { AttendanceRecord } from "../types/attendance.types";

interface Props {
  records: AttendanceRecord[];
}

export default function AttendanceStats({ records }: Props) {
  const present = records.filter((r) => r.status === "PRESENT").length;
  const absent = records.filter((r) => r.status === "ABSENT").length;
  const late = records.filter((r) => r.status === "LATE").length;

  return (
    <div className="grid gap-5 md:grid-cols-4">
      <div className="rounded-2xl bg-white p-5 shadow">
        <p>Total Staff</p>
        <h2 className="text-3xl font-black">{records.length}</h2>
      </div>

      <div className="rounded-2xl bg-green-50 p-5">
        <p>Present</p>
        <h2 className="text-3xl font-black text-green-700">{present}</h2>
      </div>

      <div className="rounded-2xl bg-red-50 p-5">
        <p>Absent</p>
        <h2 className="text-3xl font-black text-red-700">{absent}</h2>
      </div>

      <div className="rounded-2xl bg-yellow-50 p-5">
        <p>Late</p>
        <h2 className="text-3xl font-black text-yellow-700">{late}</h2>
      </div>
    </div>
  );
}