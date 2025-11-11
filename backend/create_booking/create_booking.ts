import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export default async function createBooking(
    userID : number,
    pickupLocation : string,
    pickupLatitude : number | null,
    pickupLongitude : number | null,
    dropoffLocation : string, dropoffLatitude: number | null, dropoffLongitude: number | null,
    pickupTime : Date,
    first_name : string,
    surname : string,
    email: string,
    tel_number: string,
    additional_info: string
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
            pickup_time: pickupTime
        }
    });

    // Create a booking entry.
    const booking = await prisma.booking.create({
        data: {
            user_id: userID,
            trip_id: trip.trip_id,
            time_created: new Date(), // Current date/time.
            booking_status: "Pending",
            first_name: first_name,
            surname: surname,
            email: email,
            tel_number: tel_number,
            additional_info: additional_info
        }
    });
}