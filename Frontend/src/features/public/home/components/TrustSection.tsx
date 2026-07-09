import {
  UserCheck,
  ShieldCheck,
  CreditCard,
  Navigation,
  QrCode,
  Headphones,
} from "lucide-react";

const items = [
  {
    title: "Verified Boat Owners",
    description: "Every operator holds verified government registrations and safety clearances.",
    icon: <UserCheck size={26} />,
  },
  {
    title: "Government Approval Ready",
    description: "Built in compliance with local municipal and water authority guidelines.",
    icon: <ShieldCheck size={26} />,
  },
  {
    title: "Secure Booking",
    description: "Instant booking confirmation with secure payment gateway protection.",
    icon: <CreditCard size={26} />,
  },
  {
    title: "Live Tracking",
    description: "Real-time boat GPS coordinates sharing during the entire river journey.",
    icon: <Navigation size={26} />,
  },
  {
    title: "QR Ticket",
    description: "Digital check-in at ghats via scannable booking QR codes on mobile.",
    icon: <QrCode size={26} />,
  },
  {
    title: "24/7 Support",
    description: "Always available help desk support to guarantee passenger comfort.",
    icon: <Headphones size={26} />,
  },
];

export default function TrustSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center space-y-3 mb-12">
        <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
          Trust & Safety Certified
        </h2>
        <p className="mx-auto max-w-2xl text-slate-500 text-sm font-semibold uppercase tracking-wider">
          Your security and peace of mind are our absolute priority
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="group rounded-3xl bg-white p-6 shadow-sm border border-slate-100/50 hover:shadow-lg transition-all duration-300"
          >
            <div className="mb-5 w-fit rounded-2xl bg-blue-50 p-4 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              {item.icon}
            </div>

            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-800 transition-colors">
              {item.title}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}