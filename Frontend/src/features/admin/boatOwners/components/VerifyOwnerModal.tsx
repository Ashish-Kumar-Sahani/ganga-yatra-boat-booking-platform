import { X, ShieldAlert, Check, Ban } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  owner: any | null;
  onConfirm: (id: string, active: boolean) => void;
};

export default function VerifyOwnerModal({ open, onClose, owner, onConfirm }: Props) {
  if (!open || !owner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2">
            <ShieldAlert className="text-amber-500" size={20} /> Owner Verification
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="my-5 text-sm text-slate-600 space-y-3">
          <p>
            Update the verification status for boat owner: <b>{owner.name}</b>.
          </p>
          <p className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-500">
            Unverified/Inactive owners are suspended and cannot access their owner panel or schedule boats. Verified/Active owners are authorized to perform full system operations.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            onClick={onClose}
            className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          
          {owner.isActive ? (
            <button
              onClick={() => onConfirm(owner._id, false)}
              className="flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-semibold shadow transition cursor-pointer"
            >
              <Ban size={16} /> Suspend / Deverify
            </button>
          ) : (
            <button
              onClick={() => onConfirm(owner._id, true)}
              className="flex items-center gap-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-semibold shadow transition cursor-pointer"
            >
              <Check size={16} /> Approve & Verify
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
