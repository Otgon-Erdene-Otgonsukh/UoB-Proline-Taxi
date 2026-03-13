import prisma from '@/utils/client';
import { formLocation } from "@/model/models";

export default async function createBooking(
    userID: number,
    pickupLocation: formLocation,
    dropoffLocation: formLocation,
    pickupTime: Date,
    returnDT: Date | undefined,
    passengerName: string,
    email: string,
    tel_number: string,
    additional_info: string,
    via: formLocation[],
    returnTo: formLocation | undefined,
    passenger_num: number,
    airport: string,
    flight_num: string,
    dep_id: number
) {
    // Create a trip for the booking to be bound to.
    const trip = await prisma.trip.create({
        data: {
            icabbi_booking_id: null, // Dependent on API added later.
            pickup_location: JSON.stringify(pickupLocation),
            dropoff_location: JSON.stringify(dropoffLocation),
            pickup_time: pickupTime,
            return_pickup_time: returnDT ? returnDT : null,
            via: JSON.stringify(via),
            passenger_num: passenger_num,
            return_drop_loc: JSON.stringify(returnTo),
            airport: airport,
            flight_num: flight_num
        }
    });

    // Create a booking entry.
    await prisma.booking.create({
        data: {
            user_id: userID,
            trip_id: trip.trip_id,
            time_created: new Date(), // Current date/time.
            booking_status: "Pending",
            passenger_name: passengerName,
            email: email,
            tel_number: tel_number,
            additional_info: additional_info,
            dep_id: dep_id,
        }
    });
}