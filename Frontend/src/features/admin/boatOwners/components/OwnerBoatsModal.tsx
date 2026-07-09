import { X, Ship } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  owner: any | null;
  boats: any[];
};

export default function OwnerBoatsModal({ open, onClose, owner, boats }: Props) {
  if (!open || !owner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2">
              <Ship size={20} className="text-blue-600" /> Owned Boats List
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Owner: <b>{owner.name}</b></p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {boats.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Ship className="mx-auto text-slate-300 mb-2" size={40} />
              <p className="font-semibold">No boats registered under this owner yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {boats.map((boat) => (
                <div key={boat._id} className="rounded-xl border p-4 bg-slate-50/50 hover:bg-slate-50 transition border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-blue-950">{boat.boatName}</h4>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        boat.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : boat.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {boat.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Number: <b>{boat.boatNumber}</b></p>
                    <p className="text-xs text-slate-600 mt-1">Type: <span className="font-semibold">{boat.boatType}</span></p>
                    <p className="text-xs text-slate-600">Capacity: <b>{boat.capacity} seats</b></p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500 font-semibold">
                    <span>Base Price: ₹{boat.basePrice}</span>
                    <span className={boat.isAvailable ? "text-green-600" : "text-red-500"}>
                      {boat.isAvailable ? "● Available" : "○ Offline"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
