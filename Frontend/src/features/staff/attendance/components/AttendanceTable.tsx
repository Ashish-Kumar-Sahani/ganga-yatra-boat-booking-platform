import type { AttendanceRecord } from "../types/attendance.types";

interface Props {
  records: AttendanceRecord[];
}

export default function AttendanceTable({ records }: Props) {
  return (
    <div className="overflow-auto rounded-2xl bg-white shadow">
      <table className="w-full min-w-[800px] text-left">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="p-4">Staff</th>
            <th className="p-4">Role</th>
            <th className="p-4">Boat</th>
            <th className="p-4">Check In</th>
            <th className="p-4">Check Out</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>

        <tbody>
          {records.map((record) => (
            <tr key={record._id} className="border-b">
              <td className="p-4 font-bold">{record.staffName}</td>
              <td className="p-4">{record.role}</td>
              <td className="p-4">{record.assignedBoat || "N/A"}</td>
              <td className="p-4">{record.checkInTime || "--"}</td>
              <td className="p-4">{record.checkOutTime || "--"}</td>
              <td className="p-4">{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}