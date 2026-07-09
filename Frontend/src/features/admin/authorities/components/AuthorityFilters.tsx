import { Search, RotateCcw, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";

interface Props {
  filters: any;
  onFilterChange: (newFilters: any) => void;
}

export default function AuthorityFilters({ filters, onFilterChange }: Props) {
  const [cities, setCities] = useState<any[]>([]);
  const [searchVal, setSearchVal] = useState(filters.search || "");
  const [deptVal, setDeptVal] = useState(filters.department || "");
  const [desgVal, setDesgVal] = useState(filters.designation || "");

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axiosInstance.get("/cities");
        if (res.data && Array.isArray(res.data.cities)) {
          setCities(res.data.cities);
        } else if (Array.isArray(res.data)) {
          setCities(res.data);
        }
      } catch (err) {
        console.error("Error loading cities in authority filters:", err);
      }
    };
    fetchCities();
  }, []);

  // Update input fields if filters are reset from parent
  useEffect(() => {
    setSearchVal(filters.search || "");
    setDeptVal(filters.department || "");
    setDesgVal(filters.designation || "");
  }, [filters]);

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onFilterChange({ search: searchVal });
    }
  };

  const handleReset = () => {
    setSearchVal("");
    setDeptVal("");
    setDesgVal("");
    onFilterChange({
      search: "",
      cityId: "",
      status: "",
      department: "",
      designation: "",
      page: 1,
    });
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow border border-slate-100 space-y-4">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="flex items-center gap-3 rounded-xl border px-3 py-2 bg-slate-50 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search name, code, phone..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onBlur={() => onFilterChange({ search: searchVal })}
            onKeyPress={handleSearchKeyPress}
            className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400 text-slate-800"
          />
        </div>

        {/* City Filter */}
        <div className="flex items-center gap-2 rounded-xl border px-3 py-2 bg-slate-50 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
          <Building2 size={16} className="text-slate-400" />
          <select
            value={filters.cityId || ""}
            onChange={(e) => onFilterChange({ cityId: e.target.value })}
            className="bg-transparent text-sm outline-none w-full cursor-pointer text-slate-800"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.name} ({city.state})
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 rounded-xl border px-3 py-2 bg-slate-50 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
          <select
            value={filters.status || ""}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="bg-transparent text-sm outline-none w-full cursor-pointer text-slate-800"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active Officials</option>
            <option value="INACTIVE">Inactive Officials</option>
          </select>
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-3 rounded-xl border px-3 py-2 bg-slate-50 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
          <input
            type="text"
            placeholder="Filter by Department..."
            value={deptVal}
            onChange={(e) => setDeptVal(e.target.value)}
            onBlur={() => onFilterChange({ department: deptVal })}
            onKeyPress={(e) => e.key === "Enter" && onFilterChange({ department: deptVal })}
            className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400 text-slate-800"
          />
        </div>
      </div>

      <div className="flex justify-between items-center flex-wrap gap-3 pt-2">
        {/* Designation Filter */}
        <div className="flex items-center gap-3 rounded-xl border px-3 py-2 bg-slate-50 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition max-w-xs w-full">
          <input
            type="text"
            placeholder="Filter by Designation..."
            value={desgVal}
            onChange={(e) => setDesgVal(e.target.value)}
            onBlur={() => onFilterChange({ designation: desgVal })}
            onKeyPress={(e) => e.key === "Enter" && onFilterChange({ designation: desgVal })}
            className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400 text-slate-800"
          />
        </div>

        {/* Reset Filters */}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 rounded-xl border border-slate-200 hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 transition shadow-sm cursor-pointer"
        >
          <RotateCcw size={14} /> Clear All Filters
        </button>
      </div>
    </div>
  );
}
