import { useEffect, useState } from "react";
import { CreditCard, IndianRupee, Search, ShieldCheck, Calendar, Info, X } from "lucide-react";
import { useAdminPaymentsStore } from "../store/paymentsStore";

export default function AdminPayments() {
  const { summary, transactions, pagination, loading, fetchPayments } = useAdminPaymentsStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  const loadData = (page = currentPage) => {
    fetchPayments({
      search: searchTerm,
      method: methodFilter,
      status: statusFilter,
      page,
      limit: 10,
    });
  };

  useEffect(() => {
    loadData(1);
    setCurrentPage(1);
  }, [methodFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData(1);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadData(page);
  };

  const totalVolume = summary?.totalRevenue || 0;
  const totalCount = summary?.successfulTransactions || 0;
  const methods = summary?.methodSplits || { ONLINE: 0, OFFLINE: 0, EMERGENCY: 0 };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-950">Payments & Transactions</h1>
          <p className="text-sm text-slate-500 mt-1">Audit all payment receipts, refunds, gateways logs, and cash splits.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid gap-5 sm:grid-cols-4">
        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow border border-slate-100">
          <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Gross Revenue</p>
            <h3 className="text-xl font-extrabold text-blue-950 mt-0.5">₹{totalVolume.toLocaleString("en-IN")}</h3>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow border border-slate-100">
          <div className="h-12 w-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Successful</p>
            <h3 className="text-xl font-extrabold text-blue-950 mt-0.5">{totalCount} txs</h3>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow border border-slate-100">
          <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Online Splits</p>
            <h3 className="text-xl font-extrabold text-blue-950 mt-0.5">₹{methods.ONLINE.toLocaleString("en-IN")}</h3>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow border border-slate-100">
          <div className="h-12 w-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Offline Splits</p>
            <h3 className="text-xl font-extrabold text-blue-950 mt-0.5">₹{methods.OFFLINE.toLocaleString("en-IN")}</h3>
          </div>
        </div>
      </div>

      {/* Filters Form */}
      <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow border border-slate-100 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3 rounded-xl border px-3 py-2.5 bg-slate-50 flex-1 lg:max-w-xs focus-within:border-blue-500 transition">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search transaction ID, passenger..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="rounded-xl border px-4 py-2.5 text-sm bg-slate-50 focus:border-blue-500 outline-none cursor-pointer"
          >
            <option value="">All Payment Types</option>
            <option value="ONLINE">ONLINE (Gateways)</option>
            <option value="OFFLINE">OFFLINE (Cash)</option>
            <option value="EMERGENCY">EMERGENCY</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border px-4 py-2.5 text-sm bg-slate-50 focus:border-blue-500 outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="PAID">PAID</option>
            <option value="PENDING">PENDING</option>
            <option value="REFUNDED">REFUNDED</option>
            <option value="REFUND_PENDING">Refund Pending</option>
            <option value="REFUND_VERIFIED">Refund Verified</option>
            <option value="REFUND_APPROVED">Refund Approved</option>
            <option value="REFUND_PROCESSING">Refund Processing</option>
            <option value="REFUND_COMPLETED">Refund Completed</option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-blue-700 shadow transition cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </form>

      {/* Transactions Table */}
      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50/80 text-blue-950 font-semibold border-b">
              <tr>
                <th className="p-4">Transaction ID / Ref</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Fares</th>
                <th className="p-4">Method</th>
                <th className="p-4">Status</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4 text-center">Invoice</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-4 w-32 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-28 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-16 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-20 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-6 w-16 bg-slate-200 rounded-full"></div></td>
                    <td className="p-4"><div className="h-4 w-36 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-8 w-10 bg-slate-200 rounded mx-auto"></div></td>
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500 font-medium">
                    No transactions found matching filters.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <div className="font-semibold text-blue-950 truncate max-w-[150px]" title={tx.razorpayPaymentId || tx._id}>
                        {tx.razorpayPaymentId || tx._id}
                      </div>
                      <div className="text-[10px] text-slate-400">Order: {tx.razorpayOrderId || "—"}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-700">{tx.customerId?.name || tx.passengerName}</div>
                      <div className="text-xs text-slate-400">{tx.customerId?.email || "—"}</div>
                    </td>
                    <td className="p-4 font-bold text-blue-950">₹{tx.totalAmount}</td>
                    <td className="p-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800">
                        {tx.bookingType}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
                        tx.paymentStatus === "PAID"
                          ? "bg-green-50 text-green-700"
                          : tx.paymentStatus === "PENDING"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-red-50 text-red-700"
                      }`}>
                        {tx.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} /> {new Date(tx.createdAt).toLocaleString("en-IN")}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                        title="Invoice Details"
                      >
                        <Info size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && transactions.length > 0 && (
          <div className="flex items-center justify-between border-t p-4 text-xs font-semibold text-slate-500">
            <p>
              Showing Page <b>{pagination.page}</b> of <b>{pagination.pages}</b> (Total: <b>{pagination.total}</b> Transactions)
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

      {/* Invoice Details Dialog */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 border flex flex-col">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-blue-950">Invoice Details</h3>
              <button onClick={() => setSelectedTx(null)} className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 flex-1 text-sm text-slate-700">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Transaction ID</span>
                <span className="font-mono text-xs font-bold truncate max-w-[200px]" title={selectedTx._id}>{selectedTx._id}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Passenger / Customer</span>
                <span className="font-semibold">{selectedTx.passengerName || selectedTx.customerId?.name}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Base Fare (Seats x Base)</span>
                <span className="font-semibold">₹{selectedTx.basePrice || selectedTx.totalAmount}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Gateway Fees</span>
                <span className="font-semibold text-green-600">Included</span>
              </div>

              <div className="flex justify-between border-b pb-2 font-bold text-lg text-blue-950 pt-2">
                <span>Total Fares Collected</span>
                <span>₹{selectedTx.totalAmount}</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t mt-5">
              <button
                onClick={() => setSelectedTx(null)}
                className="rounded-xl border px-5 py-2 text-sm font-semibold hover:bg-slate-50 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
