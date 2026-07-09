interface Props {
  boats: any[];
}

export default function StaffBoatStatus({ boats }: Props) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-blue-50/50 flex flex-col h-full">
      <h3 className="mb-5 text-xl font-bold text-slate-800">
        Boat Status
      </h3>

      <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px]">
        {boats && boats.length > 0 ? (
          boats.map((boat) => (
            <div
              key={boat._id}
              className="flex justify-between items-center rounded-2xl border border-slate-100 p-4 hover:border-blue-100 hover:bg-blue-50/5 transition-all"
            >
              <div>
                <h4 className="font-bold text-slate-900">{boat.boatName}</h4>
                <p className="text-xs text-slate-400 mt-0.5">No: {boat.boatNumber} | Cap: {boat.capacity}</p>
              </div>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  boat.isAvailable
                    ? "bg-green-50 text-green-700"
                    : "bg-orange-50 text-orange-600"
                }`}
              >
                {boat.isAvailable ? "Available" : "Maintenance"}
              </span>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <p className="text-sm font-semibold">No boats found.</p>
          </div>
        )}
      </div>
    </div>
  );
}