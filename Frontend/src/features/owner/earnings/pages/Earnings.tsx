import { useEffect, useState } from "react";
import EarningStats from "@/features/owner/earnings/components/EarningStats";
import RevenueChart from "@/features/owner/earnings/components/RevenueChart";
import OwnerEarningsChart from "@/features/owner/earnings/components/OwnerEarningsChart";
import { getOwnerReports } from "@/features/owner/dashboard/api/ownerApi";
import { RefreshCw, FileSpreadsheet, FileText, Calendar } from "lucide-react";

export default function Earnings() {
  const [reports, setReports] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string>(""); // Empty string means "All Months"

  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = { year: selectedYear };
      if (selectedMonth !== "") {
        params.month = Number(selectedMonth);
      }
      const data = await getOwnerReports(params);
      setReports(data);
    } catch (err: any) {
      console.error("Earnings fetch error:", err);
      setError("Failed to fetch reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [selectedYear, selectedMonth]);

  // Export functions
  const triggerDownload = (filename: string, content: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (!reports) return;
    const headers = ["Date", "Revenue (INR)", "Gross Revenue (INR)", "Refunds (INR)", "Bookings"];
    const rows = (reports.charts?.dailyRevenue || []).map((d: any) => [
      d.date,
      d.revenue,
      d.earnings, // gross collection representation
      d.refundAmount || 0,
      d.bookings,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r: any) => r.join(","))].join("\n");
    triggerDownload("owner_revenue_report.csv", csvContent, "text/csv;charset=utf-8;");
  };

  const handleExportExcel = () => {
    if (!reports) return;
    // Basic Excel-compatible XML format
    let excelXML = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`;
    excelXML += `<head><meta charset="UTF-8"></head><body><table>`;
    excelXML += `<tr><th colspan="5"><h2>Revenue Audit Log (${selectedMonth !== "" ? months[Number(selectedMonth)].label : "All Year"} ${selectedYear})</h2></th></tr>`;
    excelXML += `<tr><th>Date</th><th>Net Revenue</th><th>Gross Revenue</th><th>Refunds</th><th>Paid Bookings</th></tr>`;
    (reports.charts?.dailyRevenue || []).forEach((d: any) => {
      excelXML += `<tr><td>${d.date}</td><td>₹${d.revenue}</td><td>₹${d.earnings}</td><td>₹${d.refundAmount || 0}</td><td>${d.bookings}</td></tr>`;
    });
    excelXML += `</table></body></html>`;
    triggerDownload("owner_revenue_log.xls", excelXML, "application/vnd.ms-excel;");
  };

  const handleExportPDF = () => {
    if (!reports) return;
    // PDF text report summary
    const summary = `
=========================================
      BOAT BOOKING SYSTEM REVENUE REPORT
=========================================
Generated on: ${new Date().toLocaleDateString("en-IN")}
Period: ${selectedMonth !== "" ? months[Number(selectedMonth)].label : "All Year"} ${selectedYear}

-----------------------------------------
1. REVENUE SUMMARY
-----------------------------------------
- Total Revenue: ₹${reports.revenue?.totalRevenue.toLocaleString()}
- Gross Revenue: ₹${reports.revenue?.grossRevenue.toLocaleString()}
- Refund Amount: ₹${reports.revenue?.refundAmount.toLocaleString()}
- Cancelled Amount: ₹${reports.revenue?.cancelledAmount.toLocaleString()}
- Avg Ticket Size: ₹${reports.revenue?.averageTicketSize.toLocaleString()}
- Paid Bookings Count: ${reports.revenue?.bookingCount}
- Completed Trips: ${reports.revenue?.completedTrips}

-----------------------------------------
2. BOAT PERFORMANCE
-----------------------------------------
${(reports.topBoats || []).map((b: any, i: number) => `${i + 1}. ${b.boatName} (${b.boatNumber}) - Revenue: ₹${b.revenue.toLocaleString()} (${b.bookings} trips)`).join("\n")}

-----------------------------------------
3. ROUTE PERFORMANCE
-----------------------------------------
${(reports.routes || []).map((r: any, i: number) => `${i + 1}. ${r.routeName} - Revenue: ₹${r.revenue.toLocaleString()} (${r.bookings} bookings)`).join("\n")}

=========================================
`;
    triggerDownload("revenue_summary_report.txt", summary, "text/plain;charset=utf-8;");
  };

  return (
    <div className="space-y-6 p-5">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-blue-950">Earnings & Revenue</h1>
          <p className="text-slate-500 font-semibold text-sm">Centralized revenue calculation and platforms audits</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={fetchEarnings}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 transition active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>

          {/* Export Dropdown buttons */}
          <button
            onClick={handleExportCSV}
            disabled={loading || !reports}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 transition active:scale-95"
          >
            <FileSpreadsheet size={14} className="text-green-600" /> CSV
          </button>
          <button
            onClick={handleExportExcel}
            disabled={loading || !reports}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 transition active:scale-95"
          >
            <FileSpreadsheet size={14} className="text-emerald-600" /> Excel
          </button>
          <button
            onClick={handleExportPDF}
            disabled={loading || !reports}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 transition active:scale-95"
          >
            <FileText size={14} className="text-red-600" /> PDF Summary
          </button>
        </div>
      </div>

      {/* Date Selectors Row */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-slate-400" />
          <span className="text-sm font-bold text-slate-600">Filters:</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Year selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
          >
            {Array.from({ length: 5 }).map((_, idx) => {
              const year = currentYear - idx;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>

          {/* Month selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="">All Months (Yearly)</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading, Error and Display states */}
      {error && (
        <div className="rounded-2xl bg-red-50 p-4 border border-red-100 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-4">
          <RefreshCw size={36} className="animate-spin text-blue-600" />
          <p className="font-bold text-slate-500 text-sm">Compiling revenue analytics...</p>
        </div>
      ) : !reports ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-slate-100">
          <p className="font-bold text-slate-400">No revenue reports compiled.</p>
        </div>
      ) : (
        <>
          <EarningStats
            revenue={reports.revenue}
            topBoats={reports.topBoats}
            routes={reports.routes}
          />
          
          <RevenueChart
            dailyData={reports.charts?.dailyRevenue || []}
            monthlyData={reports.charts?.monthlyRevenue || []}
          />

          <OwnerEarningsChart
            dailyData={reports.charts?.dailyRevenue || []}
            paymentData={reports.charts?.paymentMethods || []}
            monthlyData={reports.charts?.monthlyRevenue || []}
          />
        </>
      )}
    </div>
  );
}