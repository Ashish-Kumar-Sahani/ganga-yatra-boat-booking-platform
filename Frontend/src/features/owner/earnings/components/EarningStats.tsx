import {
  IndianRupee,
  Wallet,
  TrendingUp,
  CalendarDays,
  Percent,
  XCircle,
  RotateCcw,
  Sparkles,
  Ship,
  Route,
  CreditCard,
} from "lucide-react";

type Props = {
  revenue: any;
  topBoats: any[];
  routes: any[];
};

const money = (value?: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function EarningStats({ revenue, topBoats = [], routes = [] }: Props) {
  const cards = [
    {
      title: "Today's Revenue",
      value: money(revenue?.todayRevenue),
      icon: Wallet,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Yesterday's Revenue",
      value: money(revenue?.yesterdayRevenue),
      icon: Wallet,
      color: "text-slate-600 bg-slate-100",
    },
    {
      title: "This Week's Revenue",
      value: money(revenue?.weeklyRevenue),
      icon: TrendingUp,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Last Week's Revenue",
      value: money(revenue?.lastWeekRevenue),
      icon: TrendingUp,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      title: "This Month's Revenue",
      value: money(revenue?.thisMonthRevenue),
      icon: CalendarDays,
      color: "text-amber-600 bg-amber-50",
    },
    {
      title: "Previous Month's Revenue",
      value: money(revenue?.prevMonthRevenue),
      icon: CalendarDays,
      color: "text-orange-600 bg-orange-50",
    },
    {
      title: "Current Year's Revenue",
      value: money(revenue?.yearlyRevenue),
      icon: Sparkles,
      color: "text-rose-600 bg-rose-50",
    },
    {
      title: "Lifetime Revenue",
      value: money(revenue?.lifetimeRevenue),
      icon: IndianRupee,
      color: "text-green-600 bg-green-50",
    },
    {
      title: "Gross Revenue",
      value: money(revenue?.grossRevenue),
      icon: CreditCard,
      color: "text-cyan-600 bg-cyan-50",
    },
    {
      title: "Net Revenue",
      value: money(revenue?.netRevenue),
      icon: IndianRupee,
      color: "text-teal-600 bg-teal-50",
    },
    {
      title: "Total Refund Amount",
      value: money(revenue?.refundAmount),
      icon: RotateCcw,
      color: "text-red-600 bg-red-50",
    },
    {
      title: "Total Cancelled Amount",
      value: money(revenue?.cancelledAmount),
      icon: XCircle,
      color: "text-pink-600 bg-pink-50",
    },
    {
      title: "Average Ticket Size",
      value: money(revenue?.averageTicketSize),
      icon: Percent,
      color: "text-violet-600 bg-violet-50",
    },
    {
      title: "Total Paid Bookings",
      value: revenue?.bookingCount ?? 0,
      icon: CalendarDays,
      color: "text-lime-600 bg-lime-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Revenue Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow transition-all duration-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500">{card.title}</p>
                  <h3 className="mt-2 text-xl font-black text-slate-900">{card.value}</h3>
                </div>
                <div className={`rounded-xl p-3 shrink-0 ${card.color}`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Split Channels */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <h3 className="text-base font-black text-slate-800 mb-4">Revenue Split Channels</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center rounded-xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-sm font-semibold text-slate-500">Online Revenue</span>
              <span className="font-bold text-green-600">{money(revenue?.onlineRevenue)}</span>
            </div>
            <div className="flex justify-between items-center rounded-xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-sm font-semibold text-slate-500">Offline Revenue</span>
              <span className="font-bold text-blue-600">{money(revenue?.offlineRevenue)}</span>
            </div>
          </div>
        </div>

        {/* performance metrics */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-slate-800 mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-violet-50/50 p-4 border border-violet-100 text-center">
                <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide">Avg Ticket Size</p>
                <p className="text-xl font-black text-violet-900 mt-2">{money(revenue?.averageTicketSize)}</p>
              </div>
              <div className="rounded-xl bg-emerald-50/50 p-4 border border-emerald-100 text-center">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Completed Trips</p>
                <p className="text-xl font-black text-emerald-900 mt-2">{revenue?.completedTrips ?? 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Boats & Top Routes */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Boats */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
            <Ship size={18} className="text-blue-600" /> Top Performing Boats
          </h3>
          {topBoats.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400 font-semibold">No boat revenue data found.</div>
          ) : (
            <div className="divide-y">
              {topBoats.map((boat: any, idx: number) => (
                <div key={boat._id || idx} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-bold text-slate-800">{boat.boatName}</p>
                    <p className="text-xs text-slate-500 font-semibold">{boat.boatNumber} • {boat.bookings} trips</p>
                  </div>
                  <span className="font-black text-slate-900">{money(boat.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Routes */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
            <Route size={18} className="text-indigo-600" /> Top Route Collections
          </h3>
          {routes.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400 font-semibold">No route revenue data found.</div>
          ) : (
            <div className="divide-y">
              {routes.map((route: any, idx: number) => (
                <div key={route._id || idx} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-bold text-slate-800">{route.routeName}</p>
                    <p className="text-xs text-slate-500 font-semibold">{route.bookings} Bookings</p>
                  </div>
                  <span className="font-black text-slate-900">{money(route.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}