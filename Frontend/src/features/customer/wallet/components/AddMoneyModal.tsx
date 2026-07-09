import React, { useState } from "react";
import { CreditCard, X, ShieldCheck } from "lucide-react";
import { createAddMoneyOrder, verifyAddMoney } from "../api/walletApi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newBalance: number) => void;
}

export default function AddMoneyModal({ isOpen, onClose, onSuccess }: Props) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleQuickAdd = (val: number) => {
    setAmount(String(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }

    try {
      setLoading(true);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Razorpay payment gateway failed to load. Please check your internet connection.");
        return;
      }

      // Create order from backend
      const orderData = await createAddMoneyOrder(parsedAmount);

      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "GangaYatra Wallet",
        description: "Add funds to your customer wallet",
        image: "/favicon.svg",
        order_id: orderData.order.id,

        handler: async function (response: any) {
          try {
            setLoading(true);
            const verifyRes = await verifyAddMoney({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            alert("Payment verified! Funds credited to your wallet.");
            onSuccess(verifyRes.balance);
            onClose();
          } catch (verifyErr: any) {
            console.error("Signature verification error:", verifyErr);
            alert(verifyErr.response?.data?.message || "Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },

        prefill: {
          name: "Customer",
        },

        theme: {
          color: "#2563eb",
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
            alert("Payment transaction cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Wallet order creation error:", err);
      alert(err.response?.data?.message || "Failed to initiate payment. Please try again.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-800 p-6 shadow-xl space-y-5 border border-slate-100 dark:border-slate-700/50 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              <CreditCard size={20} className="text-blue-600 dark:text-blue-400" />
              Add Money to Wallet
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-400 mt-1">
              Top up your balance instantly using secure Razorpay checkout.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Recharge Amount
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3.5 focus-within:border-blue-500 transition-all">
              <span className="text-xl font-black text-slate-400">₹</span>
              <input
                type="number"
                required
                min="1"
                placeholder="Enter amount (e.g. 500)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-slate-800 dark:text-white outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Quick options */}
          <div className="flex gap-2.5">
            {[500, 1000, 2000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAdd(val)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700/50 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
              >
                +₹{val}
              </button>
            ))}
          </div>

          <div className="rounded-xl bg-blue-50/50 dark:bg-slate-900/30 border border-blue-100/10 p-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-start gap-2">
            <ShieldCheck size={16} className="text-green-600 shrink-0 mt-0.5" />
            <span>
              Your transaction is encrypted securely. Standard reward loyalty points will be credited upon success.
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 py-3.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !amount}
              className="flex-1 rounded-2xl bg-blue-600 hover:bg-blue-700 py-3.5 text-sm font-black text-white hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all text-center shadow shadow-blue-200/50 dark:shadow-none"
            >
              {loading ? "Processing..." : "Add Funds"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
