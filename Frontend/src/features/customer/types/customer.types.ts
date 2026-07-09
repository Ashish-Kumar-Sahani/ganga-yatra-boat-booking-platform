export interface WalletData {
  balance: number;
  rewardPoints: number;
  totalSpent: number;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  _id: string;
  userId: string;
  amount: number;
  type: "CREDIT" | "DEBIT" | "REFUND";
  purpose: "RECHARGE" | "BOOKING_PAYMENT" | "REFUND" | "CASHBACK";
  bookingId?: string | null;
  title: string;
  description: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  customerId: string;
  bookingId: string;
  boatId: {
    _id: string;
    boatName: string;
    boatNumber: string;
    boatType: string;
    capacity: number;
    image?: string | null;
  };
  rating: number;
  boatRating: number;
  captainRating: number;
  tripRating: number;
  ownerRating: number;
  comment: string;
  images: string[];
  createdAt: string;
}

export interface LiveTripDetails {
  bookingId: string;
  bookingCode?: string;
  boatName: string;
  boatNumber: string;
  routeName: string;
  eta: string;
  currentLocation: string;
  status: string;
  currentLat: number;
  currentLng: number;
  captainName: string;
  captainPhone: string;
  passengers: number;
}
