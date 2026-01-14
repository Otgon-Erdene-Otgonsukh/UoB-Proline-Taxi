export type BookingLocation = {
  name: string;
  latitude: string;
  longitude: string;
}

export type BookingStatusStr = 'Approved' | 'Pending' | 'Rejected'

export type Trip = {
  trip_id: number;
  icabbi_booking_id?: number;
  pickup_location: string;
  pickup_latitude: number;
  pickup_longitude: number;
  dropoff_location: string;
  dropoff_latitude: number;
  dropoff_longitude: number;
  pickup_time?: string;
  passenger_num: number;
  via: string;
  return_drop_loc: string;
  PO: string;
  airport: string;
  flight_num: string;
}

export type BookingRecord = {
  booking_id: number;
  additional_info: string;
  time_created: string;
  trip: Trip;
  booking_status: 'Approved' | 'Pending' | 'Rejected' | 'Cancelled';
}

export const departments = [
  "Centre for Academic Language and Development",
  "Centre for Innovation and Entrepreneurship",
  "Arts",
  "Economics",
  "Education",
  "Humanities",
  "Modern Languages",
  "Policy Studies",
  "Sociology, Politics and International Studies",
  "Business",
  "Law",
  "Dental",
  "Medical",
  "Veterinary",
  "Health Professions Education",
  "Anatomy",
  "Biochemistry",
  "Biological Sciences",
  "Cellular and Molecular Medicine",
  "Physiology, Pharmacology and Neuroscience",
  "Psychological Science",
  "Chemistry",
  "Civil, Aerospace, and Design Engineering",
  "Computer Science",
  "Earth Sciences",
  "Electrical, Electronic and Mechanical Engineering",
  "Engineering Mathematics and Technology",
  "Geographical Sciences",
  "Mathematics",
  "Physics",
];

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
