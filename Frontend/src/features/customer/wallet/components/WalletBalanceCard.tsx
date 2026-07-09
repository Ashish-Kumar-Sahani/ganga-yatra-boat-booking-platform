import { Wallet as WalletIcon, TrendingUp, Award, ArrowUpCircle } from "lucide-react";
import type { WalletData } from "../types/wallet.types";

interface Props {
  wallet: WalletData;
}

export default function WalletBalanceCard({ wallet }: Props) {
  return (
    <div className="space-y-6">
      {/* Main card */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 p-8 text-white shadow-xl dark:shadow-none transition-all duration-300">
        {/* Subtle decorative circles */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-white/10 blur-xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
              <WalletIcon size={24} />
            </div>

            <p className="text-xs font-bold text-blue-100 uppercase tracking-widest">
              Available Balance
            </p>

            <h1 className="mt-2 text-4xl font-black md:text-5xl tracking-tight text-white drop-shadow-sm">
              ₹{wallet.balance.toLocaleString("en-IN")}
            </h1>
          </div>

          <div className="rounded-3xl bg-white/10 p-6 border border-white/15 backdrop-blur-lg shrink-0">
            <p className="text-xs font-bold text-blue-100 uppercase tracking-wider flex items-center gap-1.5">
              <Award size={14} className="text-yellow-300" />
              Reward Points
            </p>
            <h3 className="text-3.5xl font-black mt-1 flex items-center gap-2 text-yellow-300">
              <TrendingUp size={24} />
              {wallet.rewardPoints}
            </h3>
            <p className="text-[10px] text-blue-100 mt-1 font-semibold">Earned on recharges and rides</p>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-blue-50/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-5 shadow-sm flex items-center gap-4 transition-colors">
          <div className="rounded-xl bg-blue-50 dark:bg-slate-900/50 p-2.5 shrink-0 border border-slate-100/10">
            <WalletIcon size={22} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Wallet Balance</p>
            <h3 className="mt-0.5 text-lg font-black text-slate-800 dark:text-slate-100">
              ₹{wallet.balance.toLocaleString("en-IN")}
            </h3>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-50/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-5 shadow-sm flex items-center gap-4 transition-colors">
          <div className="rounded-xl bg-yellow-50 dark:bg-slate-900/50 p-2.5 shrink-0 border border-slate-100/10">
            <Award size={22} className="text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Points</p>
            <h3 className="mt-0.5 text-lg font-black text-slate-800 dark:text-slate-100">
              {wallet.rewardPoints}
            </h3>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-50/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-5 shadow-sm flex items-center gap-4 transition-colors">
          <div className="rounded-xl bg-green-50 dark:bg-slate-900/50 p-2.5 shrink-0 border border-slate-100/10">
            <ArrowUpCircle size={22} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Ride Spending</p>
            <h3 className="mt-0.5 text-lg font-black text-slate-800 dark:text-slate-100">
              ₹{wallet.totalSpent.toLocaleString("en-IN")}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
