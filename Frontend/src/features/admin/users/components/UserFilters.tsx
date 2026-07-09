export default function UserFilters() {
  return (
    <div className="mt-6 rounded-2xl bg-white p-5 shadow">
      <div className="flex flex-col gap-4 lg:flex-row">
        <input
          type="text"
          placeholder="Search users..."
          className="flex-1 rounded-xl border p-3"
        />

        <select className="rounded-xl border p-3">
          <option>All Roles</option>
          <option>Customer</option>
          <option>Owner</option>
          <option>Admin</option>
        </select>

        <select className="rounded-xl border p-3">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <button className="rounded-xl bg-blue-600 px-5 py-3 text-white">
          Add User
        </button>
      </div>
    </div>
  );
}