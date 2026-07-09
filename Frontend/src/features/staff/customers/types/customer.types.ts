export interface ManagerCustomer {
  _id: string;
  name: string;
  email: string;
  phone: string;

  totalBookings: number;
  totalSpent: number;

  status: "ACTIVE" | "BLOCKED";

  createdAt: string;
}