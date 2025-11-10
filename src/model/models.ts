export type BookingLocation = {
  name: string;
  latitude: string;
  longitude: string;
}

export type BookingStatusStr = 'Approve' | 'Pending' | 'Rejected'

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
}

export type BookingRecord = {
  id: number;
  time_created: string;
  trip: Trip;
  booking_status: 0 | 1 | 2;
  BookingStatusStr?: BookingStatusStr
}

export function bookingStatusMap(bookingStatus: number): BookingStatusStr {
  switch (bookingStatus) {
    case 0:
    default:
      return 'Pending';
    case 1:
      return 'Approve';
    case 2:
      return 'Rejected';
  }
}
