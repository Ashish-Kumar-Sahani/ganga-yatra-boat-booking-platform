import { Headphones } from "lucide-react";

export default function HelpCard() {
  return (
    <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-blue-950">Need Help?</h2>

      <p className="mt-2 text-sm font-medium text-slate-600">
        Our support team is always ready to help you!
      </p>

      <div className="mt-4 flex items-center justify-between">
        <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-400 py-3 text-sm font-extrabold text-blue-700">
          <Headphones size={18} />
          Contact Support
        </button>

        <Headphones className="ml-4 text-blue-800" size={56} />
      </div>
    </section>
  );
}