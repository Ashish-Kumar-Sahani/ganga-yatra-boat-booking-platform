import { Users, UserCheck, Ship, User } from "lucide-react";

import AdminFilters from "@/features/admin/analytics/components/AdminFilter";
import AdminPageHeader from "@/features/admin/analytics/components/AdminPageHeader";
import AdminStatsGrid from "@/features/admin/analytics/components/AdminStatsGrid";
import UserTable from "@/features/admin/users/components/UserTable";

const stats = [
  { title: "Total Users", value: "12,845", icon: Users },
  { title: "Active Users", value: "10,245", icon: UserCheck },
  { title: "Customers", value: "8,520", icon: User },
  { title: "Boat Owners", value: "1,240", icon: Ship },
];

export default function UsersPage() {
  return (
    <div className="p-6">
      <AdminPageHeader
        title="Users Management"
        description="Manage all platform users"
        buttonText="Add User"
      />

      <AdminStatsGrid stats={stats} />

      <AdminFilters searchPlaceholder="Search users..." />

      <UserTable 
        onView={() => {}} 
        onEdit={() => {}} 
        onDelete={() => {}} 
        selectedIds={[]} 
        onSelectAll={() => {}} 
        onSelectOne={() => {}} 
      />
    </div>
  );
}