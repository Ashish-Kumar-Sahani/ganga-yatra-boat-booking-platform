import type { StaffSchedule } from "@/features/staff/calendar/types/calendar.types";

export const toDateKey = (date: Date | string | undefined | null) => {
  if (!date) return "";

  const value = typeof date === "string" ? new Date(date) : date;

  if (Number.isNaN(value.getTime())) return "";

  return value.toISOString().split("T")[0];
};

export const getScheduleStartDate = (schedule: StaffSchedule) => {
  return (
    schedule.startDate ||
    schedule.specialDate ||
    schedule.scheduleDate ||
    schedule.date ||
    schedule.slotDate ||
    schedule.createdAt ||
    ""
  );
};

export const getScheduleEndDate = (schedule: StaffSchedule) => {
  /*
    IMPORTANT:
    DAILY schedule ka endDate agar missing hai,
    to schedule future days me bhi active maana jayega.
  */
  if (schedule.endDate) return schedule.endDate;

  if (schedule.scheduleType === "SPECIAL") {
    return schedule.specialDate || getScheduleStartDate(schedule);
  }

  return "2099-12-31";
};

export const isScheduleOnDate = (schedule: StaffSchedule, date: Date) => {
  if (schedule.isActive === false) return false;

  const dateKey = toDateKey(date);
  const startKey = toDateKey(getScheduleStartDate(schedule));
  const endKey = toDateKey(getScheduleEndDate(schedule));

  if (!dateKey || !startKey || !endKey) return false;

  if (dateKey < startKey || dateKey > endKey) return false;

  if (schedule.scheduleType === "SPECIAL") {
    return dateKey === toDateKey(schedule.specialDate || startKey);
  }

  if (schedule.scheduleType === "WEEKLY") {
    return schedule.weekDays?.includes(date.getDay()) || false;
  }

  // DAILY
  return true;
};

export const formatScheduleDate = (schedule: StaffSchedule) => {
  const rawDate = getScheduleStartDate(schedule);

  if (!rawDate) return "N/A";

  return new Date(rawDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};