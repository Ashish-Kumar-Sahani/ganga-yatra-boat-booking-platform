import { useState } from "react";
import {
  LifeBuoy,
  Phone,
  Mail,
  Clock,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type FAQ = {
  question: string;
  answer: string;
};

export default function Support() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      question: "How do I cancel my boat booking?",
      answer: "You can cancel your booking from the 'My Bookings' section in your dashboard. If cancellation is done before the scheduled trip departure time, your fare will be automatically refunded back to your GangaYatra Wallet balance instantly.",
    },
    {
      question: "How do I track my active boat ride?",
      answer: "Go to the 'Live Tracking' section in your sidebar or click the 'Track Ride' button on any confirmed booking. You will see the real-time location of the boat on the interactive map.",
    },
    {
      question: "What should I do if my payment fails but money is debited?",
      answer: "If money has been debited but your booking is not confirmed, please wait 10-15 minutes for the system to process the payment gateway status hook. If it still doesn't update, please raise a support ticket here or email support@gangayatra.com with your transaction reference number.",
    },
    {
      question: "Are safety vests provided during the river cruise?",
      answer: "Yes, all boats registered with GangaYatra are legally required to carry safety vests, life rings, and first-aid kits for all passengers. Captains are trained to assist you.",
    },
  ];

  const handleFaqToggle = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      alert("Please fill in all the details in the form.");
      return;
    }

    try {
      setLoading(true);
      // Simulate API submit delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      alert("Your support request has been submitted successfully. Our team will review and reply within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      alert("Failed to submit support request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header>
        <h2 className="text-3xl font-black text-blue-950 dark:text-white flex items-center gap-2">
          <LifeBuoy className="text-blue-600 dark:text-blue-450" size={28} />
          Customer Support
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Get in touch with our help desk or find answers to frequently asked questions
        </p>
      </header>

      {/* Quick Contact Options */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-slate-750 text-blue-600 dark:text-blue-400">
            <Phone size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Emergency Helpline</p>
            <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">+91 1800-123-456</p>
          </div>
        </div>

        <div className="rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-slate-750 text-blue-600 dark:text-blue-400">
            <Mail size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Support Email</p>
            <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">support@gangayatra.com</p>
          </div>
        </div>

        <div className="rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-slate-750 text-blue-600 dark:text-blue-400">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Operating Hours</p>
            <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">24/7 River Helpline</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Contact Form */}
        <div className="lg:col-span-3 rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 p-6 shadow-sm space-y-5 h-fit">
          <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
            <Send size={18} className="text-blue-600" />
            Send Inquiry / Ticket
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter email"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                Subject
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="E.g., Wallet topup failed, Boat cancellation..."
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                Message / Concern
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                placeholder="Provide details about your query or ride experience..."
                className="w-full resize-none rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 py-3.5 font-bold text-white shadow transition-all disabled:opacity-60"
            >
              <Send size={15} />
              Submit Help Ticket
            </button>
          </form>
        </div>

        {/* FAQs accordion */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
            <HelpCircle size={18} className="text-blue-600" />
            Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800 shadow-sm"
                >
                  <button
                    onClick={() => handleFaqToggle(index)}
                    className="flex w-full items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-50 dark:border-slate-700/50 p-4 bg-slate-50/40 dark:bg-slate-900/10 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
