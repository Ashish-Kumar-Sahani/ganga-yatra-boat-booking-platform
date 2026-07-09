import { useEffect, useState } from "react";
import { Ship, CheckCircle, XCircle, Search, Edit2, Trash2, ShieldCheck, Ban } from "lucide-react";
import { useAdminBoatsStore } from "../store/boatsStore";

export default function AdminBoats() {
  const { boats, loading, fetchBoats, updateStatus, removeBoat, editBoat } = useAdminBoatsStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [editingBoat, setEditingBoat] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    boatName: "",
    capacity: 0,
    basePrice: 0,
    boatType: "",
  });

  useEffect(() => {
    fetchBoats();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    if (confirm(`Are you sure you want to set status to ${status}?`)) {
      await updateStatus(id, status);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this boat listing?")) {
      await removeBoat(id);
    }
  };

  const handleEditClick = (boat: any) => {
    setEditingBoat(boat);
    setEditForm({
      boatName: boat.boatName || "",
      capacity: boat.capacity || 0,
      basePrice: boat.basePrice || 0,
      boatType: boat.boatType || "",
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBoat) return;
    const ok = await editBoat(editingBoat._id, editForm);
    if (ok) setEditingBoat(null);
  };

  const filteredBoats = boats.filter((boat) => {
    const matchesSearch =
      boat.boatName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boat.boatNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (boat.ownerId?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "" || boat.boatType === typeFilter;
    const matchesStatus = statusFilter === "" || boat.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalBoats = boats.length;
  const approvedBoats = boats.filter((b) => b.status === "APPROVED").length;
  const pendingBoats = boats.filter((b) => b.status === "PENDING").length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-950">Boats Fleet Registry</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor all boats, authorize registrations, and manage operational specifications.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow border border-slate-100">
          <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Ship size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Total Registered</p>
            <h3 className="text-2xl font-extrabold text-blue-950 mt-0.5">{totalBoats}</h3>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow border border-slate-100">
          <div className="h-12 w-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Approved & Operational</p>
            <h3 className="text-2xl font-extrabold text-blue-950 mt-0.5">{approvedBoats}</h3>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow border border-slate-100">
          <div className="h-12 w-12 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Pending Authorization</p>
            <h3 className="text-2xl font-extrabold text-blue-950 mt-0.5">{pendingBoats}</h3>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow border border-slate-100 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-3 rounded-xl border px-3 py-2.5 bg-slate-50 flex-1 md:max-w-xs focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search boats, numbers, owners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border px-4 py-2.5 text-sm bg-slate-50 focus:border-blue-500 outline-none cursor-pointer"
            >
              <option value="">All Boat Types</option>
              <option value="MANUAL">MANUAL</option>
              <option value="MOTOR">MOTOR</option>
              <option value="LUXURY">LUXURY</option>
              <option value="CRUISE">CRUISE</option>
              <option value="WATER_TAXI">WATER_TAXI</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border px-4 py-2.5 text-sm bg-slate-50 focus:border-blue-500 outline-none cursor-pointer"
            >
              <option value="">All Approvals</option>
              <option value="APPROVED">APPROVED</option>
              <option value="PENDING">PENDING</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50/80 text-blue-950 font-semibold border-b">
              <tr>
                <th className="p-4">Boat Details</th>
                <th className="p-4">Owner</th>
                <th className="p-4">Specifications</th>
                <th className="p-4">Pricing</th>
                <th className="p-4">Authorization</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-4 w-36 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-28 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-32 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-20 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-6 w-16 bg-slate-200 rounded-full"></div></td>
                    <td className="p-4"><div className="h-8 w-28 bg-slate-200 rounded mx-auto"></div></td>
                  </tr>
                ))
              ) : filteredBoats.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500 font-medium">
                    No boats found matching filters.
                  </td>
                </tr>
              ) : (
                filteredBoats.map((boat) => (
                  <tr key={boat._id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <div className="font-semibold text-blue-950">{boat.boatName}</div>
                      <div className="text-xs text-slate-400 mt-0.5">No: {boat.boatNumber}</div>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">{boat.ownerId?.name || "Owner Deleted"}</td>
                    <td className="p-4">
                      <div className="text-xs text-slate-600">Type: <b>{boat.boatType}</b></div>
                      <div className="text-xs text-slate-600">Capacity: <b>{boat.capacity} seats</b></div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-blue-950">₹{boat.basePrice}</div>
                      <div className="text-[10px] text-slate-500 font-semibold">{boat.isAvailable ? "● Available" : "○ Offline"}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
                        boat.status === "APPROVED"
                          ? "bg-green-50 text-green-700"
                          : boat.status === "PENDING"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-red-50 text-red-700"
                      }`}>
                        {boat.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-1.5">
                        {boat.status !== "APPROVED" && (
                          <button
                            onClick={() => handleStatusChange(boat._id, "APPROVED")}
                            className="rounded-lg bg-green-55/10 hover:bg-green-55/20 text-green-700 p-1.5 transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                            title="Approve Boat"
                          >
                            <ShieldCheck size={16} /> Approve
                          </button>
                        )}
                        {boat.status === "APPROVED" && (
                          <button
                            onClick={() => handleStatusChange(boat._id, "REJECTED")}
                            className="rounded-lg bg-amber-55/10 hover:bg-amber-55/20 text-amber-700 p-1.5 transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                            title="Suspend Boat"
                          >
                            <Ban size={16} /> Suspend
                          </button>
                        )}
                        <button
                          onClick={() => handleEditClick(boat)}
                          className="rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 p-1.5 transition cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(boat._id)}
                          className="rounded-lg bg-red-50 hover:bg-red-100 text-red-600 p-1.5 transition cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editing Dialog Modal */}
      {editingBoat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 border animate-fade-in">
            <h3 className="text-lg font-bold text-blue-950 border-b pb-3 mb-4">Edit Specs: {editingBoat.boatName}</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Boat Name</label>
                <input
                  type="text"
                  value={editForm.boatName}
                  onChange={(e) => setEditForm({ ...editForm, boatName: e.target.value })}
                  className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Capacity</label>
                  <input
                    type="number"
                    value={editForm.capacity}
                    onChange={(e) => setEditForm({ ...editForm, capacity: Number(e.target.value) })}
                    className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    value={editForm.basePrice}
                    onChange={(e) => setEditForm({ ...editForm, basePrice: Number(e.target.value) })}
                    className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Boat Type</label>
                <select
                  value={editForm.boatType}
                  onChange={(e) => setEditForm({ ...editForm, boatType: e.target.value })}
                  className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="MANUAL">MANUAL</option>
                  <option value="MOTOR">MOTOR</option>
                  <option value="LUXURY">LUXURY</option>
                  <option value="CRUISE">CRUISE</option>
                  <option value="WATER_TAXI">WATER_TAXI</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t mt-4">
                <button
                  type="button"
                  onClick={() => setEditingBoat(null)}
                  className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 text-white px-5 py-2 text-sm font-semibold hover:bg-blue-700 shadow transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
