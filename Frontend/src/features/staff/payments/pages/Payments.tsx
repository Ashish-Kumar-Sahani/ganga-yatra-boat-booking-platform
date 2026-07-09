import { useEffect, useMemo, useState } from "react";
import { CreditCard, RefreshCcw } from "lucide-react";

import { getStaffPaymentBookings } from "../api/paymentApi";
import PaymentStats from "../components/PaymentStats";
import PaymentTable from "../components/PaymentTable";
import type {
  PaymentStatus,
  StaffPaymentBooking,
} from "../types/payment.types";

export default function Payments() {
  const [bookings, setBookings] = useState<StaffPaymentBooking[]>([]);
  const [status, setStatus] = useState<"ALL" | PaymentStatus>("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStaffPaymentBookings();

      console.log("Payment normalized:", data);

      setBookings(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Staff payments error:", error);
      setError(error?.response?.data?.message || "Payment data fetch failed");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredBookings = useMemo(() => {
    if (status === "ALL") return bookings;
    return bookings.filter((item) => item.paymentStatus === status);
  }, [bookings, status]);

  return (
    <div className="space-y-6 p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black text-blue-950">
            <CreditCard className="text-blue-600" />
            Payment Management
          </h1>
          <p className="text-slate-500">
            Revenue and payment records from owner bookings
          </p>
        </div>

        <button
          onClick={fetchPayments}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
        >
          <RefreshCcw size={17} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <PaymentStats bookings={bookings} />

      <div className="rounded-2xl bg-white p-4 shadow">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "ALL" | PaymentStatus)}
          className="rounded-xl border px-4 py-3 text-sm font-semibold outline-none"
        >
          <option value="ALL">All Payments</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white p-6 text-center font-semibold">
          Loading payments...
        </div>
      ) : (
        <PaymentTable bookings={filteredBookings} />
      )}
    </div>
  );
}