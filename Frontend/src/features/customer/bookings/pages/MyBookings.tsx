import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  Clock,
  CreditCard,
  MapPin,
  RotateCcw,
  Search,
  Ticket,
  Users,
  XCircle,
  AlertCircle,
  DollarSign,
  FileText,
} from "lucide-react";
import {
  cancelBooking,
  getMyBookings,
  payBookingWithWallet,
  rescheduleBooking,
  getSystemSettings,
  getAvailableCustomerSlots,
} from "@/features/customer/dashboard/api/customerApi";
import { formatLocalDate } from "@/utils/dateKey";
import { useAuthStore } from "@/features/auth/store/authStore";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
type BookingType = "ONLINE" | "OFFLINE" | "EMERGENCY";

type Booking = {
  _id: string;
  bookingCode?: string;
  bookingType?: BookingType;
  bookingStatus?: BookingStatus;
  paymentStatus?: PaymentStatus;
  checkInStatus?: string;
  seatsBooked?: number;
  totalAmount?: number;
  passengerName?: string;
  passengerPhone?: string;
  qrCode?: string;
  createdAt?: string;
  slotId?: {
    _id?: string;
    slotDate?: string;
    scheduleId?: {
      departureTime?: string;
      arrivalTime?: string;
      boatId?: {
        boatName?: string;
        boatNumber?: string;
      };
      routeId?: {
        _id?: string;
        sourceGhatId?: { _id?: string, name?: string };
        destinationGhatId?: { _id?: string, name?: string };
      };
    };
  };
  refundStatus?: string;
  refundAmount?: number;
  cancellationReason?: string;
  refundReason?: string;
  cancelledBy?: string;
  refundProcessedAt?: string;
  rescheduleCount?: number;
  ownerRemark?: string;
  authorityRemark?: string;
  refundPercentage?: number;
  expectedRefundDate?: string;
  walletTransactionId?: string;
  cancellationRequestedAt?: string;
  ownerRespondedAt?: string;
};

