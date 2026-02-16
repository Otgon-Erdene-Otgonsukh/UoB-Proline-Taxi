import type {
  booking,
  trip,
  User,
  department,
} from "@/generated/prisma/client"; // importing just the type is safe and does not expose any prisma code

export type BookingWithTrip = booking & {
  // creating a custom type to access the data
  trip: trip;
  User: User;
  department: department;
};

export type BookingData = {
  total: number,
  pending: number,
  approved: number,
  rejected: number,
  overdue: number
}