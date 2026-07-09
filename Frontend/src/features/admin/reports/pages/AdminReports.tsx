import { useState } from "react";
import { FileText, Download, AlertCircle, RefreshCw } from "lucide-react";
import { useAdminBookingsStore } from "../../bookings/store/bookingsStore";
import { useAdminPaymentsStore } from "../../payments/store/paymentsStore";
import { useAdminBoatsStore } from "../../boats/store/boatsStore";
import { useAdminUsersStore } from "../../users/store/usersStore";

export default function AdminReports() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const fetchBookings = useAdminBookingsStore((state) => state.fetchBookings);
  const fetchPayments = useAdminPaymentsStore((state) => state.fetchPayments);
  const fetchBoats = useAdminBoatsStore((state) => state.fetchBoats);
  const fetchUsers = useAdminUsersStore((state) => state.fetchUsers);

  const triggerDownload = (filename: string, headers: string[], rows: string[][]) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = async (type: string) => {
    setDownloading(type);
    try {
      if (type === "bookings") {
        await fetchBookings({ limit: 1000 });
        const dataList = useAdminBookingsStore.getState().bookings;
        const headers = ["Booking ID", "Passenger Name", "Passenger Phone", "Seats", "Amount (INR)", "Date", "Status", "Payment"];
        const rows = dataList.map((b) => [
          b._id,
          b.passengerName || b.customerId?.name || "Customer",
          b.passengerPhone || b.customerId?.phone || "—",
          b.numberOfSeats,
          b.totalAmount,
          new Date(b.bookingDate).toLocaleDateString("en-IN"),
          b.bookingStatus,
          b.paymentStatus,
        ]);
        triggerDownload("bookings_report.csv", headers, rows);
      } else if (type === "payments") {
        await fetchPayments({ limit: 1000 });
        const dataList = useAdminPaymentsStore.getState().transactions;
        const headers = ["Transaction ID", "Customer Name", "Fares Collected (INR)", "Booking Type", "Payment Status", "Timestamp"];
        const rows = dataList.map((tx) => [
          tx.razorpayPaymentId || tx._id,
          tx.customerId?.name || tx.passengerName || "Customer",
          tx.totalAmount,
          tx.bookingType,
          tx.paymentStatus,
          new Date(tx.createdAt).toLocaleString("en-IN"),
        ]);
        triggerDownload("transactions_report.csv", headers, rows);
      } else if (type === "boats") {
        await fetchBoats();
        const dataList = useAdminBoatsStore.getState().boats;
        const headers = ["Boat Name", "Boat Number", "Owner", "Boat Type", "Capacity", "Base Price (INR)", "Status", "Availability"];
        const rows = dataList.map((boat) => [
          boat.boatName,
          boat.boatNumber,
          boat.ownerId?.name || "—",
          boat.boatType,
          boat.capacity,
          boat.basePrice,
          boat.status,
          boat.isAvailable ? "Available" : "Offline",
        ]);
        triggerDownload("boats_report.csv", headers, rows);
      } else if (type === "users") {
        await fetchUsers({ limit: 1000 });
        const dataList = useAdminUsersStore.getState().users;
        const headers = ["User ID", "Name", "Email", "Phone", "Role", "Status", "Registered Date"];
        const rows = dataList.map((user) => [
          user._id,
          user.name,
          user.email,
          user.phone || "—",
          user.role,
          user.isActive ? "Active" : "Inactive",
          new Date(user.createdAt).toLocaleDateString("en-IN"),
        ]);
        triggerDownload("users_report.csv", headers, rows);
      }
    } catch (err) {
      alert("Failed to generate report. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  const reportsList = [
    {
      id: "bookings",
      title: "Bookings Audit Log",
      description: "Includes details on travel dates, passenger specifications, ghat selections, and final status counts.",
      icon: FileText,
    },
    {
      id: "payments",
      title: "Transactions Ledgers",
      description: "Includes gateway transactions, cash order reports, invoice totals, tax records, and split-methods audits.",
      icon: FileText,
    },
    {
      id: "boats",
      title: "Fleet Specifications List",
      description: "Audit register of all registered manual/motor/luxury boats, passenger capacities, pricing, and license levels.",
      icon: FileText,
    },
    {
      id: "users",
      title: "User Directory & Access",
      description: "Master records of registered customers, owners, managers, staff levels, and activation audit logs.",
      icon: FileText,
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-950">Analytics & Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Generate and download localized datasets as standard CSV logs for reporting.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {reportsList.map((report) => {
          const Icon = report.icon;
          const isDownloading = downloading === report.id;

          return (
            <div key={report.id} className="rounded-2xl bg-white p-6 shadow border border-slate-100 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-blue-950">{report.title}</h3>
                </div>
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">{report.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t flex justify-end">
                <button
                  onClick={() => handleDownload(report.id)}
                  disabled={!!downloading}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-bold shadow flex items-center gap-2 transition disabled:opacity-50 cursor-pointer animate-pulse-slow"
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Download size={14} /> Download CSV
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 text-amber-800 text-xs leading-relaxed max-w-2xl">
        <AlertCircle size={20} className="shrink-0 text-amber-600" />
        <p>
          <b>Important Note:</b> Generating audit spreadsheets parses all localized DB collections on the server. Make sure you avoid running high-frequency batch reports during peak hours to preserve database performance.
        </p>
      </div>
    </div>
  );
}
