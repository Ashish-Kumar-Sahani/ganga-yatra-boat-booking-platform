import {
  CalendarDays,
  Clock,
  LifeBuoy,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getSlotById } from "@/features/owner/slots/api/slotApi";

export default function BoatDetails() {
  const { slotId } = useParams();

  const navigate = useNavigate();

  const [slot, setSlot] = useState<any>(null);

  useEffect(() => {
    if (slotId) {
      getSlotById(slotId)
        .then(setSlot)
        .catch(console.error);
    }
  }, [slotId]);

  if (!slot) {
    return (
      <div className="p-8 text-center">
        Loading...
      </div>
    );
  }

  const route = slot.scheduleId?.routeId;
  const boat = slot.scheduleId?.boatId;

  const availableSeats =
    (slot.onlineSeats || 0) -
    (slot.bookedOnlineSeats || 0);

  return (
    <main className="space-y-6">
      <div className="grid gap-8 lg:grid-cols-2">
        <img
          src={
            boat?.image ||
            boat?.images?.[0] ||
            "/images/boat-placeholder.jpg"
          }
          className="h-[430px] w-full rounded-3xl object-cover"
        />

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
            Verified Boat
          </span>

          <h1 className="mt-5 text-4xl font-black">
            {boat?.boatName}
          </h1>

          <p className="mt-3 flex items-center gap-2 text-slate-500">
            <MapPin size={18} />

            {route?.sourceGhatId?.name}
            {" → "}
            {route?.destinationGhatId?.name}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Info
              icon={<Users />}
              title="Seats"
              value={`${availableSeats} Available`}
            />

            <Info
              icon={<Clock />}
              title="Duration"
              value={`${route?.estimatedDurationMinutes || 0} Min`}
            />

            <Info
              icon={<ShieldCheck />}
              title="Status"
              value={slot.status}
            />
          </div>

          <div className="mt-8 rounded-3xl bg-blue-50 p-5">
            <h3 className="text-xl font-black">
              Trip Details
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Info
                icon={<CalendarDays />}
                title="Date"
                value={
                  slot.slotDate
                    ? new Date(
                        slot.slotDate
                      ).toLocaleDateString()
                    : "-"
                }
              />

              <Info
                icon={<Clock />}
                title="Departure"
                value={
                  slot.scheduleId?.departureTime ||
                  "-"
                }
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Price per seat
              </p>

              <h2 className="text-4xl font-black text-blue-700">
                ₹{route?.baseFare}
              </h2>
            </div>

            <button
              onClick={() =>
                navigate(
                  `/customer/booking/${slot._id}`
                )
              }
              className="rounded-2xl bg-orange-500 px-8 py-4 font-bold text-white"
            >
              Continue Booking
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Feature
          icon={<ShieldCheck />}
          title="Government Approved"
        />

        <Feature
          icon={<LifeBuoy />}
          title="Safety Support"
        />

        <Feature
          icon={<MapPin />}
          title="Live Tracking"
        />
      </div>
    </main>
  );
}

function Info({ icon, title, value }: any) {
  return (
    <div className="rounded-2xl border p-4">
      <p className="flex items-center gap-2 text-sm font-bold text-blue-700">
        {icon}
        {title}
      </p>

      <h4 className="mt-1 font-black">
        {value}
      </h4>
    </div>
  );
}

function Feature({ icon, title }: any) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-4 w-fit rounded-2xl bg-blue-100 p-4 text-blue-700">
        {icon}
      </div>

      <h3 className="font-black">
        {title}
      </h3>
    </div>
  );
}