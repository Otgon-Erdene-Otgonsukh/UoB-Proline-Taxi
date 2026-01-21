import { NextRequest } from "next/server";
import { cancelBookingsAccess, getBookingDetails } from "@/backend/access/booking_access";
import { auth } from "@/auth";
import { isAdmin } from "@/backend/access/user_access";

export async function POST(request: NextRequest) {
  const requestJson = await request.json()
  const bookingId = requestJson['bookingId']

  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({
      message: 'login required'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Checks the user is allowed to update the booking.
  try {
    let booking = null;
    if (await isAdmin(session.user.user_id)) {
      // If the user is an admin, they can delete the booking without ownership, but it still needs to exist.
      booking = await getBookingDetails(-1, bookingId) // -1 bypasses user check.
    } else {
      // User is not an admin, verify ownership of the booking.
      booking = await getBookingDetails(session.user.user_id, bookingId)
    }

    if (booking === null) {
        return new Response(JSON.stringify({
          message: 'Booking not found'
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  } catch (error) {
    console.error('Error fetching booking details:', error);
    return new Response(JSON.stringify({
      message: 'Error fetching booking details'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await cancelBookingsAccess(bookingId)
    return new Response(JSON.stringify({
      message: 'update success'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error canceling booking:', error);
    return new Response(JSON.stringify({
      message: 'update failed, please try again later'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }

}