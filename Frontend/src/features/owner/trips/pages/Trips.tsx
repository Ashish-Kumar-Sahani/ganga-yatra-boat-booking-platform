import { useEffect, useState } from "react";
import TripStats from "@/features/owner/trips/components/TripStats";
import TripTable from "@/features/owner/trips/components/TripTable";
import { getOwnerTrips } from "@/features/owner/trips/api/tripApi";

export default function Trips() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await getOwnerTrips();
      setTrips(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Owner trips error:", error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div className="space-y-6 p-5">
      <div>
        <h1 className="text-3xl font-bold text-blue-950">Trips</h1>
        <p className="text-slate-500">
          Track running, completed and upcoming boat trips
        </p>
      </div>

      <TripStats trips={trips} />

      {loading ? (
        <div className="rounded-2xl bg-white p-6 text-center font-semibold">
          Loading trips...
        </div>
      ) : (
        <TripTable trips={trips} onRefresh={fetchTrips} />
      )}
    </div>
  );
}