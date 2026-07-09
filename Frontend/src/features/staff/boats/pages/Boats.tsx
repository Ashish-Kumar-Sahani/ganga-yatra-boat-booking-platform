import { useEffect, useState } from "react";
import BoatStats from "../components/BoatStats";
import BoatTable from "../components/BoatTable";
import { getStaffBoats } from "../api/boatApi";
import type { StaffBoat } from "../types/boat.types";

export default function Boats() {
  const [boats, setBoats] = useState<StaffBoat[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBoats = async () => {
    try {
      setLoading(true);
      const data = await getStaffBoats();
      setBoats(data);
    } catch (error) {
      console.error("Staff boats fetch error:", error);
      setBoats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoats();
  }, []);

  return (
    <div className="space-y-6 p-5">
      <div>
        <h1 className="text-3xl font-bold text-blue-950">Boats</h1>
        <p className="text-slate-500">
          View assigned owner boats and availability
        </p>
      </div>

      <BoatStats boats={boats} />

      {loading ? (
        <div className="rounded-2xl bg-white p-6 text-center font-semibold">
          Loading boats...
        </div>
      ) : (
        <BoatTable boats={boats} onRefresh={fetchBoats} />
      )}
    </div>
  );
}