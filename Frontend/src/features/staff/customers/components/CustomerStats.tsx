import type {
  ManagerCustomer,
} from "../types/customer.types";

interface Props {
  customers: ManagerCustomer[];
}

export default function CustomerStats({
  customers,
}: Props) {
  const active =
    customers.filter(
      (c) => c.status === "ACTIVE"
    ).length;

  const revenue =
    customers.reduce(
      (sum, c) => sum + c.totalSpent,
      0
    );

  return (
    <div className="grid md:grid-cols-3 gap-5">
      <div className="bg-white p-5 rounded-2xl shadow">
        <h3>Total Customers</h3>
        <p className="text-3xl font-bold">
          {customers.length}
        </p>
      </div>

      <div className="bg-green-50 p-5 rounded-2xl">
        <h3>Active</h3>
        <p className="text-3xl font-bold">
          {active}
        </p>
      </div>

      <div className="bg-blue-50 p-5 rounded-2xl">
        <h3>Total Revenue</h3>
        <p className="text-3xl font-bold">
          ₹{revenue}
        </p>
      </div>
    </div>
  );
}