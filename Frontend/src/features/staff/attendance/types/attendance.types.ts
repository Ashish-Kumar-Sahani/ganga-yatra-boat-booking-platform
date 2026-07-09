export interface AttendanceRecord {
  _id: string;
  staffName: string;
  role: "DRIVER" | "OPERATOR" | "STAFF";
  assignedBoat?: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "ON_LEAVE";
  date: string;
}