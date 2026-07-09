import { useEffect, useState } from "react";
import { Users, BadgeCheck, Ship, Search } from "lucide-react";
import { useAdminUsersStore } from "../../users/store/usersStore";
import { useAdminBoatsStore } from "../../boats/store/boatsStore";
import BoatOwnerTable from "../components/BoatOwnerTable";
import BoatOwnerDetailsModal from "../components/BoatOwnerDetailsModal";
import OwnerBoatsModal from "../components/OwnerBoatsModal";
import VerifyOwnerModal from "../components/VerifyOwnerModal";

export default function BoatOwners() {
  const { users: allOwners, fetchUsers, toggleUserStatus } = useAdminUsersStore();
  const { boats, fetchBoats } = useAdminBoatsStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOwner, setSelectedOwner] = useState<any | null>(null);
  
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [boatsOpen, setBoatsOpen] = useState(false);

  useEffect(() => {
    fetchUsers({ role: "BOAT_OWNER", page: 1, limit: 100 });
    fetchBoats();
  }, []);

  const filteredOwners = allOwners.filter(
    (owner) =>
      owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (owner: any) => {
    setSelectedOwner(owner);
    setDetailsOpen(true);
  };

  const handleVerify = (owner: any) => {
    setSelectedOwner(owner);
    setVerifyOpen(true);
  };

  const handleViewBoats = (owner: any) => {
    setSelectedOwner(owner);
    setBoatsOpen(true);
  };

  const handleConfirmVerification = async (id: string, active: boolean) => {
    await toggleUserStatus(id, active);
    setVerifyOpen(false);
    setSelectedOwner(null);
  };

  const totalOwners = allOwners.length;
  const verifiedOwners = allOwners.filter((o) => o.isActive).length;
  const totalBoatsCount = boats.length;

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-950">Boat Owners Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Audit credentials, view boat listings, and verify system access.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow border border-slate-100">
          <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Total Owners</p>
            <h3 className="text-2xl font-extrabold text-blue-950 mt-0.5">{totalOwners}</h3>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow border border-slate-100">
          <div className="h-12 w-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <BadgeCheck size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Verified Active</p>
            <h3 className="text-2xl font-extrabold text-blue-950 mt-0.5">{verifiedOwners}</h3>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow border border-slate-100">
          <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Ship size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Total Boats Owned</p>
            <h3 className="text-2xl font-extrabold text-blue-950 mt-0.5">{totalBoatsCount}</h3>
          </div>
        </div>
      </div>

      {/* Filter / Search Panel */}
      <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow border border-slate-100 sm:flex-row sm:items-center justify-between">
        <div className="flex items-center gap-3 rounded-xl border px-3 py-2.5 bg-slate-50 flex-1 sm:max-w-xs focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search owners by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Owner Table */}
      <BoatOwnerTable
        owners={filteredOwners}
        boats={boats}
        onView={handleView}
        onVerify={handleVerify}
        onViewBoats={handleViewBoats}
      />

      {/* Profile details Modal */}
      <BoatOwnerDetailsModal
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedOwner(null);
        }}
        owner={selectedOwner}
      />

      {/* Verification status edit Modal */}
      <VerifyOwnerModal
        open={verifyOpen}
        onClose={() => {
          setVerifyOpen(false);
          setSelectedOwner(null);
        }}
        owner={selectedOwner}
        onConfirm={handleConfirmVerification}
      />

      {/* Boats owned lists Modal */}
      <OwnerBoatsModal
        open={boatsOpen}
        onClose={() => {
          setBoatsOpen(false);
          setSelectedOwner(null);
        }}
        owner={selectedOwner}
        boats={boats.filter((b) => {
          const bOwnerId = b.ownerId?._id || b.ownerId;
          return bOwnerId === selectedOwner?._id;
        })}
      />
    </div>
  );
}