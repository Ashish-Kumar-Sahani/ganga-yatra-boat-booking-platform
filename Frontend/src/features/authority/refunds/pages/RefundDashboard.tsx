import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  XCircle, 
  Search, 
  Eye, 
  Clock, 
  FileText, 
  AlertTriangle,
  RefreshCw,
  TrendingDown,
  FileSpreadsheet
} from "lucide-react";
import { 
  getPendingRefunds, 
  approveRefund, 
  rejectRefund, 
  getRefundLogs 
} from "../api/refundsApi";

export default function RefundDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"pending" | "logs">("pending");
  const [pendingList, setPendingList] = useState<any[]>([]);
  const [logsList, setLogsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Timeline & Receipt modal state
  const [timelineBooking, setTimelineBooking] = useState<any | null>(null);
  const [receiptBooking, setReceiptBooking] = useState<any | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "pending") {
        const res = await getPendingRefunds();
        setPendingList(res.refunds || []);
      } else {
        const res = await getRefundLogs();
        setLogsList(res.logs || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load refund requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleApprove = async (id: string, totalAmount: number) => {
    const ok = window.confirm(`CONFIRMATION REQUIRED:\n\nAre you sure you want to verify and recommend this refund request for final approval?`);
    if (!ok) return;

    try {
      setLoading(true);
      await approveRefund(id, { refundAmount: totalAmount, remark: "Verified by City Authority L1" });
      alert("Refund verified and forwarded for final approval!");
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Verification failed");
      setLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt("REJECTION REMARK:\n\nEnter the reason for rejecting this refund request:");
    if (reason === null) return;
    if (!reason.trim()) {
      alert("A reason is required to reject a refund.");
      return;
    }

    try {
      setLoading(true);
      await rejectRefund(id, { reason });
      alert("Refund request rejected successfully.");
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Rejection failed");
      setLoading(false);
    }
  };

  const handlePartialRefund = async (id: string, maxAmount: number) => {
    const amountStr = window.prompt(`PARTIAL REFUND:\n\nEnter refund amount (Max ₹${maxAmount}):`);
    if (amountStr === null) return;
    const amount = Number(amountStr);
    if (isNaN(amount) || amount <= 0 || amount > maxAmount) {
      alert(`Invalid amount. Please enter a value between 1 and ${maxAmount}`);
      return;
    }

    const remark = window.prompt("Enter remark for partial refund:", `Partial refund of ₹${amount} approved by City Authority`);
    if (remark === null) return;

    try {
      setLoading(true);
      await approveRefund(id, { refundAmount: amount, remark: remark || undefined });
      alert("Partial refund processed successfully.");
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Partial refund failed");
      setLoading(false);
    }
  };

  const handleAddRemark = async (id: string) => {
    const remark = window.prompt("Enter remark/notes for this request:");
    if (remark === null) return;
    try {
      setLoading(true);
      // We can update the remark by sending a partial approve call without status change or just updating notes
      await approveRefund(id, { remark });
      alert("Remark updated successfully");
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add remark");
      setLoading(false);
    }
  };

  const getPriority = (expectedDate: string) => {
    if (!expectedDate) return { text: "MEDIUM", color: "bg-yellow-50 text-yellow-700" };
    const diff = new Date(expectedDate).getTime() - Date.now();
    const days = diff / (1000 * 3600 * 24);
    if (days < 3) return { text: "HIGH", color: "bg-red-50 text-red-700 font-extrabold" };
    if (days < 5) return { text: "MEDIUM", color: "bg-yellow-50 text-yellow-700" };
    return { text: "LOW", color: "bg-green-50 text-green-700" };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border border-amber-205";
      case "UNDER_REVIEW":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "VERIFIED":
        return "bg-indigo-50 text-indigo-700 border border-indigo-200";
      case "APPROVED":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "PROCESSING":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      case "COMPLETED":
        return "bg-green-50 text-green-700 border border-green-200";
      case "FAILED":
      case "REJECTED":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200";
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === "PENDING") return "Refund Requested";
    if (status === "UNDER_REVIEW") return "Under Review";
    if (status === "VERIFIED") return "Verified (L1)";
    if (status === "APPROVED") return "Approved (L2)";
    if (status === "PROCESSING") return "Processing";
    if (status === "COMPLETED") return "Completed";
    if (status === "FAILED") return "Failed";
    if (status === "REJECTED") return "Rejected";
    return status;
  };

  const activeList = activeTab === "pending" ? pendingList : logsList;

  const filteredList = activeList.filter((item) => {
    const customer = item.customerId?.name || "Customer";
    const owner = item.slotId?.scheduleId?.boatId?.ownerId?.name || "Owner";
    const boat = item.slotId?.scheduleId?.boatId?.boatName || "Boat";
    const code = item.bookingCode || item._id || "";
    
    const matchesSearch = 
      customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? item.refundStatus === statusFilter : true;

    const prio = getPriority(item.expectedRefundDate).text;
    const matchesPriority = priorityFilter ? prio === priorityFilter : true;

    const matchesDate = dateFilter 
      ? new Date(item.cancellationRequestedAt || item.createdAt).toLocaleDateString() === new Date(dateFilter).toLocaleDateString() 
      : true;

    return matchesSearch && matchesStatus && matchesPriority && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Gov Portal Header Banner */}
      <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 opacity-10 pointer-events-none">
          <FileText size={280} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-blue-600/35 border border-blue-500/50 text-blue-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              Government Control Panel
            </span>
            <h1 className="mt-2 text-2xl md:text-3xl font-black tracking-tight">
              Refund & Payout Approvals
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Authority ledger to verify refund requests, adjust percentages, approve transactions, and trace government timelines.
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-750 px-4 py-2.5 text-xs font-bold text-white transition self-start md:self-center cursor-pointer shadow-lg"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Approvals
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-6 py-3 font-bold text-xs uppercase border-b-2 tracking-wide transition-all cursor-pointer ${
            activeTab === "pending"
              ? "border-blue-600 text-blue-700"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Pending Authority Review ({pendingList.length})
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`px-6 py-3 font-bold text-xs uppercase border-b-2 tracking-wide transition-all cursor-pointer ${
            activeTab === "logs"
              ? "border-blue-600 text-blue-700"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Processed Payout Logs ({logsList.length})
        </button>
      </div>

      {/* Filters Form */}
      <div className="grid gap-4 rounded-2xl bg-white p-4 shadow border border-slate-100/60 md:grid-cols-4">
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2.5 bg-slate-50/50">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search booking code, customer, boat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs outline-none w-full placeholder:text-slate-400"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 bg-slate-50/50 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="">All Refund Statuses</option>
            <option value="PENDING">Refund Requested</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 bg-slate-50/50 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>

        <div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 bg-slate-50/50 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-xs text-red-700 border border-red-200 flex items-center justify-between">
          <span className="flex items-center gap-1.5"><AlertTriangle size={14} /> <b>Failure:</b> {error}</span>
          <button onClick={loadData} className="font-extrabold underline text-red-800">Retry</button>
        </div>
      )}

      {/* Approvals Table */}
      <div className="overflow-hidden rounded-3xl bg-white shadow border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b">
              <tr>
                <th className="p-4 uppercase tracking-wider">Booking ID</th>
                <th className="p-4 uppercase tracking-wider">Customer</th>
                <th className="p-4 uppercase tracking-wider">Owner</th>
                <th className="p-4 uppercase tracking-wider">Boat</th>
                <th className="p-4 uppercase tracking-wider">Paid Amount</th>
                <th className="p-4 uppercase tracking-wider">Eligible Refund</th>
                <th className="p-4 uppercase tracking-wider">Refund %</th>
                <th className="p-4 uppercase tracking-wider">Refund Amount</th>
                <th className="p-4 uppercase tracking-wider">Reason</th>
                <th className="p-4 uppercase tracking-wider">Requested Date</th>
                <th className="p-4 uppercase tracking-wider">Priority</th>
                <th className="p-4 uppercase tracking-wider">Status</th>
                <th className="p-4 text-center uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && filteredList.length === 0 ? (
                <tr>
                  <td colSpan={13} className="p-12 text-center text-slate-500 font-medium">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mx-auto"></div>
                    <p className="mt-2 text-slate-400">Loading ledger data...</p>
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={13} className="p-16 text-center text-slate-500 font-medium">
                    <FileText size={36} className="mx-auto text-slate-300 mb-2" />
                    No refund bookings found in this ledger tab.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const customer = item.customerId?.name || "Customer";
                  const owner = item.slotId?.scheduleId?.boatId?.ownerId?.name || "Owner";
                  const boat = item.slotId?.scheduleId?.boatId?.boatName || "Boat";
                  const expected = item.expectedRefundDate;
                  const priority = getPriority(expected);

                  return (
                    <tr key={item._id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-700">{item.bookingCode || item._id}</td>
                      <td className="p-4">{customer}</td>
                      <td className="p-4">{owner}</td>
                      <td className="p-4">{boat}</td>
                      <td className="p-4 font-semibold text-slate-900">₹{item.totalAmount}</td>
                      <td className="p-4 font-semibold text-blue-900">₹{item.refundAmount}</td>
                      <td className="p-4 font-semibold text-slate-600">{item.refundPercentage || 0}%</td>
                      <td className="p-4 font-black text-blue-600">₹{item.refundAmount}</td>
                      <td className="p-4 italic max-w-xs truncate" title={item.cancellationReason || item.refundReason}>
                        "{item.cancellationReason || item.refundReason || "No reason specified"}"
                      </td>
                      <td className="p-4 font-medium text-slate-500">
                        {item.cancellationRequestedAt ? new Date(item.cancellationRequestedAt).toLocaleDateString() : new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${priority.color}`}>
                          {priority.text}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${getStatusBadge(item.refundStatus)}`}>
                          {getStatusLabel(item.refundStatus)}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => navigate(`/authority/refunds/${item._id}`)}
                            title="View Details"
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition"
                          >
                            <Eye size={13} />
                          </button>

                          {item.refundStatus === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleApprove(item._id, item.refundAmount)}
                                title="Approve 100%"
                                className="p-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg cursor-pointer transition border border-green-200"
                              >
                                <CheckCircle size={13} />
                              </button>
                              <button
                                onClick={() => handlePartialRefund(item._id, item.totalAmount)}
                                title="Partial Refund"
                                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg cursor-pointer transition border border-blue-200"
                              >
                                <TrendingDown size={13} />
                              </button>
                              <button
                                onClick={() => handleReject(item._id)}
                                title="Reject Request"
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg cursor-pointer transition border border-red-200"
                              >
                                <XCircle size={13} />
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => handleAddRemark(item._id)}
                            title="Add Remark"
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition"
                          >
                            📝
                          </button>

                          <button
                            onClick={() => setTimelineBooking(item)}
                            title="View Timeline"
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition"
                          >
                            <Clock size={13} />
                          </button>

                          {item.refundStatus === "COMPLETED" && (
                            <button
                              onClick={() => setReceiptBooking(item)}
                              title="Generate Receipt"
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition"
                            >
                              <FileSpreadsheet size={13} />
                            </button>
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
      </div>

      {/* Visual Timeline Stepper Modal */}
      {timelineBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-slate-800">Refund Progress Timeline</h3>
              <button onClick={() => setTimelineBooking(null)} className="text-slate-400 hover:text-slate-600 font-extrabold cursor-pointer">✕</button>
            </div>
            
            <div className="relative border-l-2 border-blue-100 ml-4 py-1 space-y-5 text-xs">
              <div className="relative pl-6">
                <span className="absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white shadow" />
                <p className="font-bold text-slate-800">Booking Created</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{new Date(timelineBooking.createdAt).toLocaleString()}</p>
              </div>

              <div className="relative pl-6">
                <span className="absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white shadow" />
                <p className="font-bold text-slate-800">Payment Success</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Fares Paid: ₹{timelineBooking.totalAmount}</p>
              </div>

              <div className="relative pl-6">
                <span className="absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white shadow" />
                <p className="font-bold text-slate-800">Confirmed</p>
              </div>

              <div className="relative pl-6">
                <span className={`absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow ${
                  timelineBooking.cancellationRequestedAt ? "bg-green-500" : "bg-slate-200"
                }`} />
                <p className="font-bold text-slate-800">Cancellation Requested</p>
                {timelineBooking.cancellationRequestedAt && (
                  <p className="text-[10px] text-slate-400 mt-0.5">Reason: "{timelineBooking.cancellationReason}" at {new Date(timelineBooking.cancellationRequestedAt).toLocaleString()}</p>
                )}
              </div>

              <div className="relative pl-6">
                <span className={`absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow ${
                  timelineBooking.ownerRespondedAt ? "bg-green-500" : timelineBooking.refundStatus === "REJECTED" ? "bg-red-500" : "bg-slate-200"
                }`} />
                <p className="font-bold text-slate-800">Owner Response</p>
                {timelineBooking.ownerRespondedAt && (
                  <p className="text-[10px] text-slate-400 mt-0.5">Remark: "{timelineBooking.ownerRemark}" at {new Date(timelineBooking.ownerRespondedAt).toLocaleString()}</p>
                )}
              </div>

              <div className="relative pl-6">
                <span className={`absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow ${
                  timelineBooking.refundStatus === "COMPLETED" ? "bg-green-500" : timelineBooking.refundStatus === "FAILED" ? "bg-red-500" : timelineBooking.refundStatus === "UNDER_REVIEW" ? "bg-blue-500" : "bg-slate-200"
                }`} />
                <p className="font-bold text-slate-800">Authority Review</p>
                {timelineBooking.authorityRemark && (
                  <p className="text-[10px] text-slate-400 mt-0.5">Remark: "{timelineBooking.authorityRemark}"</p>
                )}
              </div>

              <div className="relative pl-6">
                <span className={`absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow ${
                  timelineBooking.refundStatus === "COMPLETED" ? "bg-green-500" : "bg-slate-200"
                }`} />
                <p className="font-bold text-slate-800">Refund Approved & Wallet Credited</p>
                {timelineBooking.refundStatus === "COMPLETED" && (
                  <>
                    <p className="text-[10px] text-slate-400 mt-0.5">Amount: ₹{timelineBooking.refundAmount} ({timelineBooking.refundPercentage}%)</p>
                    {timelineBooking.walletTransactionId && (
                      <p className="text-[9px] text-blue-600 font-extrabold mt-0.5">TXID: {timelineBooking.walletTransactionId}</p>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <button
              onClick={() => setTimelineBooking(null)}
              className="w-full text-center py-2.5 rounded-xl bg-slate-100 hover:bg-slate-250 text-xs font-bold text-slate-700 cursor-pointer"
            >
              Close Timeline
            </button>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {receiptBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-slate-800">Government Payout Receipt</h3>
              <button onClick={() => setReceiptBooking(null)} className="text-slate-400 hover:text-slate-600 font-extrabold cursor-pointer">✕</button>
            </div>
            
            <div className="border border-dashed border-slate-200 p-5 rounded-2xl space-y-4 text-xs font-medium text-slate-700 bg-slate-50/50">
              <div className="text-center space-y-1">
                <p className="font-black text-slate-900 uppercase tracking-widest text-sm">GangaYatra Platform</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Official Refund Payout Memorandum</p>
              </div>
              
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 border-t border-b border-slate-100 py-3 mt-4">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Booking Code</span>
                  <span className="font-bold text-slate-800">{receiptBooking.bookingCode || receiptBooking._id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Transaction ID</span>
                  <span className="font-mono text-slate-800">{receiptBooking.walletTransactionId || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Customer</span>
                  <span className="font-bold text-slate-800">{receiptBooking.customerId?.name || "Customer"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Processed On</span>
                  <span className="font-bold text-slate-800">
                    {receiptBooking.refundProcessedAt ? new Date(receiptBooking.refundProcessedAt).toLocaleString() : "N/A"}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <span>Fare Paid:</span>
                  <span className="font-bold">₹{receiptBooking.totalAmount}</span>
                </div>
                <div className="flex justify-between text-blue-650 font-bold">
                  <span>Refund Percentage:</span>
                  <span>{receiptBooking.refundPercentage}%</span>
                </div>
                <div className="flex justify-between border-t border-dashed pt-2 font-black text-sm text-slate-900">
                  <span>Total Amount Refunded:</span>
                  <span className="text-blue-600">₹{receiptBooking.refundAmount}</span>
                </div>
              </div>
              
              <div className="border-t pt-3 text-[10px] text-slate-450 space-y-1">
                <p>• <b>Refund Policy:</b> {receiptBooking.refundPercentage === 100 ? "Full Fare Payout" : "Partial Payout - Window Rules"}</p>
                <p>• <b>Authority Notes:</b> "{receiptBooking.authorityRemark || "Refund approved by Authority"}"</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white cursor-pointer transition shadow"
              >
                Print Receipt
              </button>
              <button
                onClick={() => setReceiptBooking(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
