import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useAdminUsersStore } from "../store/usersStore";
import UserTable from "../components/UserTable";
import UserModal from "../components/UserModal";

export default function Users() {
  const {
    users,
    fetchUsers,
    editUser,
    removeUser,
    bulkToggleStatus,
    bulkDelete,
  } = useAdminUsersStore();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    fetchUsers({ search: val, page: 1 });
  };

  const handleRoleChange = (role: string) => {
    setRoleFilter(role);
    fetchUsers({ role, page: 1 });
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    fetchUsers({ status, page: 1 });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(users.map((u) => u._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleBulkStatus = async (isActive: boolean) => {
    if (selectedIds.length === 0) return;
    if (confirm(`Are you sure you want to update status for ${selectedIds.length} users?`)) {
      const ok = await bulkToggleStatus(selectedIds, isActive);
      if (ok) setSelectedIds([]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (confirm(`WARNING: Are you sure you want to permanently delete ${selectedIds.length} users?`)) {
      const ok = await bulkDelete(selectedIds);
      if (ok) setSelectedIds([]);
    }
  };

  const handleView = (user: any) => {
    setSelectedUser(user);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this user?")) {
      await removeUser(id);
    }
  };

  const handleSaveModal = async (id: string, data: any) => {
    const success = await editUser(id, data);
    if (success) {
      setModalOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-950">Users Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage accounts, verify profiles, and audit system activities.</p>
        </div>
      </div>

      {/* Filters & Actions Panel */}
      <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow border border-slate-100 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-3 rounded-xl border px-3 py-2.5 bg-slate-50 flex-1 md:max-w-xs focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={roleFilter}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="rounded-xl border px-4 py-2.5 text-sm bg-slate-50 focus:border-blue-500 outline-none cursor-pointer"
            >
              <option value="">All Access Roles</option>
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="BOAT_OWNER">BOAT_OWNER</option>
              <option value="MANAGER">MANAGER</option>
              <option value="DRIVER">DRIVER</option>
              <option value="CAPTAIN">CAPTAIN</option>
              <option value="HELPER">HELPER</option>
              <option value="CITY_AUTHORITY">CITY_AUTHORITY</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="rounded-xl border px-4 py-2.5 text-sm bg-slate-50 focus:border-blue-500 outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="active">Active Accounts</option>
              <option value="inactive">Inactive Accounts</option>
            </select>
          </div>
        </div>

        {/* Bulk operations display */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 rounded-xl bg-blue-50/50 p-2.5 border border-blue-100 animate-fade-in">
            <span className="text-xs font-semibold text-blue-900 px-1">
              <b>{selectedIds.length}</b> selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkStatus(true)}
                className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-green-700 shadow hover:bg-green-50 transition border border-green-200 cursor-pointer"
              >
                Activate All
              </button>
              <button
                onClick={() => handleBulkStatus(false)}
                className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-red-700 shadow hover:bg-red-50 transition border border-red-200 cursor-pointer"
              >
                Deactivate All
              </button>
              <button
                onClick={handleBulkDelete}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-red-700 transition cursor-pointer"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <UserTable
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
      />

      {/* Profile Detail/Edit Modal */}
      <UserModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        mode={modalMode}
        onSave={handleSaveModal}
      />
    </div>
  );
}