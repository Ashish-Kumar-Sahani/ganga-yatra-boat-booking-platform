export default function BoatFilters() {
  return (
    <div className="mt-6 rounded-2xl bg-white p-5 shadow">
      <div className="grid gap-4 md:grid-cols-3">
        <input
          placeholder="Search Boat..."
          className="rounded-xl border p-3"
        />

        <select className="rounded-xl border p-3">
          <option>All Status</option>
          <option>Active</option>
          <option>Maintenance</option>
        </select>

        <select className="rounded-xl border p-3">
          <option>All Types</option>
          <option>Luxury</option>
          <option>Deluxe</option>
          <option>Family</option>
        </select>
      </div>
    </div>
  );
}