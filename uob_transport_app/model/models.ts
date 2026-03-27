import { department } from "@/generated/prisma/client";

export type location = {
  short_name: string;
  address: string;
  lat: number;
  lng: number;
}

export type formLocation = location | null;

export type BookingStatusStr = 'Approved' | 'Pending' | 'Rejected'

export type Trip = {
  trip_id: number;
  icabbi_booking_id?: number;
  pickup_location: location;
  dropoff_location: location;
  dropoff_latitude: number;
  dropoff_longitude: number;
  pickup_time?: string;
  return_pickup_time: string,
  passenger_num: number;
  via: location[];
  return_drop_loc: location;
  PO: string;
  airport: location;
  flight_num: string;
  price: number;
}

export type BookingRecord = {
  booking_id: number;
  additional_info: string;
  time_created: string;
  trip: Trip;
  trip_id: number;
  booking_status: 'Approved' | 'Pending' | 'Rejected' | 'Cancelled';
  via: location[];
  dep_id: number;
  passenger_name: string;
  tel_number: string;
  email: string;
  airport: location;
}

// Attach common locations as keys to hashmapped Lat/Lon for routing.
export type commonLoc = { [key: string]: { lat: number; lng: number; address: string } };
export const commonLocations: commonLoc = {
  "Queens Building": { "lat": 51.456890, "lng": -2.601892, address: "Faculty of Engineering, University Walk, Tyndall's Park, Cotham, Bristol, City of Bristol, West of England, England, BS8 1TR, United Kingdom" },
  "Merchant Venturers Building": { "lat": 51.456111, "lng": -2.602830, address: "Merchant Venturers Building, 75, Woodland Road, Tyndall's Park, Cotham, Bristol, City of Bristol, West of England, England, BS8 1UB, United Kingdom" },
  "Richmond Building": { "lat": 51.456996, "lng": -2.613267, address: "Bristol University Student Union, Queen's Road, Clifton Village, Clifton, Bristol, City of Bristol, West of England, England, BS8 1LN, United Kingdom" },
  "Victoria Rooms": { "lat": 51.458173, "lng": -2.609358, address: "Victoria Rooms, Whiteladies Road, Tyndall's Park, Clifton, Bristol, City of Bristol, West of England, England, BS8 2PY, United Kingdom" },
  "Wills Memorial Building": { "lat": 51.455927, "lng": -2.604696, address: "Wills Memorial Building, Queen's Road, Tyndall's Park, City Centre, Bristol, City of Bristol, West of England, England, BS8 1RJ, United Kingdom" },
  "Physics Laboratory": { "lat": 51.4585453, "lng": -2.6021440, address: "H.H. Wills Physics Laboratory, Tyndall Avenue, Tyndall's Park, Cotham, Bristol, City of Bristol, West of England, England, BS8 1TL, United Kingdom" },
};

export function bookingStatusMap(bookingStatus: number): BookingStatusStr {
  switch (bookingStatus) {
    case 0:
    default:
      return 'Pending';
    case 1:
      return 'Approved';
    case 2:
      return 'Rejected';
  }
}

export type UserRecord = {
  time_created: string;
  user_id: number;
  department: department;
  email: string;
  full_name: string;
  phone_number: string;
  role: string;
  user_status: number;
}

export type DepartmentRecord = {
  depId: number;
  depName: string;
  manager?: {
    time_created: string;
    user_id: number;
    email: string;
    full_name: string;
    phone_number: string;
    role: string;
    user_status: number;
  };
  userCount: number;
}

export type MonthlyBookingData = {
  month: string,
  count: number
}

export type DepartmentRevenue = {
  department: string,
  bookingCount: number,
  priceTotal: number
}

export type SuperCardData = {
  totalUser: number,
  totalBooking: number,
  pendingUser: number,
  priceRequired: number
}

export type SuperData = {
  cardData: SuperCardData,
  lineGraph: MonthlyBookingData[],
  barGraph: DepartmentRevenue[]
}

export const UNASSIGNED_DEPARTMENT_ID = 14;
export type NormalBookings = {
  booking_status: string
  trip: {
    pickup_location: location,
    via: location[] | null,
    dropoff_location: location,
    pickup_time: Date,
  }
}

export type NormalDashboardData = {
  recentBookings: NormalBookings[],
  totalBookings: number,
  totalPrice: number,
  upcomingBookings: number
}

export const USER_ROLE = {
  NORMAL_USER: 'normal_user',
  FINANCE_STAFF: 'finance_staff',
  SUPER_ADMIN: 'super_admin',
}
