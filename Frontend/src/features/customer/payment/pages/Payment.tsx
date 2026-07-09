import { useEffect, useState } from "react";
import { CreditCard, ShieldCheck, Wallet, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getPaymentByBooking,
} from "@/features/customer/payment/api/paymentApi";
import { payBookingWithWallet } from "@/features/customer/wallet/api/walletApi";
import { useWalletStore } from "@/features/customer/wallet/store/walletStore";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "wallet">("razorpay");
  
  // Booking and Wallet details
  const [booking, setBooking] = useState<{
    bookingId: string;
    bookingCode: string;
    amount: number;
    paymentStatus: string;
    bookingStatus: string;
  } | null>(null);
  const wallet = useWalletStore((state) => state.wallet);
  const fetchWalletDetails = useWalletStore((state) => state.fetchWalletDetails);
  const [fetchingData, setFetchingData] = useState(true);

  const loadData = async () => {
    try {
      if (!bookingId) return;
      setFetchingData(true);
      
      const [bookingData] = await Promise.all([
        getPaymentByBooking(bookingId),
        fetchWalletDetails(),
      ]);

      setBooking(bookingData);

      // If already paid, redirect to ticket page immediately
      if (bookingData.paymentStatus === "PAID") {
        navigate(`/ticket/${bookingData.bookingCode}`, { replace: true });
      }
    } catch (err) {
      console.error("Failed to load checkout details:", err);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [bookingId]);

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

  const handleRazorpayPayment = async () => {
    try {
      if (!bookingId || !booking) {
        alert("Booking details not loaded");
        return;
      }

      setLoading(true);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      const orderData = await createRazorpayOrder(bookingId);

      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "GangaYatra",
        description: "Boat Ride Booking Payment",
        image: "/favicon.svg",
        order_id: orderData.order.id,

        handler: async function (response: any) {
          try {
            setLoading(true);
            const verified = await verifyRazorpayPayment({
              bookingId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            alert("Payment successful");
            navigate(`/ticket/${verified.bookingCode}`, { replace: true });
          } catch (err: any) {
            alert(err.response?.data?.message || "Payment verification failed");
          } finally {
            setLoading(false);
          }
        },

        prefill: {
          name: orderData.booking.passengerName,
          contact: orderData.booking.passengerPhone,
        },

        notes: {
          bookingId,
          bookingCode: orderData.booking.bookingCode,
        },

        theme: {
          color: "#2563eb",
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
            alert("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Payment failed");
      setLoading(false);
    }
  };

  const handleWalletPayment = async () => {
    try {
      if (!bookingId || !booking) {
        alert("Booking details not loaded");
        return;
      }

      if ((wallet?.balance ?? 0) < booking.amount) {
        alert("Insufficient wallet balance");
        return;
      }

      setLoading(true);
      const res = await payBookingWithWallet(bookingId);
      
      // Update wallet store (which also updates auth store)
      useWalletStore.getState().setWalletBalance(res.balance);

      alert(res.message || "Payment completed successfully using wallet.");
      navigate(`/ticket/${res.booking.bookingCode}`, { replace: true });
    } catch (err: any) {
      alert(err.response?.data?.message || "Wallet payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-8 text-center text-red-500">
        <AlertCircle className="mx-auto mb-2 text-red-500" size={32} />
        <h3 className="font-bold">Booking Details Missing</h3>
        <p className="text-xs text-slate-400 mt-1">Unable to load booking info for payment.</p>
      </div>
    );
  }

  const isWalletInsufficient = (wallet?.balance ?? 0) < booking.amount;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-blue-950 dark:text-white">Secure Payment</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Complete your booking payment. Choose your preferred payment method below.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Booking Summary Column */}
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-3xl border border-blue-50/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4">Summary</h3>
            
            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-400">Booking Code:</span>
                <span className="font-bold text-slate-800 dark:text-white uppercase">{booking.bookingCode || "Pending"}</span>
              </div>
              <div className="flex justify-between border-t dark:border-slate-700 pt-3">
                <span className="font-semibold text-slate-400">Fare Amount:</span>
                <span className="font-bold text-slate-800 dark:text-white">₹{booking.amount}</span>
              </div>
              <div className="flex justify-between border-t dark:border-slate-700 pt-3 text-sm font-black">
                <span className="text-slate-500 dark:text-slate-400">Total Payable:</span>
                <span className="text-blue-600 dark:text-blue-400">₹{booking.amount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Selection Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-3xl border border-blue-50/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-6 shadow-sm transition-colors">
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-5">Select Payment Method</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Razorpay selector option */}
              <div
                onClick={() => setPaymentMethod("razorpay")}
                className={`rounded-2xl border-2 p-5 cursor-pointer flex flex-col gap-3 transition-all ${
                  paymentMethod === "razorpay"
                    ? "border-blue-500 bg-blue-50/30 dark:bg-blue-900/10"
                    : "border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-blue-50 dark:bg-slate-900 p-2.5 text-blue-600 dark:text-blue-400 shrink-0">
                    <CreditCard size={20} />
                  </div>
                  <input
                    type="radio"
                    name="payment_opt"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => setPaymentMethod("razorpay")}
                    className="h-4.5 w-4.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm">Online Gateway</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">UPI, Card, NetBanking, Wallets</p>
                </div>
              </div>

              {/* Wallet selector option */}
              <div
                onClick={() => setPaymentMethod("wallet")}
                className={`rounded-2xl border-2 p-5 cursor-pointer flex flex-col gap-3 transition-all ${
                  paymentMethod === "wallet"
                    ? "border-blue-500 bg-blue-50/30 dark:bg-blue-900/10"
                    : "border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-indigo-50 dark:bg-slate-900 p-2.5 text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Wallet size={20} />
                  </div>
                  <input
                    type="radio"
                    name="payment_opt"
                    checked={paymentMethod === "wallet"}
                    onChange={() => setPaymentMethod("wallet")}
                    className="h-4.5 w-4.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm">GangaYatra Wallet</h4>
                  <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5">Balance: ₹{(wallet?.balance ?? 0).toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>

            {/* Payment Method Panel Details */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/60">
              {paymentMethod === "razorpay" ? (
                <div className="space-y-5">
                  <div className="rounded-2xl bg-green-50/50 dark:bg-green-950/20 border border-green-100/10 p-4 text-green-700 dark:text-green-400 flex items-start gap-2">
                    <ShieldCheck size={18} className="shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold">
                      Your transaction will be securely processed through Razorpay encryption standards.
                    </span>
                  </div>

                  <button
                    onClick={handleRazorpayPayment}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 py-4 font-bold text-white shadow shadow-blue-200/50 dark:shadow-none hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
                  >
                    <CreditCard size={18} />
                    {loading ? "Launching Razorpay Checkout..." : "Open Razorpay Checkout"}
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {isWalletInsufficient ? (
                    <div className="rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-100/10 p-4 text-red-700 dark:text-red-400 flex items-start gap-2">
                      <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
                      <div className="text-xs space-y-2">
                        <p className="font-bold">Insufficient Wallet Balance</p>
                        <p className="font-medium text-slate-500 dark:text-slate-400">
                          You need ₹{booking.amount} but your wallet balance is only ₹{wallet?.balance ?? 0}. Please add funds to proceed.
                        </p>
                        <button
                          type="button"
                          onClick={() => navigate("/customer/wallet")}
                          className="text-xs font-extrabold text-blue-600 dark:text-blue-450 hover:underline flex items-center gap-0.5"
                        >
                          Go to Wallet to Add Money
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-green-50/50 dark:bg-green-950/20 border border-green-100/10 p-4 text-green-700 dark:text-green-400 flex items-start gap-2">
                      <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold">
                        Sufficient wallet balance. Your ride tickets will be confirmed instantly.
                      </span>
                    </div>
                  )}

                  <button
                    onClick={handleWalletPayment}
                    disabled={loading || isWalletInsufficient}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 py-4 font-bold text-white shadow shadow-indigo-200/50 dark:shadow-none hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Wallet size={18} />
                    {loading ? "Processing Wallet Payment..." : "Confirm Wallet Payment"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}