import { Minus, Plus, User, Phone, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getSlotById } from "@/features/owner/slots/api/slotApi";
import { createBooking } from "@/features/owner/bookings/api/bookingApi";

export default function Booking() {
  const navigate = useNavigate();
  const { slotId } = useParams();

  const [slot, setSlot] = useState<any>(null);

  const [seats, setSeats] = useState(1);

  const [passengerName, setPassengerName] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slotId) {
  getSlotById(slotId)
        .then(setSlot)
        .catch(console.error);
    }
  }, [slotId]);

  if (!slot) {
    return (
      <div className="flex min-h-screen items-center justify-center text-2xl font-bold">
        Loading...
      </div>
    );
  }

  const route = slot.scheduleId?.routeId;
  const boat = slot.scheduleId?.boatId;

  const pricePerSeat = route?.baseFare || 0;
  const totalAmount = seats * pricePerSeat;

  const handleBooking = async () => {
    try {
      if (slot.status !== "OPEN") {
  alert("This slot is not available now");
  navigate("/customer/bookings", { replace: true });
  return;
}
      if (!passengerPhone.trim()) {
        alert("Passenger phone required");
        return;
      }

      setLoading(true);

      const result = await createBooking({
        slotId: slot._id,
        seatsBooked: seats,
        passengerName,
        passengerPhone,
      });

     const bookingId =
  result?.booking?._id ||
  result?._id ||
  result?.bookingId;

if (!bookingId) {
  alert("Booking created but booking ID missing");
  return;
}

navigate(`/customer/payment/${bookingId}`);
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Booking failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f8ff] text-[#071b4d]">

      <section className="mx-auto max-w-5xl px-6 pt-28">
        <h1 className="text-4xl font-black">
          Complete Your Booking
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Passenger Form */}
          <div className="rounded-[2rem] bg-white p-6 shadow-xl lg:col-span-2">
            <h2 className="text-2xl font-black">
              Passenger Details
            </h2>

            <div className="mt-6 grid gap-5">
              <Input
                icon={<User />}
                label="Passenger Name"
                placeholder="Enter passenger name"
                value={passengerName}
                onChange={setPassengerName}
              />

              <Input
                icon={<Phone />}
                label="Phone Number"
                placeholder="9876543210"
                value={passengerPhone}
                onChange={setPassengerPhone}
              />

              <div>
                <label className="font-bold">
                  Seats
                </label>

                <div className="mt-2 flex w-fit items-center gap-4 rounded-2xl border bg-white p-3">
                  <button
                    onClick={() =>
                      setSeats(
                        Math.max(1, seats - 1)
                      )
                    }
                  >
                    <Minus />
                  </button>

                  <span className="text-2xl font-black">
                    {seats}
                  </span>

                  <button
                    onClick={() =>
                      setSeats(seats + 1)
                    }
                  >
                    <Plus />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-[2rem] bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-black">
              Trip Summary
            </h2>

            <div className="mt-5 space-y-4 text-sm">
              <p>
                <b>Route:</b>{" "}
                {route?.sourceGhatId?.name}
                {" → "}
                {route?.destinationGhatId?.name}
              </p>

              <p>
                <b>Boat:</b>{" "}
                {boat?.boatName}
              </p>

              <p>
                <b>Time:</b>{" "}
                {slot.scheduleId?.departureTime}
              </p>

              <p className="flex items-center gap-2">
                <Users size={16} />
                {seats} Seat(s)
              </p>
            </div>

            <div className="mt-6 border-t pt-5">
              <div className="flex justify-between">
                <span>Price / Seat</span>
                <b>₹{pricePerSeat}</b>
              </div>

              <div className="mt-3 flex justify-between text-2xl font-black">
                <span>Total</span>
                <span className="text-blue-700">
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={loading}
              className="mt-8 w-full rounded-2xl bg-orange-500 py-4 font-bold text-white hover:bg-orange-600 disabled:opacity-50"
            >
              {loading
                ? "Creating Booking..."
                : "Continue To Payment"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

type InputProps = {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

function Input({
  icon,
  label,
  placeholder,
  value,
  onChange,
}: InputProps) {
  return (
    <div>
      <label className="font-bold">
        {label}
      </label>

      <div className="mt-2 flex items-center gap-3 rounded-2xl border bg-white px-4 py-3">
        <span className="text-blue-700">
          {icon}
        </span>

        <input
          className="w-full outline-none"
          placeholder={placeholder}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
        />
      </div>
    </div>
  );
}