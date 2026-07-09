import { useEffect, useState } from "react";
import { Plus, Shield, RefreshCw } from "lucide-react";
import { useAuthorityStore } from "../store/authorityStore";
import AuthorityStats from "../components/AuthorityStats";
import AuthorityFilters from "../components/AuthorityFilters";
import AuthorityTable from "../components/AuthorityTable";
import AuthorityForm from "../components/AuthorityForm";
import AuthorityDetails from "../components/AuthorityDetails";
import type { AuthorityUser } from "../types/authority.types";

export default function AuthorityList() {
  const {
    authorities,
    stats,
    pagination,
    loading,
    error,
    filters,
    fetchAuthorities,
    addAuthority,
    editAuthority,
    removeAuthority,
    changeAuthorityStatus,
    changeAuthorityPassword,
  } = useAuthorityStore();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedAuthority, setSelectedAuthority] = useState<AuthorityUser | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchAuthorities();
  }, []);

  const handleFilterChange = (newFilters: any) => {
    fetchAuthorities(newFilters);
  };

  const handleCreateOpen = () => {
    setSelectedAuthority(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEditOpen = (auth: AuthorityUser) => {
    setSelectedAuthority(auth);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleViewOpen = (auth: AuthorityUser) => {
    setSelectedAuthority(auth);
    setDetailsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("WARNING: Are you sure you want to permanently delete this authority account? All their logs will remain, but login credentials will be removed.")) {
      const ok = await removeAuthority(id);
      if (ok) {
        alert("Authority user deleted successfully.");
      }
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    const ok = await changeAuthorityStatus(id, isActive);
    if (!ok) {
      alert("Failed to update status.");
    }
  };

  const handleResetPassword = async (auth: AuthorityUser) => {
    const id = auth.id || (auth as any)._id;
    const newPass = prompt(`Enter a new password for ${auth.name} (min 6 characters):`);
    if (newPass === null) return; // user cancelled

    if (newPass.trim().length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    const ok = await changeAuthorityPassword(id, newPass.trim());
    if (ok) {
      alert(`Password for ${auth.name} has been reset successfully.`);
    } else {
      alert("Failed to reset password.");
    }
  };

  const handleSaveForm = async (formData: FormData) => {
    if (formMode === "create") {
      return await addAuthority(formData);
    } else {
      const id = selectedAuthority?.id || (selectedAuthority as any)._id;
      return await editAuthority(id, formData);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      handleFilterChange({ page: newPage });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b pb-5 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-950 flex items-center gap-2">
            <Shield className="text-blue-600 shrink-0" size={26} /> City Authorities Registry
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Audit and manage system permissions, cities, and credentials of official inspectors and administrators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={() => fetchAuthorities()}
            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 p-2.5 text-slate-600 transition shadow-sm cursor-pointer"
            title="Refresh Registry"
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>

          {/* Add Authority Button */}
          <button
            onClick={handleCreateOpen}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-bold shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <Plus size={18} /> Add New Authority
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
          Error: {error}
        </div>
      )}

      {/* Statistics */}
      <AuthorityStats stats={stats} />

      {/* Search & Filters */}
      <AuthorityFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Authority Table */}
      <AuthorityTable
        authorities={authorities}
        onView={handleViewOpen}
        onEdit={handleEditOpen}
        onDelete={handleDelete}
        onResetPassword={handleResetPassword}
        onToggleStatus={handleToggleStatus}
        loading={loading && authorities.length === 0}
      />

      {/* Pagination Panel */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 font-semibold text-slate-500 text-xs">
          <span>
            Showing Page <b>{pagination.page}</b> of <b>{pagination.pages}</b> (<b>{pagination.total}</b> officials)
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="rounded-xl border px-3 py-2 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="rounded-xl border px-3 py-2 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Creation/Edit Form Modal */}
      <AuthorityForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedAuthority(null);
        }}
        onSave={handleSaveForm}
        authority={selectedAuthority}
        mode={formMode}
      />

      {/* Info View Drawer/Modal */}
      <AuthorityDetails
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedAuthority(null);
        }}
        authority={selectedAuthority}
      />
    </div>
  );
}
