import getPendingBookings from "@/backend/pending_bookings/get_pending_bookings";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  // Ensure user is logged in.
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({
      message: 'login required'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // TODO: Add admin check / privilege check here later, these are currently not done.
  // All logged in users can currently view pending bookings.

  try {
    const pendingBookings = await getPendingBookings();
    return NextResponse.json(pendingBookings, { status: 200 });
  } catch (error) {
    console.error("There was an error fetching pending bookings.", error);
    return NextResponse.json(
      { error: "There was a problem fetching bookings." },
      { status: 500 }
    );
  }
}
