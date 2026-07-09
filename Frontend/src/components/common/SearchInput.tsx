import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  debounceMs = 0,
}: SearchInputProps) {
  const [localVal, setLocalVal] = useState(value);

  useEffect(() => {
    setLocalVal(value);
  }, [value]);

  useEffect(() => {
    if (debounceMs <= 0) return;
    const handler = setTimeout(() => {
      onChange(localVal);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [localVal, debounceMs, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalVal(val);
    if (debounceMs <= 0) {
      onChange(val);
    }
  };

  const handleClear = () => {
    setLocalVal("");
    onChange("");
  };

  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 px-3 py-2 w-full focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all ${className}`}
    >
      <Search size={16} className="text-slate-400 shrink-0" />
      <input
        type="text"
        placeholder={placeholder}
        value={localVal}
        onChange={handleInputChange}
        className="w-full bg-transparent text-sm font-semibold outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
      />
      {localVal && (
        <button
          onClick={handleClear}
          className="rounded-lg p-0.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
