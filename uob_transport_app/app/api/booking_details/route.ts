// Return all details about a booking.
import { auth } from "@/auth";
import { getBookingDetails, getTripDetails } from "@/backend/access/booking_access";
import { isAdmin } from "@/backend/access/user_access";

export async function GET(request: Request) {
    // Check if user is signed in.
    const session = await auth();
    if (!session) {
        return new Response(
            JSON.stringify({
                message: "login required",
            }),
            {
                status: 401,
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    // Validation
    // Check that search parameter exists.
    const searchParams = new URL(request.url).searchParams;
    const bookingID = searchParams.get("id");
    if (!bookingID) {
        return new Response(
            JSON.stringify({
                message: "Invalid query parameters.",
            }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            },
        );
    // Check if ID is an integer.
    } else if (isNaN(Number(bookingID))) {
        return new Response(
            JSON.stringify({
                message: "ID is not an integer.",
            }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    try {
        const bookingDetails = await getBookingDetails(await isAdmin(session.user.user_id) ? -1 : session.user.user_id, Number(bookingID));

        // Booking does not exist or does not belong to user.
        if (bookingDetails == null) {
            return new Response(
                JSON.stringify({
                    message: "Booking not found.",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                },
            );
        };

        const tripDetails = await getTripDetails(Number(bookingDetails.trip_id));
        // Should never happen, but just in case booking does not have any trips.
        if (tripDetails == null) {
            return new Response(
                JSON.stringify({
                    message: "Trip details not found.",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        // Combine trip into booking details response, and parse strings from DB into JSON
        tripDetails.pickup_location = JSON.parse(tripDetails?.pickup_location || "null");
        tripDetails.dropoff_location = JSON.parse(tripDetails?.dropoff_location || "null");
        tripDetails.via = tripDetails?.via ? JSON.parse(tripDetails.via) : [];
        tripDetails.return_drop_loc = JSON.parse(tripDetails?.return_drop_loc || "null");
        const response = {...bookingDetails, trip: tripDetails};
        return new Response(
            JSON.stringify(response),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            },
        );
    } catch (error) {
        return new Response(
        JSON.stringify({
            message: "Error fetching booking details.",
        }),
        {
            status: 500,
            headers: { "Content-Type": "application/json" },
        },
        );
    }
}