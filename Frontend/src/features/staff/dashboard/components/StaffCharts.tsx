interface Props {
  analytics: Array<{ date: string; bookings: number }>;
}

export default function StaffCharts({ analytics }: Props) {
  const maxBookings = Math.max(...analytics.map((item) => item.bookings), 1);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-blue-50/50">
      <h3 className="mb-6 text-xl font-bold text-slate-800">
        Weekly Booking Analytics
      </h3>

      <div className="flex h-[300px] items-end justify-between gap-3 md:gap-4 px-2">
        {analytics.map((item, index) => {
          const heightPx = Math.max((item.bookings / maxBookings) * 230, 8);

          return (
            <div key={index} className="flex flex-1 flex-col items-center group">
              <div className="relative w-full flex justify-center">
                <div className="absolute bottom-full mb-2 hidden group-hover:block rounded bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-white whitespace-nowrap shadow-md z-10">
                  {item.bookings} Bookings
                </div>
                <div
                  style={{ height: `${heightPx}px` }}
                  className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-500 ease-out hover:from-blue-700 hover:to-blue-500 shadow-sm"
                />
              </div>

              <span className="mt-3 text-xs font-semibold text-slate-400">
                {item.date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}