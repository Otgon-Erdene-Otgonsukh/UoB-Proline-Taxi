import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export default async function createBooking(
    userID : number,
    pickupLocation : string,
    pickupLatitude : number | null,
    pickupLongitude : number | null,
    dropoffLocation : string, dropoffLatitude: number | null, dropoffLongitude: number | null,
    pickupTime : Date
)
{
    // Create a trip for the booking to be bound to.
    const trip = await prisma.trip.create({
        data: {
            icabbi_booking_id: null, // Dependent on API added later.
            pickup_location: pickupLocation,
            pickup_latitude: pickupLatitude,
            pickup_longitude: pickupLongitude,
            dropoff_location: dropoffLocation,
            dropoff_latitude: dropoffLatitude,
            dropoff_longitude: dropoffLongitude,
            pickup_time: pickupTime,
        }
    });

    // Create a booking entry.
    const booking = await prisma.booking.create({
        data: {
            user_id: userID,
            trip_id: trip.trip_id,
            time_created: new Date(), // Set as current date/time.
            booking_status: "Pending",
        },
    });
}