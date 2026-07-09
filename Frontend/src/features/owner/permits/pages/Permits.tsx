import PermitStats from "@/features/owner/permits/components/PermitStats";
import PermitTable from "@/features/owner/permits/components/PermitTable";

export default function Permits() {
  return (
    <div className="p-5">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">
            Permits
          </h1>

          <p className="text-slate-500">
            Track boat permits and approval status
          </p>
        </div>

        <button className="rounded-xl bg-blue-600 px-5 py-3 text-white">
          Apply Permit
        </button>
      </div>

      <PermitStats />

      <PermitTable />
    </div>
  );
}