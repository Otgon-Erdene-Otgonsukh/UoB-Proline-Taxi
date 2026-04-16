import updateStatus from "@/backend/update_booking_status/update_status";
import { NextResponse } from "next/server";
import { getBookingDetails } from "@/backend/access/booking_access";
import { auth } from "@/auth";
import { isAdmin, isFinanceStaff } from "@/backend/access/user_access";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({
      message: 'login required'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.json();
    const bookingId: number = body.bookingId;
    let booking = null;

    // Check if the logged in user is an Admin or Finance staff
    if (await isAdmin(session.user.user_id) || await isFinanceStaff(session.user.user_id)) {
      booking = await getBookingDetails(-1, bookingId)
    }

    if (booking === null) {
      return new Response(JSON.stringify({
        success: false, message: 'Booking not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newStatus: string = body.newStatus;
    const poNumber: string = body.po;

    await updateStatus(bookingId, newStatus, poNumber);

    return NextResponse.json(
      { success: true, message: "Booking status updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error("There was an error when updating bookings.", error);
    return NextResponse.json(
      { success: false, error: "Failed to update booking status" },
      { status: 400 }
    );
  }
}