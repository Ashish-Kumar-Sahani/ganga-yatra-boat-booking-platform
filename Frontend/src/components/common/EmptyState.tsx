import { Info } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: any;
}

export default function EmptyState({
  title = "No data found",
  message = "There are no records to display at the moment.",
  actionText,
  onAction,
  icon: Icon = Info,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center transition-colors">
      <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 text-slate-400 dark:text-slate-500">
        <Icon size={32} />
      </div>
      <h3 className="mt-4 text-lg font-black text-slate-800 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm font-semibold text-slate-405">
        {message}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-6 rounded-xl bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
