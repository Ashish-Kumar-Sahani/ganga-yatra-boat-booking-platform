import { X, UserCircle, MapPin, Phone, Mail } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  owner: any | null;
};

export default function BoatOwnerDetailsModal({ open, onClose, owner }: Props) {
  if (!open || !owner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2">
            <UserCircle size={22} className="text-blue-600" /> Owner Profile Details
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex flex-col items-center mb-6">
            <img
              src={owner.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.name)}&background=dbeafe&color=2563eb&size=128`}
              alt={owner.name}
              className="h-24 w-24 rounded-full object-cover border shadow"
            />
            <h4 className="mt-3 text-xl font-bold text-blue-950">{owner.name}</h4>
            <span className={`mt-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              owner.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}>
              {owner.isActive ? "Verified Active" : "Pending Status"}
            </span>
          </div>

          <div className="space-y-3.5 text-sm text-slate-700">
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
              <Mail size={16} className="text-blue-600" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Email Address</p>
                <p className="font-medium">{owner.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
              <Phone size={16} className="text-blue-600" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Phone Number</p>
                <p className="font-medium">{owner.phone || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
              <MapPin size={16} className="text-blue-600" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Location & Address</p>
                <p className="font-medium">{owner.address || owner.city || "Not provided"}</p>
              </div>
            </div>
          </div>
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
