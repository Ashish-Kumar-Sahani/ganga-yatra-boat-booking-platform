import { useEffect, useState } from "react";

import ScheduleStats from "@/features/owner/schedules/components/ScheduleStats";
import ScheduleTable from "@/features/owner/schedules/components/ScheduleTable";
import ScheduleFormModal from "@/features/owner/schedules/components/ScheduleFormModal";

import { getMySchedules } from "@/features/owner/schedules/api/scheduleApi";

export default function MySchedules() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any | null>(null);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await getMySchedules();
      setSchedules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Owner schedules error:", error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const openAddModal = () => {
    setEditingSchedule(null);
    setModalOpen(true);
  };

  const openEditModal = (schedule: any) => {
    setEditingSchedule(schedule);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">My Schedules</h1>
          <p className="text-slate-500">Manage, edit and generate slots from schedules</p>
        </div>

        <button
          onClick={openAddModal}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
        >
          + Add Schedule
        </button>
      </div>

      <ScheduleStats schedules={schedules} />

      {loading ? (
        <div className="rounded-2xl bg-white p-6 text-center font-semibold">
          Loading schedules...
        </div>
      ) : (
        <ScheduleTable
          schedules={schedules}
          onRefresh={fetchSchedules}
          onEdit={openEditModal}
        />
      )}

      <ScheduleFormModal
        open={modalOpen}
        editingSchedule={editingSchedule}
        onClose={() => {
          setModalOpen(false);
          setEditingSchedule(null);
        }}
        onSuccess={fetchSchedules}
      />
    </div>
  );
}