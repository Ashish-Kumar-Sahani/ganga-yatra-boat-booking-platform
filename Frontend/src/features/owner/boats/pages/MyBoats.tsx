import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, AlertCircle } from "lucide-react";

import BoatStats from "../../boats/components/BoatStats";
import BoatFilters from "../../boats/components/BoatFilters";
import BoatGrid from "../../boats/components/BoatGrid";
import BoatEditModal from "../../boats/components/BoatEditModal";
import DeleteDialog from "@/components/common/DeleteDialog";

import { useBoatStore } from "@/features/owner/boats/store/boatStore";
import type { Boat } from "@/features/owner/boats/types/boat.types";

export default function MyBoats() {
  const navigate = useNavigate();

  const { boats = [], loading, error, fetchBoats, editBoat, removeBoat, clearError } = useBoatStore();

  const safeBoats = Array.isArray(boats) ? boats : [];

  // Edit Modal State
  const [editingBoat, setEditingBoat] = useState<Boat | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Delete Dialog State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchBoats();

    return () => {
      clearError();
    };
  }, [fetchBoats, clearError]);

  const handleEditClick = (boat: Boat) => {
    setEditingBoat(boat);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (id: string, formData: FormData) => {
    const success = await editBoat(id, formData);
    if (success) {
      showToast("Boat details updated successfully", "success");
      fetchBoats(); // Refresh data immediately
    } else {
      showToast("Failed to update boat details", "error");
    }
    return success;
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    try {
      setDeleting(true);
      const success = await removeBoat(deletingId);
      if (success) {
        showToast("Boat deleted successfully", "success");
      } else {
        showToast("Failed to delete boat", "error");
      }
    } catch (err) {
      showToast("An error occurred during deletion", "error");
    } finally {
      setDeleting(false);
      setIsDeleteOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="p-5 relative">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl border border-slate-150 animate-slideIn">
          {toast.type === "success" ? (
            <div className="rounded-full bg-green-100 p-1.5 text-green-600">
              <Check size={18} />
            </div>
          ) : (
            <div className="rounded-full bg-red-100 p-1.5 text-red-600">
              <AlertCircle size={18} />
            </div>
          )}
          <p className="text-sm font-semibold text-slate-800">{toast.message}</p>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">My Boats</h1>
          <p className="text-slate-500">Manage all registered boats</p>
        </div>

        <button
          onClick={() => navigate("/owner/add-boat")}
          className="rounded-xl bg-blue-600 px-5 py-3 text-white font-bold cursor-pointer hover:bg-blue-700 transition"
        >
          Add New Boat
        </button>
      </div>

      <BoatStats boats={safeBoats} />

      <BoatFilters />

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {loading && safeBoats.length === 0 ? (
        <div className="mt-10 text-center font-semibold text-blue-950">
          Loading Boats...
        </div>
      ) : safeBoats.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow">
          <h2 className="text-2xl font-bold text-blue-950">
            No boats added yet
          </h2>

          <p className="mt-2 text-slate-500">
            Add your first boat to start receiving bookings.
          </p>

          <button
            onClick={() => navigate("/owner/add-boat")}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-white font-bold cursor-pointer hover:bg-blue-700 transition"
          >
            Add First Boat
          </button>
        </div>
      ) : (
        <BoatGrid
          boats={safeBoats}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Edit Boat Modal */}
      {editingBoat && (
        <BoatEditModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setEditingBoat(null);
          }}
          boat={editingBoat}
          onSave={handleSaveEdit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={isDeleteOpen}
        loading={deleting}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingId(null);
        }}
        onDelete={handleConfirmDelete}
        title="Delete Boat"
        message="Are you sure you want to delete this boat? This will permanently remove the boat details and documents."
      />
    </div>
  );
}