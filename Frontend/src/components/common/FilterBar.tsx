import React from "react";

interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
}

export default function FilterBar({ children, className = "" }: FilterBarProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-colors duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
