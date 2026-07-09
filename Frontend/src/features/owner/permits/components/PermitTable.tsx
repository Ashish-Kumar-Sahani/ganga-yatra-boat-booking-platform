const permits = [
  {
    id: "PER001",
    boat: "Luxury Boat",
    permitType: "Tourist Operation",
    issueDate: "01 Jan 2025",
    expiryDate: "31 Dec 2025",
    status: "Approved",
  },
  {
    id: "PER002",
    boat: "Deluxe Boat",
    permitType: "Passenger Transport",
    issueDate: "10 Feb 2025",
    expiryDate: "10 Feb 2026",
    status: "Pending",
  },
  {
    id: "PER003",
    boat: "Family Boat",
    permitType: "Special Event",
    issueDate: "15 Mar 2024",
    expiryDate: "15 Mar 2025",
    status: "Expired",
  },
];

export default function PermitTable() {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">Permit ID</th>
            <th>Boat</th>
            <th>Type</th>
            <th>Issue Date</th>
            <th>Expiry Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {permits.map((permit) => (
            <tr key={permit.id} className="border-t hover:bg-slate-50">
              <td className="p-4 font-semibold text-blue-950">
                {permit.id}
              </td>

              <td>{permit.boat}</td>
              <td>{permit.permitType}</td>
              <td>{permit.issueDate}</td>
              <td>{permit.expiryDate}</td>

              <td>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    permit.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : permit.status === "Pending"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {permit.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}