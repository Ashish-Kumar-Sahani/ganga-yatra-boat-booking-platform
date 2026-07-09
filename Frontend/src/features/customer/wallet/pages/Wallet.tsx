import { useEffect, useState } from "react";
import { CreditCard, History } from "lucide-react";
import { useWalletStore } from "../store/walletStore";
import WalletBalanceCard from "../components/WalletBalanceCard";
import AddMoneyModal from "../components/AddMoneyModal";
import WalletTransactionTable from "../components/WalletTransactionTable";

export default function Wallet() {
  const { wallet, transactions, loading, fetchWalletDetails, fetchTransactions, setWalletBalance } = useWalletStore();
  const [showAddMoney, setShowAddMoney] = useState(false);

  useEffect(() => {
    fetchWalletDetails();
    fetchTransactions();
  }, []);

  const handlePaymentSuccess = (newBalance: number) => {
    setWalletBalance(newBalance);
    fetchTransactions();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-black text-blue-950 dark:text-white">My Wallet</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Recharge, review reward points, and track complete transaction history
          </p>
        </div>

        <button
          onClick={() => setShowAddMoney(true)}
          className="flex w-fit items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-3 font-bold text-white shadow shadow-blue-200/50 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all shrink-0"
        >
          <CreditCard size={18} />
          Add Money
        </button>
      </header>

      {/* Balance Card Component */}
      <WalletBalanceCard wallet={wallet} />

      {/* Transactions Table Component */}
      <section className="rounded-3xl border border-blue-50/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-6 shadow-sm transition-colors">
        <h3 className="mb-5 flex items-center gap-2 text-lg font-black text-slate-800 dark:text-white">
          <History size={20} className="text-blue-600 dark:text-blue-400" />
          Wallet Transaction Ledger
        </h3>

        <WalletTransactionTable transactions={transactions} loading={loading} />
      </section>

      {/* Add Money Razorpay Modal */}
      <AddMoneyModal
        isOpen={showAddMoney}
        onClose={() => setShowAddMoney(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}