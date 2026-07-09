import { useEffect } from "react";

import CustomerStats
from "../components/CustomerStats";

import CustomerTable
from "../components/CustomerTable";

import {
  useCustomerStore,
} from "../store/customerStore";

export default function Customers() {
  const {
    customers,
    loading,
    fetchCustomers,
  } = useCustomerStore();

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">
          Customer Management
        </h1>

        <p className="text-slate-500">
          All registered customers
        </p>
      </div>

      <CustomerStats
        customers={customers}
      />

      <CustomerTable
        customers={customers}
      />
    </div>
  );
}