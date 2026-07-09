import { Clock, MapPin, Users, ShieldCheck, Ship, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function RouteResultCard({ slot }: any) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const boat = slot.boat;
  const route = slot.route;
  const availableSeats = slot.availableSeats;

  const handleBookClick = () => {
    if (!isAuthenticated || !user) {
      // Redirect to login with returnUrl
      navigate(`/login?returnUrl=/customer/booking/${slot.slotId}`);
      return;
    }

    if (user.role === "CUSTOMER") {
      navigate(`/customer/booking/${slot.slotId}`);
    } else {
      alert("Only customers can book rides. You are currently logged in as a " + user.role.replace("_", " ") + ".");
    }
  };

  const getBoatTypeLabel = (type: string) => {
    return String(type || "MOTOR").replace("_", " ");
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left Section: Ride info */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 flex flex-wrap items-center gap-2">
              <span>{slot.sourceGhat?.name}</span>
              <ArrowRight size={18} className="text-orange-500" />
              <span>{slot.destinationGhat?.name}</span>
            </h3>
            
            <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <MapPin size={14} className="text-orange-500" />
              <span>{route?.distanceKm ? `${route.distanceKm} km river route` : "Varanasi River transit"}</span>
            </p>
          </div>

          {/* Details Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1">
              <Ship size={14} className="text-blue-700" />
              <span className="text-slate-800">{boat?.boatName || "Verified Boat"}</span>
              <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] uppercase text-blue-700">
                {getBoatTypeLabel(boat?.boatType)}
              </span>
            </span>

            <span className="flex items-center gap-1 text-slate-650">
              <Clock size={14} className="text-slate-400" />
              <span>{slot.departureTime}</span>
            </span>

            <span className="flex items-center gap-1">
              <Users size={14} className="text-blue-600" />
              <span className={availableSeats > 0 ? "text-green-600" : "text-red-500"}>
                {availableSeats} seats left
              </span>
            </span>

            <span className="flex items-center gap-1 text-green-650 rounded-full bg-green-50 px-2.5 py-1 text-xs">
              <ShieldCheck size={14} className="text-green-600" />
              <span>Verified Operator</span>
            </span>
          </div>
        </div>

        {/* Right Section: Fare & Book Trigger */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 md:border-t-0 md:pt-0 md:flex-col md:items-end gap-3 shrink-0">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 text-left md:text-right">
              Est. Fare
            </p>
            <h2 className="text-3xl font-black text-blue-800">
              ₹{slot.baseFare || route?.baseFare}
              <span className="text-xs font-semibold text-slate-400">/seat</span>
            </h2>
          </div>

          <button
            onClick={handleBookClick}
            className="rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-655 hover:shadow-orange-655/30 transition duration-150 active:scale-[0.98]"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
