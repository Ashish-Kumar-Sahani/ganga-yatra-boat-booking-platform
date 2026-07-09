import { Clock, MapPin, Star, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RouteResultCard({ slot }: any) {
  const navigate = useNavigate();

  const schedule = slot.scheduleId;
  const route = schedule?.routeId;
  const availableSeats = slot.onlineSeats - slot.bookedOnlineSeats;

  return (
    <div className="rounded-3xl bg-white p-5 shadow-lg">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-black text-slate-900">
            {route?.sourceGhatId?.name} → {route?.destinationGhatId?.name}
          </h3>

          <p className="mt-2 flex items-center gap-2 text-slate-500">
            <MapPin size={18} />
            {route?.distanceKm} km river route
          </p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-blue-100 px-4 py-2 text-blue-700">
              <Clock size={14} className="inline" /> {schedule?.departureTime}
            </span>

            <span className="rounded-full bg-green-100 px-4 py-2 text-green-700">
              <Users size={14} className="inline" /> {availableSeats} seats available
            </span>

            <span className="rounded-full bg-orange-100 px-4 py-2 text-orange-700">
              <Star size={14} className="inline" /> Verified
            </span>
          </div>
        </div>

        <div className="text-left md:text-right">
          <p className="text-sm text-slate-500">Starting from</p>
          <h2 className="text-4xl font-black text-blue-700">
            ₹{route?.baseFare}
          </h2>

          <button
            onClick={() =>navigate(`/customer/boat-details/${slot._id}`)}
            className="mt-4 rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}