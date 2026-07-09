export interface SearchResultUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  profileImage?: string;
}

export interface SearchResultBoat {
  _id: string;
  boatName: string;
  boatNumber: string;
  boatType: string;
  ownerId?: {
    name: string;
    email: string;
  };
}

export interface SearchResultBooking {
  _id: string;
  bookingCode: string;
  passengerName: string;
  passengerPhone: string;
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
}

export interface SearchResultRoute {
  _id: string;
  cityId?: {
    name: string;
  };
  sourceGhatId?: {
    name: string;
  };
  destinationGhatId?: {
    name: string;
  };
  distanceKm: number;
  baseFare: number;
}

export interface SearchResultCity {
  _id: string;
  name: string;
  state: string;
  riverName: string;
}

export interface SearchResultPermit {
  _id: string;
  permitNumber: string;
  permitType: string;
  boatId?: {
    boatName: string;
    boatNumber: string;
  };
  status: string;
}

export interface SearchResultOffer {
  _id: string;
  code: string;
  discountType: string;
  discountValue: number;
}

export interface SearchResultNotification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
}

export interface GroupedSearchResults {
  users: SearchResultUser[];
  owners: SearchResultUser[];
  staff: SearchResultUser[];
  boats: SearchResultBoat[];
  bookings: SearchResultBooking[];
  routes: SearchResultRoute[];
  cities: SearchResultCity[];
  permits: SearchResultPermit[];
  offers: SearchResultOffer[];
  notifications: SearchResultNotification[];
}
