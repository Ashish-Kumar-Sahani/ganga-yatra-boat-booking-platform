

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const getBadgeStyles = (s: string) => {
    const norm = s.toUpperCase().trim();
    switch (norm) {
      case "CONFIRMED":
      case "COMPLETED":
      case "PAID":
      case "APPROVED":
      case "ACTIVE":
      case "VERIFIED":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30";
      case "PENDING":
      case "DRAFT":
      case "UNPAID":
      case "RENEWAL_REQUIRED":
        return "bg-yellow-50 text-yellow-755 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/30";
      case "CANCELLED":
      case "REJECTED":
      case "SUSPENDED":
      case "INACTIVE":
      case "BLOCKED":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800/30";
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase transition-colors ${getBadgeStyles(
        status
      )} ${className}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