export default function MyBookings() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const [activePaymentBooking, setActivePaymentBooking] = useState<Booking | null>(null);
  const [payingWithWallet, setPayingWithWallet] = useState(false);

  const [settings, setSettings] = useState<any>(null);
  const [activeCancelBooking, setActiveCancelBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState("Customer cancellation");
  const [refundMethod, setRefundMethod] = useState<"WALLET" | "ONLINE">("WALLET");

  const [activeRescheduleBooking, setActiveRescheduleBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);

  const [trackRefundBooking, setTrackRefundBooking] = useState<any | null>(null);
  const [receiptBooking, setReceiptBooking] = useState<any | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getMyBookings();
      setBookings(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Bookings fetch error:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const data = await getSystemSettings();
      setSettings(data);
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchSettings();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus =
        statusFilter === "ALL" || booking.bookingStatus === statusFilter;

      const text = searchText.toLowerCase();

      const matchesSearch =
        !text ||
        booking.bookingCode?.toLowerCase().includes(text) ||
        booking.passengerName?.toLowerCase().includes(text) ||
        booking.passengerPhone?.toLowerCase().includes(text);

      return matchesStatus && matchesSearch;
    });
  }, [bookings, statusFilter, searchText]);

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      confirmed: bookings.filter((b) => b.bookingStatus === "CONFIRMED").length,
      completed: bookings.filter((b) => b.bookingStatus === "COMPLETED").length,
      cancelled: bookings.filter((b) => b.bookingStatus === "CANCELLED").length,
      spent: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
    };
  }, [bookings]);

  const handleCancelClick = (booking: Booking) => {
    setActiveCancelBooking(booking);
    setCancelReason("Customer cancellation");
    setRefundMethod("WALLET");
  };

  const handleCancelSubmit = async () => {
    if (!activeCancelBooking) return;
    try {
      setLoading(true);
      await cancelBooking(activeCancelBooking._id, cancelReason, refundMethod);
      alert(
        refundMethod === "WALLET"
          ? "Booking cancelled successfully! The refund has been credited directly to your wallet balance."
          : "Booking cancelled successfully! Your refund request has been submitted for admin approval."
      );
      setActiveCancelBooking(null);
      await fetchBookings();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Cancellation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRescheduleClick = (booking: Booking) => {
    setActiveRescheduleBooking(booking);
    setRescheduleDate("");
    setAvailableSlots([]);
    setSelectedSlotId("");
  };

  const handleSearchSlots = async () => {
    if (!activeRescheduleBooking || !rescheduleDate) return;
    try {
      setFetchingSlots(true);
      const route = activeRescheduleBooking.slotId?.scheduleId?.routeId;
      const sourceGhatId = route?.sourceGhatId?._id || (typeof route?.sourceGhatId === "string" ? route.sourceGhatId : "");
      const destinationGhatId = route?.destinationGhatId?._id || (typeof route?.destinationGhatId === "string" ? route.destinationGhatId : "");
      const seats = activeRescheduleBooking.seatsBooked || 1;

      const data = await getAvailableCustomerSlots({
        sourceGhatId,
        destinationGhatId,
        date: rescheduleDate,
        passengers: seats
      });

      const slotsList = Array.isArray(data) ? data : (data.slots || data.data || []);
      const filtered = slotsList.filter((s: any) => s._id !== activeRescheduleBooking.slotId?._id);
      setAvailableSlots(filtered);
      if (filtered.length === 0) {
        alert("No other slots available for this route on the selected date.");
      }
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to search slots");
    } finally {
      setFetchingSlots(false);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!activeRescheduleBooking || !selectedSlotId) return;
    const fee = settings?.rescheduleFee ?? 50;
    if (fee > 0) {
      const confirmed = window.confirm(`Rescheduling this booking will charge a fee of ₹${fee} from your wallet balance. Do you want to proceed?`);
      if (!confirmed) return;
    }

    try {
      setRescheduling(true);
      await rescheduleBooking(activeRescheduleBooking._id, selectedSlotId);
      alert("Booking rescheduled successfully!");
      setActiveRescheduleBooking(null);
      await fetchBookings();
    } catch (error: any) {
      alert(error.response?.data?.message || "Rescheduling failed");
    } finally {
      setRescheduling(false);
    }
  };

  const handleWalletPayment = async (booking: Booking) => {
    const walletBalance = (user as any)?.walletBalance || 0;
    if (walletBalance < (booking.totalAmount || 0)) {
      alert("Insufficient wallet balance. Please recharge your wallet first.");
      return;
    }

    try {
      setPayingWithWallet(true);
      const res = await payBookingWithWallet(booking._id);

      // Update auth store user details (new wallet balance)
      if (user) {
        updateUser({
          ...user,
          walletBalance: res.balance,
        });
      }

      alert("Booking paid successfully using Wallet Balance!");
      setActivePaymentBooking(null);
      await fetchBookings();
    } catch (err: any) {
      alert(err.response?.data?.message || "Wallet payment failed");
    } finally {
      setPayingWithWallet(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-black text-blue-950 dark:text-white">My Bookings</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track and manage your upcoming, completed, or cancelled rides
          </p>
        </div>

        <button
          onClick={fetchBookings}
          disabled={loading}
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 px-5 py-3 font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-50"
        >
          <RotateCcw size={17} />
          Refresh
        </button>
      </header>

      {/* Stats cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
        <Stat title="Total Rides" value={stats.total} />
        <Stat title="Confirmed" value={stats.confirmed} />
        <Stat title="Completed" value={stats.completed} />
        <Stat title="Cancelled" value={stats.cancelled} />
        <Stat title="Total Spent" value={`₹${stats.spent.toLocaleString()}`} />
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col gap-3 rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-sm md:flex-row border border-slate-100/30">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-700 px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50">
          <Search size={18} className="text-slate-400" />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search booking code, passenger name..."
            className="w-full bg-transparent outline-none text-sm font-semibold placeholder:text-slate-400"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3 font-bold text-sm text-slate-700 dark:text-slate-200 outline-none"
        >
          <option value="ALL">All Status</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 font-bold">Loading rides...</p>
        </div>
      )}

      {!loading && filteredBookings.length === 0 && (
        <div className="rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 p-12 text-center shadow-sm max-w-lg mx-auto">
          <AlertCircle size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="font-extrabold text-slate-700 dark:text-slate-200">No bookings match criteria</p>
        </div>
      )}

      {/* Payment Selection Modal */}
      {activePaymentBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-800 p-6 shadow-xl space-y-5">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white">Select Payment Mode</h3>
              <p className="text-xs text-slate-500 mt-1">
                Booking Reference: {activePaymentBooking.bookingCode}
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 p-4 border border-blue-100/30 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Grand Total</p>
                <p className="text-2xl font-black text-blue-900 dark:text-blue-300 mt-0.5">
                  ₹{activePaymentBooking.totalAmount}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase">Wallet Bal</p>
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
                  ₹{(user as any)?.walletBalance || 0}
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              <button
                onClick={() => handleWalletPayment(activePaymentBooking)}
                disabled={payingWithWallet || ((user as any)?.walletBalance || 0) < (activePaymentBooking.totalAmount || 0)}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-sm font-bold text-white shadow transition-all disabled:opacity-50"
              >
                <DollarSign size={16} />
                Pay via Wallet Balance
              </button>

              <button
                onClick={() => {
                  setActivePaymentBooking(null);
                  navigate(`/customer/payment/${activePaymentBooking._id}`);
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <CreditCard size={16} />
                Pay via Razorpay / Card / UPI
              </button>
            </div>

            <button
              onClick={() => setActivePaymentBooking(null)}
              className="w-full text-center text-xs font-bold text-slate-400 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {activeCancelBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-800 p-6 shadow-xl space-y-5">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white">Cancel Booking</h3>
              <p className="text-xs text-slate-500 mt-1">
                Booking Reference: {activeCancelBooking.bookingCode}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Reason for Cancellation</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter reason..."
                  rows={2}
                  className="w-full rounded-xl border px-3 py-2 text-sm focus:border-blue-500 outline-none bg-slate-50/50 dark:bg-slate-900/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Refund Destination</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRefundMethod("WALLET")}
                    disabled={settings?.walletRefundEnabled === false}
                    className={`rounded-xl py-3 text-xs font-bold border transition ${
                      refundMethod === "WALLET"
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                        : "border-slate-200 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700"
                    } disabled:opacity-50`}
                  >
                    Wallet Refund
                  </button>
                  <button
                    type="button"
                    onClick={() => setRefundMethod("ONLINE")}
                    disabled={settings?.originalPaymentRefundEnabled === false}
                    className={`rounded-xl py-3 text-xs font-bold border transition ${
                      refundMethod === "ONLINE"
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                        : "border-slate-200 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700"
                    } disabled:opacity-50`}
                  >
                    Original Payment Refund
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-3 pt-2">
              <button
                onClick={handleCancelSubmit}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 py-3 text-sm font-bold text-white shadow transition-all cursor-pointer"
              >
                Confirm Cancellation
              </button>
              <button
                onClick={() => setActiveCancelBooking(null)}
                className="w-full text-center text-xs font-bold text-slate-400 hover:underline cursor-pointer"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {activeRescheduleBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-800 p-6 shadow-xl space-y-5 max-h-[85vh] overflow-y-auto">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white">Reschedule Booking</h3>
              <p className="text-xs text-slate-500 mt-1">
                Booking Reference: {activeRescheduleBooking.bookingCode}
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-blue-50/50 dark:bg-blue-900/20 p-3 border border-blue-100/30 text-xs text-blue-950 dark:text-blue-200">
                <p>• Max Reschedules Allowed: <b>{settings?.maxReschedules ?? 3}</b></p>
                <p>• Reschedule Fee: <b>₹{settings?.rescheduleFee ?? 50}</b></p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Select New Date</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="flex-1 rounded-xl border px-3 py-2 text-sm focus:border-blue-500 outline-none bg-slate-50/50 dark:bg-slate-900/50"
                  />
                  <button
                    type="button"
                    onClick={handleSearchSlots}
                    disabled={fetchingSlots || !rescheduleDate}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl px-4 py-2 disabled:opacity-50 cursor-pointer"
                  >
                    {fetchingSlots ? "Searching..." : "Find Slots"}
                  </button>
                </div>
              </div>

              {availableSlots.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Available Slots</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {availableSlots.map((slot) => {
                      const deptTime = slot.scheduleId?.departureTime || "--";
                      const arrTime = slot.scheduleId?.arrivalTime || "--";
                      const boatName = slot.scheduleId?.boatId?.boatName || "Boat Ride";
                      return (
                        <label
                          key={slot._id}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                            selectedSlotId === slot._id
                              ? "border-blue-500 bg-blue-50/20 dark:bg-blue-900/10"
                              : "border-slate-100 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-750"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="rescheduleSlot"
                              value={slot._id}
                              checked={selectedSlotId === slot._id}
                              onChange={() => setSelectedSlotId(slot._id)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{boatName}</p>
                              <p className="text-[10px] text-slate-400 font-semibold">{deptTime} - {arrTime}</p>
                            </div>
                          </div>
                          <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold">
                            {slot.availableOnlineSeats} left
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-3 pt-2">
              <button
                onClick={handleRescheduleSubmit}
                disabled={rescheduling || !selectedSlotId}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-sm font-bold text-white shadow transition-all cursor-pointer disabled:opacity-50"
              >
                {rescheduling ? "Rescheduling..." : "Confirm Reschedule"}
              </button>
              <button
                onClick={() => setActiveRescheduleBooking(null)}
                className="w-full text-center text-xs font-bold text-slate-400 hover:underline cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Track Refund Timeline Modal */}
      {trackRefundBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-slate-800 dark:text-white">Refund Progress Timeline</h3>
              <button onClick={() => setTrackRefundBooking(null)} className="text-slate-400 hover:text-slate-600 font-extrabold cursor-pointer">✕</button>
            </div>
            
            <div className="relative border-l-2 border-blue-100 dark:border-blue-900/30 ml-4 py-1 space-y-5 text-xs text-slate-700 dark:text-slate-300">
              <div className="relative pl-6">
                <span className="absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white dark:border-slate-800 shadow" />
                <p className="font-bold text-slate-800 dark:text-slate-100">Booking Created</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{new Date(trackRefundBooking.createdAt).toLocaleString()}</p>
              </div>

              <div className="relative pl-6">
                <span className="absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white dark:border-slate-800 shadow" />
                <p className="font-bold text-slate-800 dark:text-slate-100">Payment Success</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Fares Paid: ₹{trackRefundBooking.totalAmount}</p>
              </div>

              <div className="relative pl-6">
                <span className="absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white dark:border-slate-800 shadow" />
                <p className="font-bold text-slate-800 dark:text-slate-100">Confirmed</p>
              </div>

              <div className="relative pl-6">
                <span className={`absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-800 shadow ${
                  trackRefundBooking.cancellationRequestedAt ? "bg-green-500" : "bg-slate-200 dark:bg-slate-700"
                }`} />
                <p className="font-bold text-slate-800 dark:text-slate-100">Cancellation Requested</p>
                {trackRefundBooking.cancellationRequestedAt && (
                  <p className="text-[10px] text-slate-400 mt-0.5">Reason: "{trackRefundBooking.cancellationReason}" at {new Date(trackRefundBooking.cancellationRequestedAt).toLocaleString()}</p>
                )}
              </div>

              <div className="relative pl-6">
                <span className={`absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-800 shadow ${
                  trackRefundBooking.ownerRespondedAt ? "bg-green-500" : trackRefundBooking.refundStatus === "REJECTED" ? "bg-red-500" : "bg-slate-200 dark:bg-slate-700"
                }`} />
                <p className="font-bold text-slate-800 dark:text-slate-100">Owner Response</p>
                {trackRefundBooking.ownerRespondedAt && (
                  <p className="text-[10px] text-slate-400 mt-0.5">Remark: "{trackRefundBooking.ownerRemark}" at {new Date(trackRefundBooking.ownerRespondedAt).toLocaleString()}</p>
                )}
              </div>

              <div className="relative pl-6">
                <span className={`absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-800 shadow ${
                  ["VERIFIED", "APPROVED", "PROCESSING", "COMPLETED"].includes(trackRefundBooking.refundStatus || "") ? "bg-green-500" : trackRefundBooking.refundStatus === "REJECTED" ? "bg-red-500" : "bg-slate-200 dark:bg-slate-700"
                }`} />
                <p className="font-bold text-slate-800 dark:text-slate-100">Authority Verification (L1)</p>
                {trackRefundBooking.authorityRemark && (
                  <p className="text-[10px] text-slate-400 mt-0.5">Remark: "{trackRefundBooking.authorityRemark}"</p>
                )}
              </div>

              <div className="relative pl-6">
                <span className={`absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-800 shadow ${
                  ["APPROVED", "PROCESSING", "COMPLETED"].includes(trackRefundBooking.refundStatus || "") ? "bg-green-500" : "bg-slate-200 dark:bg-slate-700"
                }`} />
                <p className="font-bold text-slate-800 dark:text-slate-100">Admin Final Approval (L2)</p>
              </div>

              <div className="relative pl-6">
                <span className={`absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-800 shadow ${
                  ["PROCESSING", "COMPLETED"].includes(trackRefundBooking.refundStatus || "") ? "bg-green-500" : "bg-slate-200 dark:bg-slate-700"
                }`} />
                <p className="font-bold text-slate-800 dark:text-slate-100">Payout Processing</p>
              </div>

              <div className="relative pl-6">
                <span className={`absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-800 shadow ${
                  trackRefundBooking.refundStatus === "COMPLETED" ? "bg-green-500" : "bg-slate-200 dark:bg-slate-700"
                }`} />
                <p className="font-bold text-slate-800 dark:text-slate-100">Refund Completed & Credited</p>
                {trackRefundBooking.refundStatus === "COMPLETED" && (
                  <>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Amount Refunded: ₹{trackRefundBooking.refundAmount} ({trackRefundBooking.refundPercentage}%)</p>
                    {trackRefundBooking.walletTransactionId && (
                      <p className="text-[9px] text-blue-600 font-extrabold mt-0.5">TXID: {trackRefundBooking.walletTransactionId}</p>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <button
              onClick={() => setTrackRefundBooking(null)}
              className="w-full text-center py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              Close Timeline
            </button>
          </div>
        </div>
      )}

      {/* Customer Printable Receipt Modal */}
      {receiptBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-slate-800 dark:text-white">Refund Payout Receipt</h3>
              <button onClick={() => setReceiptBooking(null)} className="text-slate-400 hover:text-slate-600 font-extrabold cursor-pointer">✕</button>
            </div>
            
            <div className="border border-dashed border-slate-200 dark:border-slate-700 p-5 rounded-2xl space-y-4 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/20">
              <div className="text-center space-y-1">
                <p className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">GangaYatra Platform</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Official Payout Statement</p>
              </div>
              
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 border-t border-b border-slate-100 dark:border-slate-700/50 py-3 mt-4">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Booking Code</span>
                  <span className="font-bold text-slate-800 dark:text-white">{receiptBooking.bookingCode || receiptBooking._id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Transaction ID</span>
                  <span className="font-mono text-slate-800 dark:text-white">{receiptBooking.walletTransactionId || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Customer Name</span>
                  <span className="font-bold text-slate-800 dark:text-white">{receiptBooking.passengerName || "Customer"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Processed Date</span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    {receiptBooking.refundProcessedAt ? new Date(receiptBooking.refundProcessedAt).toLocaleString() : "N/A"}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <span>Grand Total Paid:</span>
                  <span className="font-bold">₹{receiptBooking.totalAmount}</span>
                </div>
                <div className="flex justify-between text-blue-650 font-bold">
                  <span>Refund Percentage:</span>
                  <span>{receiptBooking.refundPercentage}%</span>
                </div>
                <div className="flex justify-between border-t border-dashed pt-2 font-black text-sm text-slate-900 dark:text-white">
                  <span>Amount Credited to Wallet:</span>
                  <span className="text-blue-600 dark:text-blue-400">₹{receiptBooking.refundAmount}</span>
                </div>
              </div>
              
              <div className="border-t pt-3 text-[10px] text-slate-450 space-y-1">
                <p>• <b>Cancellation Reason:</b> {receiptBooking.cancellationReason || "Customer cancel"}</p>
                <p>• <b>Authority Notes:</b> "{receiptBooking.authorityRemark || "Refund processed successfully"}"</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white cursor-pointer transition shadow"
              >
                Print Slip
              </button>
              <button
                onClick={() => setReceiptBooking(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer transition"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bookings listing */}
      <section className="grid gap-5 lg:grid-cols-2">
        {filteredBookings.map((booking) => {
          const schedule = booking.slotId?.scheduleId;
          const boat = schedule?.boatId;
          const route = schedule?.routeId;

          const bookingId = booking._id;
          const boatName = boat?.boatName || "Boat Ride";

          const routeName = `${route?.sourceGhatId?.name || "Source"} ➔ ${route?.destinationGhatId?.name || "Destination"
            }`;

          const travelDate = booking.slotId?.slotDate || booking.createdAt;

          const travelTime = `${schedule?.departureTime || "--"} - ${schedule?.arrivalTime || "--"
            }`;

          const canCancel =
            booking.bookingStatus !== "CANCELLED" &&
            booking.bookingStatus !== "COMPLETED";

          const canReschedule =
            booking.bookingStatus !== "CANCELLED" &&
            booking.bookingStatus !== "COMPLETED" &&
            (booking.rescheduleCount || 0) < (settings?.maxReschedules ?? 3);

          return (
            <div
              key={bookingId}
              className="rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {boatName}
                    </h3>

                    <p className="mt-1 text-xs font-bold text-blue-600 tracking-wider">
                      {booking.bookingCode || bookingId}
                    </p>

                    <p className="mt-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                      <MapPin size={14} className="text-slate-400" />
                      {routeName}
                    </p>

                    <div className="mt-3.5 flex flex-wrap gap-2">
                      <StatusBadge status={booking.bookingStatus || "PENDING"} />
                      <PaymentBadge status={booking.paymentStatus || "PENDING"} />
                      <TypeBadge type={booking.bookingType || "ONLINE"} />
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 grid-cols-2 md:grid-cols-4">
                  <InfoItem
                    icon={<CalendarCheck size={16} />}
                    label="Travel Date"
                    value={travelDate ? formatLocalDate(travelDate) : "-"}
                  />

                  <InfoItem
                    icon={<Clock size={16} />}
                    label="Travel Time"
                    value={travelTime}
                  />

                  <InfoItem
                    icon={<Users size={16} />}
                    label="Seats"
                    value={String(booking.seatsBooked || 1)}
                  />

                  <InfoItem
                    icon={<CreditCard size={16} />}
                    label="Check-In"
                    value={booking.checkInStatus || "PENDING"}
                  />
                </div>

                {/* Cancellation & Refund Status Timeline */}
                {booking.bookingStatus === "CANCELLED" && (
                  <div className="mt-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-100/50 space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                      <AlertCircle size={14} className="text-orange-500" /> Cancellation & Refund Details
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold">Cancelled By:</span>{" "}
                        <span className="font-bold text-slate-700 dark:text-slate-300 uppercase">{booking.cancelledBy || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">Refund Status:</span>{" "}
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          booking.refundStatus === "COMPLETED" ? "bg-green-50 text-green-700" :
                          booking.refundStatus === "PROCESSING" ? "bg-purple-50 text-purple-700" :
                          booking.refundStatus === "APPROVED" ? "bg-emerald-50 text-emerald-700" :
                          booking.refundStatus === "VERIFIED" ? "bg-indigo-50 text-indigo-700" :
                          booking.refundStatus === "UNDER_REVIEW" ? "bg-blue-50 text-blue-700" :
                          booking.refundStatus === "PENDING" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600 dark:bg-slate-700"
                        }`}>
                          {booking.refundStatus === "PENDING" ? "Refund Requested" :
                           booking.refundStatus === "UNDER_REVIEW" ? "Under Review" :
                           booking.refundStatus === "VERIFIED" ? "Verified (L1)" :
                           booking.refundStatus === "APPROVED" ? "Approved (L2)" :
                           booking.refundStatus === "PROCESSING" ? "Processing" :
                           booking.refundStatus === "COMPLETED" ? "Completed" : booking.refundStatus || "NONE"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">Refund Amount:</span>{" "}
                        <span className="font-extrabold text-blue-600 dark:text-blue-400">₹{booking.refundAmount ?? 0}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">Refund Policy Applied:</span>{" "}
                        <span className="font-bold text-slate-700 dark:text-slate-305">{booking.refundPercentage || 0}% Refund</span>
                      </div>
                      {booking.expectedRefundDate && booking.refundStatus !== "COMPLETED" && (
                        <div>
                          <span className="text-slate-400 font-semibold">Expected Refund Date:</span>{" "}
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {new Date(booking.expectedRefundDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {booking.walletTransactionId && (
                        <div className="col-span-2">
                          <span className="text-slate-400 font-semibold">Wallet Transaction ID:</span>{" "}
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{booking.walletTransactionId}</span>
                        </div>
                      )}
                    </div>
                    {booking.cancellationReason && (
                      <div className="text-xs border-t pt-2 border-slate-200/50">
                        <span className="text-slate-400 font-semibold">Cancellation Reason:</span>{" "}
                        <span className="text-slate-650 dark:text-slate-300 italic">"{booking.cancellationReason}"</span>
                      </div>
                    )}
                    {booking.authorityRemark && (
                      <div className="text-xs border-t pt-2 border-slate-200/50">
                        <span className="text-slate-450 font-bold block text-[10px] uppercase text-orange-600 dark:text-orange-400">Authority Remark</span>
                        <span className="text-slate-700 dark:text-slate-300 font-semibold">"{booking.authorityRemark}"</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col justify-between gap-4 border-t border-slate-50 dark:border-slate-700/50 pt-5 md:flex-row md:items-center">
                <p className="text-2xl font-black text-blue-700 dark:text-blue-400">
                  ₹{Number(booking.totalAmount || 0).toLocaleString("en-IN")}
                </p>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() =>
                      navigate(`/ticket/${booking.bookingCode || bookingId}`)
                    }
                    className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-755 px-4 py-2.5 text-xs font-bold text-white shadow transition-all"
                  >
                    <Ticket size={14} />
                    Download
                  </button>

                  {booking.paymentStatus === "PENDING" &&
                    booking.bookingStatus !== "CANCELLED" && (
                      <button
                        onClick={() => setActivePaymentBooking(booking)}
                        className="flex items-center gap-1.5 rounded-xl bg-green-600 hover:bg-green-705 px-4 py-2.5 text-xs font-bold text-white shadow transition-all"
                      >
                        Pay Now
                      </button>
                    )}

                  {booking.bookingStatus === "COMPLETED" && (
                    <button
                      onClick={() =>
                        navigate(`/customer/reviews?booking=${bookingId}`)
                      }
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-705 px-4 py-2.5 text-xs font-bold text-white shadow transition-all"
                    >
                      Rate Ride
                    </button>
                  )}

                  {booking.bookingStatus === "CANCELLED" && (
                    <button
                      onClick={() => navigate("/search-route")}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-55 dark:hover:bg-slate-700 transition-colors"
                    >
                      Rebook
                    </button>
                  )}

                  {booking.bookingStatus === "CANCELLED" && (
                    <button
                      onClick={() => setTrackRefundBooking(booking)}
                      className="flex items-center gap-1 rounded-xl bg-blue-50 dark:bg-blue-950/20 px-4 py-2.5 text-xs font-bold text-blue-750 dark:text-blue-400 transition-all hover:bg-blue-100/50 cursor-pointer"
                    >
                      <Clock size={12} />
                      Track Refund
                    </button>
                  )}

                  {booking.bookingStatus === "CANCELLED" && booking.refundStatus === "COMPLETED" && (
                    <button
                      onClick={() => setReceiptBooking(booking)}
                      className="flex items-center gap-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 px-4 py-2.5 text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-105/50 cursor-pointer"
                    >
                      <FileText size={12} />
                      Download Receipt
                    </button>
                  )}

                  {canReschedule && (
                    <button
                      onClick={() => handleRescheduleClick(booking)}
                      className="flex items-center gap-1 rounded-xl bg-blue-50 hover:bg-blue-105 px-4 py-2.5 text-xs font-bold text-blue-750 dark:text-blue-400 transition-all cursor-pointer"
                    >
                      <RotateCcw size={14} />
                      Reschedule ({(booking.rescheduleCount || 0)}/{(settings?.maxReschedules ?? 3)})
                    </button>
                  )}

                  {canCancel && (
                    <button
                      onClick={() => handleCancelClick(booking)}
                      className="flex items-center gap-1 rounded-xl bg-red-50 dark:bg-red-950/20 px-4 py-2.5 text-xs font-bold text-red-700 dark:text-red-400 transition-all hover:bg-red-101/50 cursor-pointer"
                    >
                      <XCircle size={14} />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-blue-50/30 bg-white dark:bg-slate-800 p-5 shadow-sm">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{title}</p>
      <h3 className="mt-2 text-2xl font-black text-slate-800 dark:text-slate-100">{value}</h3>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-3.5 border border-slate-100/10">
      <div className="mb-2 text-blue-600">{icon}</div>
      <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">{label}</p>
      <p className="mt-0.5 text-xs font-extrabold text-slate-800 dark:text-slate-200">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style =
    status === "CONFIRMED"
      ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
      : status === "COMPLETED"
        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400"
        : status === "CANCELLED"
          ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
          : "bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400";

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${style}`}>
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const style =
    status === "PAID"
      ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
      : status === "FAILED"
        ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
        : status === "REFUNDED"
          ? "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
          : "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400";

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${style}`}>
      {status}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const style =
    type === "ONLINE"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
      : type === "OFFLINE"
        ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
        : "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400";

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${style}`}>
      {type}
    </span>
  );
}