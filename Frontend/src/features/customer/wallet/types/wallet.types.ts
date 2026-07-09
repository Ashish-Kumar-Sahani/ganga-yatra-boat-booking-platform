export interface WalletData {
  balance: number;
  rewardPoints: number;
  totalSpent: number;
}

export interface WalletTransaction {
  _id: string;
  userId: string;
  type: "CREDIT" | "DEBIT" | "REFUND";
  amount: number;
  purpose: "RECHARGE" | "ADD_MONEY" | "BOOKING_PAYMENT" | "REFUND" | "CASHBACK";
  status: "PENDING" | "SUCCESS" | "FAILED";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  bookingId?: string;
  title: string;
  description: string;
  createdAt: string;
}
