import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import EmptyState from "@/components/common/EmptyState";

interface Column {
  header: string;
  accessor: string | ((row: any) => React.ReactNode);
  sortKey?: string;
  className?: string;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
  pagination?: PaginationProps;
  onSortChange?: (sortKey: string, direction: "asc" | "desc") => void;
}

export default function DataTable({
  columns,
  data,
  loading = false,
  emptyMessage = "No records found.",
  pagination,
  onSortChange,
}: DataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (key?: string) => {
    if (!key || !onSortChange) return;
    const nextDirection = sortKey === key && direction === "asc" ? "desc" : "asc";
    setSortKey(key);
    setDirection(nextDirection);
    onSortChange(key, nextDirection);
  };

  if (loading) {
    return <LoadingSkeleton rows={5} columns={columns.length} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="w-full space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm transition-colors duration-300">
        <table className="w-full border-collapse text-left text-sm text-slate-600 dark:text-slate-350">
          <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-850">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  onClick={() => handleSort(col.sortKey)}
                  className={`px-6 py-4.5 ${col.sortKey ? "cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200" : ""} ${col.className || ""}`}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.header}</span>
                    {col.sortKey && sortKey === col.sortKey && (
                      direction === "asc" ? <ChevronUp size={14} className="text-blue-600" /> : <ChevronDown size={14} className="text-blue-600" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
            {data.map((row, rowIdx) => (
              <tr
                key={row._id || rowIdx}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={`px-6 py-4.5 font-medium ${col.className || ""}`}>
                    {typeof col.accessor === "function"
                      ? col.accessor(row)
                      : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-4 text-xs font-bold text-slate-400 dark:text-slate-500">
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
