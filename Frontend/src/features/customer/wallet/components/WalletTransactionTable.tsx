import { ArrowDownCircle, ArrowUpCircle, AlertCircle, Calendar } from "lucide-react";
import type { WalletTransaction } from "../types/wallet.types";

interface Props {
  transactions: WalletTransaction[];
  loading: boolean;
}

export default function WalletTransactionTable({ transactions, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-center text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed rounded-3xl border-slate-100 dark:border-slate-700/50">
        <AlertCircle size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          No transactions logged yet. Top up or book a ride to create transaction history.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-700/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <th className="pb-3 px-2">Type</th>
            <th className="pb-3 px-2">Detail</th>
            <th className="pb-3 px-2">Purpose</th>
            <th className="pb-3 px-2">Status</th>
            <th className="pb-3 px-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-700/30">
          {transactions.map((tx) => {
            const isCredit = tx.type === "CREDIT" || tx.type === "REFUND";
            const purposeLabels: Record<string, string> = {
              RECHARGE: "Simulation",
              ADD_MONEY: "Add Money",
              BOOKING_PAYMENT: "Ride Ticket",
              REFUND: "Refund Credit",
              CASHBACK: "Cashback Reward",
            };

            return (
              <tr key={tx._id} className="text-slate-700 dark:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                {/* Type icon & label */}
                <td className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-xl p-2.5 shrink-0 ${
                        isCredit
                          ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                          : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                      }`}
                    >
                      {isCredit ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
                      {tx.type}
                    </span>
                  </div>
                </td>

                {/* Title & Description */}
                <td className="py-4 px-2 max-w-[200px] sm:max-w-xs">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">
                      {tx.title || purposeLabels[tx.purpose] || "Transaction"}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-400 truncate">
                      {tx.description}
                    </p>
                    <p className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                </td>

                {/* Purpose Badge */}
                <td className="py-4 px-2">
                  <span className="inline-block rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-700/50 px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    {purposeLabels[tx.purpose] || tx.purpose}
                  </span>
                </td>

                {/* Status Badge */}
                <td className="py-4 px-2">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide ${
                      tx.status === "SUCCESS"
                        ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                        : tx.status === "PENDING"
                        ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400 animate-pulse"
                        : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                    }`}
                  >
                    {tx.status || "SUCCESS"}
                  </span>
                </td>

                {/* Amount */}
                <td className="py-4 px-2 text-right">
                  <span
                    className={`text-sm font-black ${
                      isCredit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {isCredit ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
