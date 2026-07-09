import { Headphones, ShieldCheck, UserCheck, BadgeCheck } from "lucide-react";

const items = [
  {
    title: "Safe & Secure",
    text: "Your safety is our priority",
    icon: ShieldCheck,
    color: "green",
  },
  {
    title: "Verified Boats",
    text: "All boats are verified",
    icon: BadgeCheck,
    color: "blue",
  },
  {
    title: "Expert Guides",
    text: "Trained & experienced",
    icon: UserCheck,
    color: "purple",
  },
  {
    title: "24/7 Support",
    text: "We are always here",
    icon: Headphones,
    color: "green",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-lg font-black text-blue-950">
        Why Choose GangaYatra?
      </h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                item.color === "green"
                  ? "bg-green-50 text-green-700"
                  : item.color === "blue"
                  ? "bg-blue-50 text-blue-700"
                  : "bg-purple-50 text-purple-700"
              }`}
            >
              <item.icon size={24} />
            </div>

            <div>
              <h3 className="font-black text-blue-950">{item.title}</h3>
              <p className="text-xs font-medium text-slate-500">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}