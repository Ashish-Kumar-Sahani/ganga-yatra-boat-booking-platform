import { AlertCircle, RefreshCcw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading data. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-red-100 dark:border-red-950/20 bg-red-50/30 dark:bg-red-950/5 p-8 text-center transition-colors">
      <div className="rounded-2xl bg-red-100 dark:bg-red-950/30 p-4 text-red-650 dark:text-red-400">
        <AlertCircle size={32} />
      </div>
      <h3 className="mt-4 text-lg font-black text-slate-800 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm font-semibold text-slate-405 dark:text-slate-400">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 flex items-center gap-2 rounded-xl bg-red-650 hover:bg-red-750 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
        >
          <RefreshCcw size={16} />
          Retry Request
        </button>
      )}
    </div>
  );
}
