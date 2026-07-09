import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Ship,
  CreditCard,
  AlertCircle,
  Calendar,
} from "lucide-react";
import {
  getBookingById,
  approveRefund,
  rejectRefund
} from "../api/refundsApi";

export default function RefundDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [remark, setRemark] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const loadBooking = async () => {
    if (!bookingId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getBookingById(bookingId);
      setBooking(data);
      setRemark(data.authorityRemark || "");
      setCustomAmount(String(data.refundAmount || 0));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const handleApprove = async () => {
    if (!booking) return;
    const ok = window.confirm("CONFIRMATION:\n\nAre you sure you want to approve this refund payout?");
    if (!ok) return;

    try {
      setSaving(true);
      await approveRefund(booking._id, {
        refundAmount: Number(customAmount) || booking.refundAmount,
        remark: remark || "Refund approved by authority"
      });
      alert("Refund approved successfully!");
      navigate("/authority/refunds");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to approve refund");
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async () => {
    if (!booking) return;
    const ok = window.confirm("CONFIRMATION:\n\nAre you sure you want to reject this refund request?");
    if (!ok) return;

    try {
      setSaving(true);
      await rejectRefund(booking._id, { reason: remark || "Refund request rejected by authority" });
      alert("Refund request rejected.");
      navigate("/authority/refunds");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to reject refund");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRemark = async () => {
    if (!booking) return;
    try {
      setSaving(true);
      await approveRefund(booking._id, { remark });
      alert("Remark saved successfully.");
      loadBooking();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save remark");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !booking) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 font-bold text-slate-500">Retrieving booking audit details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center max-w-md mx-auto border shadow mt-10">
        <AlertCircle size={40} className="mx-auto text-red-500 mb-3" />
        <h3 className="text-lg font-black text-slate-800">Inspection Error</h3>
        <p className="text-sm text-slate-500 mt-2">{error || "Booking not found"}</p>
        <button onClick={() => navigate("/authority/refunds")} className="mt-6 bg-slate-900 text-white rounded-xl px-5 py-2 text-xs font-bold">
          Go Back
        </button>
      </div>
    );
  }

  const customer = booking.customerId || {};
  const slot = booking.slotId || {};
  const schedule = slot.scheduleId || {};
  const boat = schedule.boatId || {};
  const owner = boat.ownerId || {};
  const route = schedule.routeId || {};

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <button
        onClick={() => navigate("/authority/refunds")}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to Approvals Ledger
      </button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Columns - Details Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Core Booking Info */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100/60 space-y-4">
            <div className="flex justify-between items-start border-b pb-3.5">
              <div>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  Audit Summary
                </span>
                <h2 className="text-lg font-black text-slate-800 mt-1">
                  Reference: {booking.bookingCode || booking._id}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-semibold">Total Paid</span>
                <span className="text-xl font-black text-slate-900">₹{booking.totalAmount}</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 text-xs">
              <div className="space-y-1">
                <span className="text-slate-450 block font-bold uppercase text-[10px]">Route Path</span>
                <span className="font-bold text-slate-800">
                  {route.sourceGhatId?.name || "Source"} ➔ {route.destinationGhatId?.name || "Destination"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-450 block font-bold uppercase text-[10px]">Travel Date & Departure</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Calendar size={12} /> {slot.slotDate ? new Date(slot.slotDate).toLocaleDateString() : ""} ({schedule.departureTime || ""})
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-450 block font-bold uppercase text-[10px]">Seats Booked</span>
                <span className="font-bold text-slate-800">{booking.seatsBooked} Ticket(s)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Customer & Owner Details */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Customer Info */}
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100/60 space-y-3">
              <h3 className="text-sm font-black text-slate-850 flex items-center gap-1.5 border-b pb-2">
                <User size={16} className="text-blue-500" /> Customer Information
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Name</span>
                  <span className="font-bold text-slate-800">{customer.name || booking.passengerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Email Address</span>
                  <span className="font-bold text-slate-700">{customer.email || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Mobile Number</span>
                  <span className="font-bold text-slate-700">{customer.phone || booking.passengerPhone}</span>
                </div>
              </div>
            </div>

            {/* Owner & Boat Info */}
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100/60 space-y-3">
              <h3 className="text-sm font-black text-slate-850 flex items-center gap-1.5 border-b pb-2">
                <Ship size={16} className="text-blue-500" /> Owner & Vessel
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Owner Name</span>
                  <span className="font-bold text-slate-800">{owner.name || "Owner"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Vessel Spec</span>
                  <span className="font-bold text-slate-800">{boat.boatName || "Boat"} ({boat.boatNumber || "—"})</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Route Base Fare</span>
                  <span className="font-bold text-slate-700">₹{route.baseFare || 0} per seat</span>
                </div>
              </div>
            </div>
          </div>
          {/* Card 3: Refund Calculations & Control Panel */}
          {booking.refundStatus === "PENDING" && (
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-blue-100 bg-gradient-to-br from-white to-blue-50/10 space-y-5">
              <div>
                <h3 className="text-sm font-black text-blue-950 flex items-center gap-1.5">
                  <CreditCard size={16} className="text-blue-600" /> Refund Verification Panel
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Adjust the eligible payout values and sign to verify this request.</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-450 uppercase">Eligible Refund Amount (Calculated)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-sm font-bold bg-white focus:border-blue-500 outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">
                    System suggests: <b>₹{booking.refundAmount}</b> based on cancellation policy.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-450 uppercase">Expected Payout Window</label>
                  <input
                    type="text"
                    disabled
                    value={booking.expectedRefundDate ? new Date(booking.expectedRefundDate).toLocaleDateString() : "Immediate"}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold bg-slate-50 text-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-450 uppercase">Authority Remark / Notes</label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter refund notes..."
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold focus:border-blue-500 outline-none bg-white"
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={handleApprove}
                  disabled={saving}
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 rounded-xl bg-green-600 hover:bg-green-700 py-3 text-xs font-bold text-white shadow transition cursor-pointer"
                >
                  <CheckCircle size={14} /> Verify & Recommend
                </button>
                <button
                  onClick={handleReject}
                  disabled={saving}
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 rounded-xl bg-red-650 hover:bg-red-750 py-3 text-xs font-bold text-white shadow transition cursor-pointer bg-red-600"
                >
                  <XCircle size={14} /> Reject Refund
                </button>
                <button
                  onClick={handleSaveRemark}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Save Notes Only
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Status, Timeline & Details */}
        <div className="space-y-6">
          {/* Card 4: Current Status Block */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100/60 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Refund Status</h3>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Payment Status</span>
                <span className="text-sm font-bold text-slate-800 uppercase">{booking.paymentStatus}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Refund Status</span>
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase mt-1 ${booking.refundStatus === "COMPLETED" ? "bg-green-50 text-green-700 border border-green-200" :
                    booking.refundStatus === "UNDER_REVIEW" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                      booking.refundStatus === "PENDING" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-slate-50 text-slate-700"
                  }`}>
                  {booking.refundStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Card 5: Timeline Detail */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100/60 space-y-4">
            <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider">Process Audits</h3>
            <div className="relative border-l border-slate-100 ml-2 space-y-4 text-xs font-medium pl-4 py-1">
              <div>
                <p className="text-slate-800 font-bold">Booking Initiated</p>
                <p className="text-[10px] text-slate-400">{new Date(booking.createdAt).toLocaleString()}</p>
              </div>
              {booking.cancellationRequestedAt && (
                <div>
                  <p className="text-slate-800 font-bold">Cancellation Requested</p>
                  <p className="text-[10px] text-slate-400">{new Date(booking.cancellationRequestedAt).toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500 italic mt-0.5">Reason: "{booking.cancellationReason}"</p>
                </div>
              )}
              {booking.ownerRespondedAt && (
                <div>
                  <p className="text-slate-800 font-bold">Owner Response</p>
                  <p className="text-[10px] text-slate-400">{new Date(booking.ownerRespondedAt).toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500 italic mt-0.5">Remark: "{booking.ownerRemark}"</p>
                </div>
              )}
              {booking.refundProcessedAt && (
                <div>
                  <p className="text-slate-800 font-bold">Processed & Wallet Credited</p>
                  <p className="text-[10px] text-slate-400">{new Date(booking.refundProcessedAt).toLocaleString()}</p>
                  {booking.walletTransactionId && (
                    <p className="text-[9px] text-blue-600 font-extrabold mt-0.5">TXID: {booking.walletTransactionId}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
