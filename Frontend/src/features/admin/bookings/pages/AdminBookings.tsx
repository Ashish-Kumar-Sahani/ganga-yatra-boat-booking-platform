import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Search, Calendar, BarChart2, TrendingUp, AlertTriangle } from "lucide-react";
import { useAdminBookingsStore } from "../store/bookingsStore";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from "recharts";

export default function AdminBookings() {
  const {
    bookings,
    pendingRefunds,
    cancellationLogs,
    refundLogs,
    loading,
    error,
    pagination,
    fetchBookings,
    updateStatus,
    fetchPendingRefunds,
    approveRefund,
    rejectRefund,
    fetchCancellationLogs,
    fetchRefundLogs
  } = useAdminBookingsStore();

  const [activeTab, setActiveTab] = useState<"ledger" | "refunds" | "cancellations" | "refund_logs" | "monitoring">("ledger");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDetailsBooking, setSelectedDetailsBooking] = useState<any | null>(null);
  const [selectedRefundBooking, setSelectedRefundBooking] = useState<any | null>(null);
  const [selectedTimelineBooking, setSelectedTimelineBooking] = useState<any | null>(null);

  const loadData = (page = currentPage) => {
    fetchBookings({
      search: searchTerm,
      status: statusFilter,
      paymentStatus: paymentFilter,
      page,
      limit: 10,
    });
  };

  useEffect(() => {
    if (activeTab === "ledger") {
      loadData(1);
    } else if (activeTab === "refunds") {
      fetchPendingRefunds();
    } else if (activeTab === "cancellations") {
      fetchCancellationLogs();
    } else if (activeTab === "refund_logs") {
      fetchRefundLogs();
    } else if (activeTab === "monitoring") {
      fetchPendingRefunds();
      fetchCancellationLogs();
      fetchRefundLogs();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "ledger") {
      loadData(1);
      setCurrentPage(1);
    }
  }, [statusFilter, paymentFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "ledger") {
      loadData(1);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadData(page);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    if (confirm(`Are you sure you want to mark this booking as ${status}?`)) {
      await updateStatus(id, status);
    }
  };

  const handleAdminApproveStep = async (booking: any) => {
    const status = booking.refundStatus;
    let nextStepText = "";
    let payloadAction = "";

    if (status === "VERIFIED") {
      nextStepText = "Final Approve this verified request (sets to APPROVED)";
      payloadAction = "FINAL_APPROVE";
    } else if (status === "APPROVED") {
      nextStepText = "Mark this request as PROCESSING";
      payloadAction = "PROCESS";
    } else if (status === "PROCESSING") {
      nextStepText = "Mark this request as COMPLETED (credits user wallet)";
      payloadAction = "COMPLETE";
    } else {
      nextStepText = "Verify and approve this request";
      payloadAction = "FINAL_APPROVE";
    }

    const ok = window.confirm(`CONFIRMATION REQUIRED:\n\nAre you sure you want to: ${nextStepText}?`);
    if (!ok) return;

    try {
      const okCall = await approveRefund(booking._id, { action: payloadAction });
      if (okCall) {
        alert("Refund status updated successfully!");
        loadData(currentPage);
        fetchPendingRefunds();
      } else {
        alert("Failed to update refund status.");
      }
    } catch (e: any) {
      alert(e.response?.data?.message || "Operation failed");
    }
  };

  const handleRejectRefund = async (id: string) => {
    const reason = window.prompt("Reason for rejection:", "Refund request rejected by admin");
    if (reason === null) return;
    const ok = await rejectRefund(id, reason);
    if (ok) {
      alert("Refund rejected successfully");
      loadData(currentPage);
      fetchPendingRefunds();
    } else {
      alert("Failed to reject refund");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-950">Bookings Ledger</h1>
          <p className="text-sm text-slate-500 mt-1">Audit, filter, and track passenger tickets, boat rides, and live routes status.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex border-b mb-4">
        {(["ledger", "refunds", "cancellations", "refund_logs", "monitoring"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-bold text-xs uppercase border-b-2 transition-all cursor-pointer ${activeTab === tab
                ? "border-blue-650 border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
          >
            {tab === "ledger" && "Bookings Ledger"}
            {tab === "refunds" && `Refund Approvals (${pendingRefunds?.length || 0})`}
            {tab === "cancellations" && "Cancellation Logs"}
            {tab === "refund_logs" && "Refund Logs"}
            {tab === "monitoring" && "Refund Monitoring"}
          </button>
        ))}
      </div>

      {/* Filters Form */}
      {activeTab === "ledger" && (
        <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow border border-slate-100 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3 rounded-xl border px-3 py-2.5 bg-slate-50 flex-1 lg:max-w-xs focus-within:border-blue-500 transition">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search passenger name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border px-4 py-2.5 text-sm bg-slate-50 focus:border-blue-500 outline-none cursor-pointer"
            >
              <option value="">All Trip Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="rounded-xl border px-4 py-2.5 text-sm bg-slate-50 focus:border-blue-500 outline-none cursor-pointer"
            >
              <option value="">All Payment Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="PAID">PAID</option>
              <option value="REFUNDED">REFUNDED</option>
            </select>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-blue-700 shadow transition cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-center justify-between">
          <span><b>Error:</b> {error}</span>
          <button onClick={() => loadData()} className="font-bold underline hover:text-red-800 transition">Retry</button>
        </div>
      )}

      {/* Bookings table */}
      {activeTab === "ledger" && (
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50/80 text-blue-950 font-semibold border-b">
                <tr>
                  <th className="p-4">Passenger</th>
                  <th className="p-4">Boat Spec</th>
                  <th className="p-4">Route / Date</th>
                  <th className="p-4">Fares</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Trip Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-4"><div className="h-4 w-32 bg-slate-200 rounded"></div></td>
                      <td className="p-4"><div className="h-4 w-28 bg-slate-200 rounded"></div></td>
                      <td className="p-4"><div className="h-4 w-36 bg-slate-200 rounded"></div></td>
                      <td className="p-4"><div className="h-4 w-16 bg-slate-200 rounded"></div></td>
                      <td className="p-4"><div className="h-6 w-16 bg-slate-200 rounded-full"></div></td>
                      <td className="p-4"><div className="h-6 w-16 bg-slate-200 rounded-full"></div></td>
                      <td className="p-4"><div className="h-8 w-24 bg-slate-200 rounded mx-auto"></div></td>
                    </tr>
                  ))
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-500 font-medium">
                      No bookings found matching filters.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => {
                    const passenger = booking.passengerName || booking.customerId?.name || "Customer";
                    const phone = booking.passengerPhone || booking.customerId?.phone || "—";
                    const boat = booking.slotId?.scheduleId?.boatId?.boatName || "Boat Ride";
                    const src = booking.slotId?.scheduleId?.routeId?.sourceGhatId?.name || "Source";
                    const dst = booking.slotId?.scheduleId?.routeId?.destinationGhatId?.name || "Destination";

                    return (
                      <tr key={booking._id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <div className="font-semibold text-blue-950">{passenger}</div>
                          <div className="text-xs text-slate-400">Phone: {phone}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-700">{boat}</div>
                          <div className="text-xs text-slate-500">Seats: <b>{booking.seatsBooked}</b></div>
                        </td>
                        <td className="p-4">
                          <div className="text-xs font-semibold text-blue-900">{src} → {dst}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Calendar size={10} /> {new Date(booking.createdAt).toLocaleDateString("en-IN")}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-blue-950">₹{booking.totalAmount}</td>
                        <td className="p-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase ${booking.paymentStatus === "PAID"
                              ? "bg-green-50 text-green-700"
                              : booking.paymentStatus === "PENDING"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-red-50 text-red-700"
                            }`}>
                            {booking.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase ${booking.bookingStatus === "CONFIRMED" || booking.bookingStatus === "COMPLETED"
                              ? "bg-green-50 text-green-700"
                              : booking.bookingStatus === "PENDING"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-red-50 text-red-700"
                            }`}>
                            {booking.bookingStatus}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-1.5 flex-wrap max-w-[240px] mx-auto">
                            {booking.bookingStatus === "CONFIRMED" && (
                              <button
                                onClick={() => handleUpdateStatus(booking._id, "COMPLETED")}
                                className="rounded-lg bg-green-50 hover:bg-green-100 text-green-700 px-2.5 py-1 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle size={12} /> Complete
                              </button>
                            )}
                            {(booking.bookingStatus === "CONFIRMED" || booking.bookingStatus === "PENDING") && (
                              <button
                                onClick={() => handleUpdateStatus(booking._id, "CANCELLED")}
                                className="rounded-lg bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                <XCircle size={12} /> Cancel
                              </button>
                            )}
                            {booking.bookingStatus === "CANCELLED" && (
                              <div className="flex flex-wrap gap-1 items-center justify-center">
                                <button
                                  onClick={() => setSelectedDetailsBooking(booking)}
                                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] cursor-pointer"
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={() => setSelectedRefundBooking(booking)}
                                  className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] cursor-pointer"
                                >
                                  Refund Details
                                </button>
                                {["VERIFIED", "APPROVED", "PROCESSING"].includes(booking.refundStatus || "") && (
                                  <button
                                    onClick={() => handleAdminApproveStep(booking)}
                                    className="px-2 py-1 rounded bg-green-50 hover:bg-green-100 text-green-700 font-bold text-[10px] cursor-pointer"
                                  >
                                    {booking.refundStatus === "VERIFIED" && "Approve"}
                                    {booking.refundStatus === "APPROVED" && "Process"}
                                    {booking.refundStatus === "PROCESSING" && "Complete"}
                                  </button>
                                )}
                                {["PENDING", "VERIFIED", "APPROVED", "PROCESSING"].includes(booking.refundStatus || "") && (
                                  <button
                                    onClick={() => handleRejectRefund(booking._id)}
                                    className="px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[10px] cursor-pointer"
                                  >
                                    Reject
                                  </button>
                                )}
                                <button
                                  onClick={() => setSelectedTimelineBooking(booking)}
                                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] cursor-pointer"
                                >
                                  Timeline
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination control */}
          {!loading && bookings.length > 0 && (
            <div className="flex items-center justify-between border-t p-4 text-xs font-semibold text-slate-500">
              <p>
                Showing Page <b>{pagination.page}</b> of <b>{pagination.pages}</b> (Total: <b>{pagination.total}</b> Bookings)
              </p>

              <div className="flex gap-1.5">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="rounded-lg border px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50 transition cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="rounded-lg border px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50 transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pending Refunds Tab */}
      {activeTab === "refunds" && (
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50/80 text-blue-950 font-semibold border-b">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Booking Details</th>
                  <th className="p-4">Fares & Refund Amount</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500">Loading pending refunds...</td>
                  </tr>
                ) : pendingRefunds.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">No pending refund requests found.</td>
                  </tr>
                ) : (
                  pendingRefunds.map((refund) => {
                    const customer = refund.customerId?.name || "Customer";
                    const email = refund.customerId?.email || "";
                    const code = refund.bookingCode || refund._id;
                    const amount = refund.refundAmount || 0;
                    return (
                      <tr key={refund._id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <div className="font-semibold text-blue-950">{customer}</div>
                          <div className="text-xs text-slate-400">{email}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-xs font-semibold text-blue-900">Code: {code}</div>
                          <div className="text-[10px] text-slate-500">Seats: {refund.seatsBooked}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-xs font-semibold text-slate-500">Fare: ₹{refund.totalAmount}</div>
                          <div className="font-bold text-blue-600">Refund: ₹{amount}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-xs italic text-slate-600">"{refund.refundReason || refund.cancellationReason || "No reason specified"}"</div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleAdminApproveStep(refund)}
                              className="rounded-lg bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle size={12} /> Approve
                            </button>
                            <button
                              onClick={() => handleRejectRefund(refund._id)}
                              className="rounded-lg bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              <XCircle size={12} /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cancellation Logs Tab */}
      {activeTab === "cancellations" && (
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50/80 text-blue-950 font-semibold border-b">
                <tr>
                  <th className="p-4">Booking / Passenger</th>
                  <th className="p-4">Cancelled By / At</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Fares Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-500">Loading cancellation logs...</td>
                  </tr>
                ) : cancellationLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-500 font-medium">No cancellation logs found.</td>
                  </tr>
                ) : (
                  cancellationLogs.map((log) => {
                    const passenger = log.passengerName || log.customerId?.name || "Customer";
                    const code = log.bookingCode || log._id;
                    return (
                      <tr key={log._id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <div className="font-semibold text-blue-950">{passenger}</div>
                          <div className="text-xs text-blue-600 font-bold">Code: {code}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-700 uppercase text-xs">{log.cancelledBy || "N/A"}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {log.cancelledAt ? new Date(log.cancelledAt).toLocaleString() : "N/A"}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-xs text-slate-600 italic">"{log.cancellationReason || "No reason specified"}"</div>
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-500">
                          <div>Paid: ₹{log.totalAmount}</div>
                          <div>Refunded: <b className="text-blue-600">₹{log.refundAmount}</b></div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Refund Logs Tab */}
      {activeTab === "refund_logs" && (
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50/80 text-blue-950 font-semibold border-b">
                <tr>
                  <th className="p-4">Passenger / Ref</th>
                  <th className="p-4">Refund Amount</th>
                  <th className="p-4">Processed Date</th>
                  <th className="p-4">Status / Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-500">Loading refund logs...</td>
                  </tr>
                ) : refundLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-500 font-medium">No refund logs found.</td>
                  </tr>
                ) : (
                  refundLogs.map((log) => {
                    const passenger = log.passengerName || log.customerId?.name || "Customer";
                    const code = log.bookingCode || log._id;
                    return (
                      <tr key={log._id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <div className="font-semibold text-blue-950">{passenger}</div>
                          <div className="text-xs text-blue-600">Code: {code}</div>
                        </td>
                        <td className="p-4 font-bold text-blue-600">₹{log.refundAmount}</td>
                        <td className="p-4 text-xs text-slate-500">
                          {log.refundProcessedAt ? new Date(log.refundProcessedAt).toLocaleString() : "N/A"}
                        </td>
                        <td className="p-4 text-xs">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${log.refundStatus === "COMPLETED"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                            }`}>
                            {log.refundStatus}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1">{log.refundReason || ""}</div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Refund Monitoring Tab */}
      {activeTab === "monitoring" && (
        <div className="mt-6 space-y-6">
          {/* Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Cancellations</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{(cancellationLogs || []).length}</span>
              </div>
              <div className="p-3 bg-red-50 text-red-650 rounded-xl">
                <AlertTriangle size={20} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Refunds Issued</span>
                <span className="text-2xl font-black text-green-600 mt-1 block">
                  ₹{(refundLogs || []).filter((l: any) => l.refundStatus === "COMPLETED").reduce((sum: number, l: any) => sum + (l.refundAmount || 0), 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="p-3 bg-green-50 text-green-650 rounded-xl">
                <TrendingUp size={20} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Under Review</span>
                <span className="text-2xl font-black text-blue-650 mt-1 block">
                  ₹{(pendingRefunds || []).reduce((sum: number, l: any) => sum + (l.refundAmount || 0), 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="p-3 bg-blue-50 text-blue-650 rounded-xl">
                <BarChart2 size={20} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Rejected Requests</span>
                <span className="text-2xl font-black text-red-600 mt-1 block">
                  {(refundLogs || []).filter((l: any) => l.refundStatus === "FAILED" || l.refundStatus === "REJECTED").length}
                </span>
              </div>
              <div className="p-3 bg-slate-50 text-slate-650 rounded-xl">
                <XCircle size={20} />
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Chart 1: Status Distribution */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-800">Refund Status Ledger Distribution</h3>
                <p className="text-[10px] text-slate-450 mt-0.5">Real-time status breakdown from the authority approvals pipeline.</p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Completed", value: (refundLogs || []).filter((l: any) => l.refundStatus === "COMPLETED").length, color: "#10B981" },
                      { name: "Under Review", value: (pendingRefunds || []).length, color: "#3B82F6" },
                      { name: "Rejected", value: (refundLogs || []).filter((l: any) => l.refundStatus === "FAILED" || l.refundStatus === "REJECTED").length, color: "#EF4444" },
                    ]}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <Tooltip cursor={{ fill: "#F8FAFC" }} contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {[
                        { color: "#10B981" },
                        { color: "#3B82F6" },
                        { color: "#EF4444" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Reason Breakdown */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-800">Cancellation Factors Breakdown</h3>
                <p className="text-[10px] text-slate-455 mt-0.5">Primary reasons cited by passengers & operators for cancellations.</p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Customer Cancel", value: (cancellationLogs || []).filter((l: any) => l.cancelledBy === "CUSTOMER").length || 1, color: "#8B5CF6" },
                        { name: "Owner Cancel", value: (cancellationLogs || []).filter((l: any) => l.cancelledBy === "OWNER" || l.cancelledBy === "ADMIN").length || 0, color: "#F59E0B" },
                        { name: "Weather Force Majeure", value: (cancellationLogs || []).filter((l: any) => l.cancelledBy === "WEATHER").length || 0, color: "#3B82F6" },
                        { name: "Vessel Breakdown", value: (cancellationLogs || []).filter((l: any) => l.cancelledBy === "BREAKDOWN").length || 0, color: "#EF4444" },
                      ].filter(d => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {[
                        { color: "#8B5CF6" },
                        { color: "#F59E0B" },
                        { color: "#3B82F6" },
                        { color: "#EF4444" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                    <Legend verticalAlign="bottom" height={36} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "10px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Overlay */}
      {selectedDetailsBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-slate-800">Passenger & Ride Details</h3>
              <button onClick={() => setSelectedDetailsBooking(null)} className="text-slate-400 hover:text-slate-600 font-extrabold cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs font-semibold text-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Passenger Name</span>
                  <span className="font-bold text-slate-800">{selectedDetailsBooking.passengerName || selectedDetailsBooking.customerId?.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Passenger Phone</span>
                  <span className="font-bold text-slate-800">{selectedDetailsBooking.passengerPhone || selectedDetailsBooking.customerId?.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Vessel / Boat</span>
                  <span className="font-bold text-slate-800">{selectedDetailsBooking.slotId?.scheduleId?.boatId?.boatName || "Boat Ride"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Route Taken</span>
                  <span className="font-bold text-slate-800">
                    {selectedDetailsBooking.slotId?.scheduleId?.routeId?.sourceGhatId?.name} ➔ {selectedDetailsBooking.slotId?.scheduleId?.routeId?.destinationGhatId?.name}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Travel Date</span>
                  <span className="font-bold text-slate-800">{new Date(selectedDetailsBooking.slotId?.slotDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Check-in Status</span>
                  <span className="font-bold text-slate-850 uppercase">{selectedDetailsBooking.checkInStatus}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedDetailsBooking(null)}
              className="w-full text-center py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Refund Overlay */}
      {selectedRefundBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-slate-800">Refund Payout Details</h3>
              <button onClick={() => setSelectedRefundBooking(null)} className="text-slate-400 hover:text-slate-600 font-extrabold cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs font-semibold text-slate-700 bg-slate-50/50 p-4 rounded-2xl border">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Eligible Refund</span>
                  <span className="font-bold text-blue-600">₹{selectedRefundBooking.refundAmount || 0}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Refund Percentage</span>
                  <span className="font-bold text-slate-800">{selectedRefundBooking.refundPercentage || 0}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Refund Status</span>
                  <span className="font-bold text-slate-850 uppercase">{selectedRefundBooking.refundStatus}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Expected Payout Date</span>
                  <span className="font-bold text-slate-800">
                    {selectedRefundBooking.expectedRefundDate ? new Date(selectedRefundBooking.expectedRefundDate).toLocaleDateString() : "Immediate"}
                  </span>
                </div>
                {selectedRefundBooking.walletTransactionId && (
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 block uppercase">Wallet Transaction ID</span>
                    <span className="font-mono font-bold text-indigo-600">{selectedRefundBooking.walletTransactionId}</span>
                  </div>
                )}
                {selectedRefundBooking.ownerRemark && (
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 block uppercase">Owner Remark</span>
                    <span className="font-medium text-slate-700 italic">"{selectedRefundBooking.ownerRemark}"</span>
                  </div>
                )}
                {selectedRefundBooking.authorityRemark && (
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 block uppercase">Authority Remark</span>
                    <span className="font-medium text-slate-700 italic">"{selectedRefundBooking.authorityRemark}"</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedRefundBooking(null)}
              className="w-full text-center py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Timeline Overlay */}
      {selectedTimelineBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-slate-800">Refund Status Timeline</h3>
              <button onClick={() => setSelectedTimelineBooking(null)} className="text-slate-400 hover:text-slate-600 font-extrabold cursor-pointer">✕</button>
            </div>
            <div className="relative border-l-2 border-blue-100 ml-4 py-1 space-y-5 text-xs text-slate-700">
              <div className="relative pl-6">
                <span className="absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white shadow" />
                <p className="font-bold text-slate-800">Booking Confirmed</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Paid: ₹{selectedTimelineBooking.totalAmount}</p>
              </div>
              <div className="relative pl-6">
                <span className="absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white shadow" />
                <p className="font-bold text-slate-800">Cancellation Requested</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Reason: "{selectedTimelineBooking.cancellationReason}"</p>
              </div>
              <div className="relative pl-6">
                <span className={`absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow ${["VERIFIED", "APPROVED", "PROCESSING", "COMPLETED"].includes(selectedTimelineBooking.refundStatus) ? "bg-green-500" : "bg-slate-200"
                  }`} />
                <p className="font-bold text-slate-800">Authority Verified</p>
                {selectedTimelineBooking.authorityRemark && (
                  <p className="text-[10px] text-slate-400 mt-0.5">Remark: "{selectedTimelineBooking.authorityRemark}"</p>
                )}
              </div>
              <div className="relative pl-6">
                <span className={`absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow ${["APPROVED", "PROCESSING", "COMPLETED"].includes(selectedTimelineBooking.refundStatus) ? "bg-green-500" : "bg-slate-200"
                  }`} />
                <p className="font-bold text-slate-800">Admin Approved</p>
              </div>
              <div className="relative pl-6">
                <span className={`absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow ${["PROCESSING", "COMPLETED"].includes(selectedTimelineBooking.refundStatus) ? "bg-green-500" : "bg-slate-200"
                  }`} />
                <p className="font-bold text-slate-800">Processing Payout</p>
              </div>
              <div className="relative pl-6">
                <span className={`absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow ${selectedTimelineBooking.refundStatus === "COMPLETED" ? "bg-green-500" : "bg-slate-200"
                  }`} />
                <p className="font-bold text-slate-800">Completed & Credited</p>
                {selectedTimelineBooking.walletTransactionId && (
                  <p className="text-[10px] font-mono text-blue-650 mt-0.5">TXID: {selectedTimelineBooking.walletTransactionId}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedTimelineBooking(null)}
              className="w-full text-center py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
