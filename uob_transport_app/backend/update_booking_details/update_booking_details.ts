import prisma from '@/utils/client';
import { formLocation } from "@/model/models";

export default async function updateBooking(
    bookingId: number,
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
    airport: formLocation,
    flight_num: string
) {
    // Check if booking exists.
    const booking = await prisma.booking.findUnique({
        where: {
            booking_id: bookingId
        }
    });

    if (!booking) {
        throw new Error("Booking not found");
    }

    // Update the data within the trip if necessary.
    await prisma.trip.update({
        where: {
            trip_id: booking.trip_id // Assuming bookingId corresponds to trip_id
        },
        data: {
            pickup_location: JSON.stringify(pickupLocation),
            dropoff_location: JSON.stringify(dropoffLocation),
            pickup_time: pickupTime,
            return_pickup_time: returnDT ? returnDT : null,
            via: JSON.stringify(via),
            passenger_num: passenger_num,
            return_drop_loc: JSON.stringify(returnTo),
            airport: JSON.stringify(airport),
            flight_num: flight_num
        }
    });

    // Update the booking data.
    await prisma.booking.update({
        where: {
            booking_id: bookingId
        },
        data: {
            booking_status: "Pending", // Always reset to pending if updated ready for re-approval.
            passenger_name: passengerName ? passengerName : booking.passenger_name,
            email: email ? email : booking.email,
            tel_number: tel_number ? tel_number : booking.tel_number,
            additional_info: additional_info ? additional_info : booking.additional_info,
        }
    });
}