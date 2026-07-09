import { AlertCircle, X } from "lucide-react";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  title?: string;
  message?: string;
  deleteText?: string;
  cancelText?: string;
  loading?: boolean;
}

export default function DeleteDialog({
  isOpen,
  onClose,
  onDelete,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this resource? This operation is permanent and cannot be undone.",
  deleteText = "Delete",
  cancelText = "Cancel",
  loading = false,
}: DeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-red-100 dark:border-red-950/20 bg-white dark:bg-slate-900 shadow-2xl p-6 transition-all duration-300 animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex gap-4">
          <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 p-3 text-red-600 shrink-0 self-start">
            <AlertCircle size={24} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-black text-slate-850 dark:text-white leading-tight">
              {title}
            </h3>
            <p className="text-sm font-semibold text-slate-405 dark:text-slate-400">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-850 pt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 px-5 py-2.5 text-sm font-bold text-slate-550 dark:text-slate-400 transition disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onDelete}
            disabled={loading}
            className="rounded-xl bg-red-600 hover:bg-red-750 text-white px-5 py-2.5 text-sm font-bold shadow-md shadow-red-500/10 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Deleting..." : deleteText}
          </button>
        </div>
      </div>
    </div>
  );
}
