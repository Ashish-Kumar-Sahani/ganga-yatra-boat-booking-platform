import { useEffect, useState } from "react";
import {
  MapPin,
  Ship,
  Clock,
  User,
  Compass,
  AlertCircle,
  PhoneCall,
  Navigation,
} from "lucide-react";

import { getLiveTrip } from "@/features/customer/dashboard/api/customerApi";
import LiveTrackingMap from "@/features/customer/tracking/components/LiveTrackingMap";
import { useNavigate } from "react-router-dom";

export default function LiveTracking() {
  const navigate = useNavigate();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bookingId = "current-booking";

  const fetchTrip = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getLiveTrip(bookingId);
      setTrip(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to sync live tracking feed. Re-attempting connection...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();

    // Poll live location coordinates every 15s
    const interval = setInterval(fetchTrip, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !trip) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 animate-pulse">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
        <p className="mt-4 font-bold">Syncing satellite tracking feed...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-black text-blue-950 dark:text-white">Live Ride Tracking</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track your boat location, route timeline progress, and captain contact details in real-time
        </p>
      </header>

      {error && (
        <div className="rounded-2xl bg-orange-50 dark:bg-orange-950/20 p-4 text-xs font-bold text-orange-700 dark:text-orange-400 flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {!trip ? (
        <div className="rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 p-12 text-center shadow-sm max-w-lg mx-auto space-y-5">
          <Compass size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-2 animate-spin" style={{ animationDuration: "10s" }} />
          <div>
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">No active ride in progress</h3>
            <p className="text-xs font-semibold text-slate-400 mt-2 max-w-xs mx-auto">
              Once you start a confirmed boat trip, live tracking and mapping will appear here automatically.
            </p>
          </div>
          <button
            onClick={() => navigate("/customer/bookings")}
            className="rounded-xl border border-blue-200 px-5 py-2.5 text-xs font-black text-blue-600 hover:bg-blue-50/50"
          >
            Check booking list
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          {/* Tracker dashboard grid */}
          <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
            <StatCard
              icon={<Ship size={20} className="text-blue-600" />}
              title="Assigned Vessel"
              value={trip.boatName || "-"}
              sub={trip.boatNumber}
            />

            <StatCard
              icon={<Clock size={20} className="text-green-600" />}
              title="Estimated Arrival"
              value={trip.eta || "-"}
              sub="Adjusted for speed"
            />

            <StatCard
              icon={<MapPin size={20} className="text-orange-600" />}
              title="Current Area"
              value={trip.currentLocation || "-"}
              sub="Varanasi, IN"
            />

            <StatCard
              icon={<User size={20} className="text-purple-600" />}
              title="Captain name"
              value={trip.captainName || "-"}
              sub="Certified Driver"
            />
          </div>

          {/* Map Frame */}
          <div className="overflow-hidden rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 shadow-sm">
            <div className="border-b border-slate-50 dark:border-slate-700/50 p-5 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Navigation size={18} className="text-blue-600" />
                Live Sat-Nav Map
              </h3>
              <span className="rounded-full bg-green-500/20 text-green-700 dark:text-green-400 px-3 py-1 text-[10px] font-black uppercase tracking-wider animate-pulse">
                {trip.status}
              </span>
            </div>

            <div className="h-[500px]">
              <LiveTrackingMap trip={trip} />
            </div>
          </div>

          {/* Captain & Voyage Details */}
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Cruise Details */}
            <div className="rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 p-6 space-y-4 shadow-sm">
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100">Voyage Metadata</h3>

              <div className="space-y-3.5 text-sm font-semibold">
                <Info label="Travel Route" value={trip.routeName} />
                <Info label="Vessel Type" value={trip.boatName} />
                <Info label="Voyage Status" value={trip.status} />
                <Info label="Total Passengers" value={`${trip.passengers} Seats Booked`} />
              </div>
            </div>

            {/* Captain Contacts */}
            <div className="rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 p-6 space-y-4 shadow-sm">
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100">Operator Details</h3>

              <div className="space-y-3.5 text-sm font-semibold">
                <Info label="Vessel Pilot" value={trip.captainName} />
                <Info label="Pilot Contact" value={trip.captainPhone} />

                <div className="pt-3">
                  <a
                    href={`tel:${trip.captainPhone}`}
                    className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 font-bold text-white shadow"
                  >
                    <PhoneCall size={16} />
                    Call Captain Mobile
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, sub }: any) {
  return (
    <div className="rounded-2xl border border-blue-50/30 bg-white dark:bg-slate-800 p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-2.5 shrink-0 border border-slate-100/10 w-fit mb-3">
          {icon}
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{title}</p>
        <h3 className="mt-1 font-black text-slate-800 dark:text-slate-100 text-sm truncate">{value}</h3>
      </div>
      <p className="text-[9px] font-bold text-slate-400 mt-2">{sub}</p>
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div className="flex justify-between border-b border-slate-50 dark:border-slate-700/30 pb-3 last:border-0 last:pb-0">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-extrabold text-slate-800 dark:text-slate-200">{value || "-"}</span>
    </div>
  );
}