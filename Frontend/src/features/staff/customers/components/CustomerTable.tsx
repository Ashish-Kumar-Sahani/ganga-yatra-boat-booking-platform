import type {
  ManagerCustomer,
} from "../types/customer.types";

interface Props {
  customers: ManagerCustomer[];
}

export default function CustomerTable({
  customers,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Bookings</th>
            <th>Spent</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer._id}
              className="border-b"
            >
              <td>{customer.name}</td>

              <td>{customer.email}</td>

              <td>{customer.phone}</td>

              <td>
                {customer.totalBookings}
              </td>

              <td>
                ₹{customer.totalSpent}
              </td>

              <td>
                {customer.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}