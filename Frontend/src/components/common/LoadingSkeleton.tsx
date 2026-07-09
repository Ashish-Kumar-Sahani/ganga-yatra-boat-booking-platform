

interface LoadingSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export default function LoadingSkeleton({
  rows = 4,
  columns = 4,
  className = "",
}: LoadingSkeletonProps) {
  return (
    <div className={`w-full space-y-4 animate-pulse ${className}`}>
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
      <div className="space-y-2.5">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4">
            {Array.from({ length: columns }).map((_, c) => (
              <div
                key={c}
                className="h-12 bg-slate-100 dark:bg-slate-900 rounded-xl flex-1"
                style={{ opacity: 1 - r * 0.15 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
