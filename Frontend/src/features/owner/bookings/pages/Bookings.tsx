import { useEffect, useState } from "react";
import BookingStats from "../components/BookingStats";
import BookingTable from "../components/BookingTable";
import { getOwnerBookings, getOwnerRefundRequests, ownerRespondCancellation } from "../api/bookingApi";
import type { Booking } from "../types/booking.types";
import { CheckCircle, XCircle } from "lucide-react";

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refundRequests, setRefundRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "cancellations">("all");

  // Modal State
  const [activeRequest, setActiveRequest] = useState<any | null>(null);
  const [approveMode, setApproveMode] = useState(true);
  const [ownerRemark, setOwnerRemark] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [emergencyType, setEmergencyType] = useState("OWNER");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getOwnerBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Owner bookings error:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRefundRequests = async () => {
    try {
      const data = await getOwnerRefundRequests();
      setRefundRequests(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load owner refund requests", e);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchRefundRequests();
  }, []);

  const handleOpenResponseModal = (req: any, approve: boolean) => {
    setActiveRequest(req);
    setApproveMode(approve);
    setOwnerRemark("");
    setIsEmergency(false);
    setEmergencyType("OWNER");
  };

  const handleResponseSubmit = async () => {
    if (!activeRequest) return;
    try {
      setLoading(true);
      await ownerRespondCancellation(activeRequest._id, {
        approve: approveMode,
        remark: ownerRemark,
        cancelledBy: approveMode && isEmergency ? emergencyType : undefined
      });
      alert(approveMode ? "Cancellation request approved" : "Cancellation request rejected");
      setActiveRequest(null);
      fetchBookings();
      fetchRefundRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || "Response submission failed");
    } finally {
      setLoading(false);
    }
  };

  const safeBookings = Array.isArray(bookings) ? bookings : [];

  return (
    <div className="space-y-6 p-5">
      <div>
        <h1 className="text-3xl font-bold text-blue-950">
          Bookings Manager
        </h1>
        <p className="text-slate-500">
          Audit customer schedules, configure check-in logs, and respond to cancellation requests.
        </p>
      </div>

      <BookingStats bookings={safeBookings} />

      {/* Owner Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-5 py-3 font-bold text-xs uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === "all"
              ? "border-blue-600 text-blue-650"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          All Active Bookings
        </button>
        <button
          onClick={() => setActiveTab("cancellations")}
          className={`px-5 py-3 font-bold text-xs uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === "cancellations"
              ? "border-blue-600 text-blue-650"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Cancellation Backlog ({refundRequests.length})
        </button>
      </div>

      {activeTab === "all" ? (
        loading ? (
          <div className="rounded-2xl bg-white p-6 text-center font-semibold border shadow">
            Loading bookings...
          </div>
        ) : (
          <BookingTable
            bookings={safeBookings}
            onRefresh={fetchBookings}
          />
        )
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Boat / Route</th>
                  <th className="p-4">Paid Amount</th>
                  <th className="p-4">Refund Percentage</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Timeline status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {refundRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-550 font-semibold">
                      No pending cancellation requests found.
                    </td>
                  </tr>
                ) : (
                  refundRequests.map((req) => {
                    const cust = req.customerId?.name || "Customer";
                    const email = req.customerId?.email || "";
                    const boat = req.slotId?.scheduleId?.boatId?.boatName || "Boat";
                    const src = req.slotId?.scheduleId?.routeId?.sourceGhatId?.name || "Source";
                    const dst = req.slotId?.scheduleId?.routeId?.destinationGhatId?.name || "Destination";
                    
                    return (
                      <tr key={req._id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-bold text-slate-700">{req.bookingCode || req._id}</td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-800">{cust}</div>
                          <div className="text-[10px] text-slate-400">{email}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-850">{boat}</div>
                          <div className="text-[10px] text-slate-450">{src} ➔ {dst}</div>
                        </td>
                        <td className="p-4 font-bold">₹{req.totalAmount}</td>
                        <td className="p-4 font-bold text-blue-600">{req.refundPercentage || 0}% Refund</td>
                        <td className="p-4 italic text-slate-500">"{req.cancellationReason || "No reason specified"}"</td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1 text-[10px] text-slate-400">
                            <div>• Booking Confirmed</div>
                            <div className="text-orange-600 font-bold">• Cancellation Requested</div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleOpenResponseModal(req, true)}
                              className="rounded-lg bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 font-bold transition flex items-center gap-1 cursor-pointer border border-green-200"
                            >
                              <CheckCircle size={12} /> Approve
                            </button>
                            <button
                              onClick={() => handleOpenResponseModal(req, false)}
                              className="rounded-lg bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 font-bold transition flex items-center gap-1 cursor-pointer border border-red-200"
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

      {/* Owner Response Dialog Modal */}
      {activeRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-slate-850">
                {approveMode ? "Approve Cancellation" : "Reject Cancellation"}
              </h3>
              <button onClick={() => setActiveRequest(null)} className="text-slate-400 hover:text-slate-600 font-extrabold cursor-pointer">✕</button>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p className="text-[10px] text-slate-400 block uppercase">Booking Reference</p>
                <p className="font-bold text-slate-800">{activeRequest.bookingCode || activeRequest._id}</p>
                <p className="text-[10px] text-slate-400 block uppercase mt-2">Customer Reason</p>
                <p className="font-medium text-slate-700 italic">"{activeRequest.cancellationReason || "No reason specified"}"</p>
              </div>

              {approveMode && (
                <div className="space-y-2 border-t pt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEmergency}
                      onChange={(e) => setIsEmergency(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Is this an Emergency Cancellation? (100% Refund)</span>
                  </label>
                  
                  {isEmergency && (
                    <div className="space-y-1 bg-blue-50/50 p-3 rounded-xl border border-blue-100 mt-2">
                      <span className="block text-[10px] text-slate-400 uppercase">Emergency Category</span>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {(["WEATHER", "BREAKDOWN", "OWNER"] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setEmergencyType(type)}
                            className={`py-2 rounded-lg border text-[10px] font-bold tracking-wider transition ${
                              emergencyType === type
                                ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {type === "WEATHER" && "Weather"}
                            {type === "BREAKDOWN" && "Breakdown"}
                            {type === "OWNER" && "Maintenance"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1 border-t pt-3">
                <label className="block text-slate-450 uppercase text-[10px]">Owner Remarks / Statement</label>
                <textarea
                  value={ownerRemark}
                  onChange={(e) => setOwnerRemark(e.target.value)}
                  placeholder="Enter notes or remarks for this response..."
                  rows={2}
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:border-blue-500 font-semibold"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleResponseSubmit}
                className={`flex-1 py-3 text-xs font-bold text-white rounded-xl shadow transition cursor-pointer ${
                  approveMode ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm {approveMode ? "Approval" : "Rejection"}
              </button>
              <button
                onClick={() => setActiveRequest(null)}
                className="flex-1 py-3 text-xs font-bold text-slate-750 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition text-center"
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