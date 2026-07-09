import { BadgePercent } from "lucide-react";

const offers = [
  {
    code: "EARLYBIRD15",
    text: "Get 15% off on early bookings",
    color: "green",
  },
  {
    code: "WEEKEND20",
    text: "Get 20% off on weekend rides",
    color: "orange",
  },
];

export default function SpecialOffersCard() {
  return (
    <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-black text-blue-950">Special Offers</h2>
        <button className="text-sm font-bold text-blue-700">View All</button>
      </div>

      <div className="space-y-4">
        {offers.map((offer) => (
          <div
            key={offer.code}
            className="flex items-center gap-4 border-b border-blue-50 pb-4 last:border-b-0 last:pb-0"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                offer.color === "green"
                  ? "bg-green-50 text-green-700"
                  : "bg-orange-50 text-orange-700"
              }`}
            >
              <BadgePercent size={24} />
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-black text-blue-700">{offer.code}</h3>
              <p className="text-xs font-semibold text-slate-600">
                {offer.text}
              </p>
              <p className="text-xs text-slate-500">Valid till 30 Jun 2025</p>
            </div>

            <button className="rounded-lg border border-blue-300 px-4 py-2 text-xs font-bold text-blue-700">
              Apply
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}