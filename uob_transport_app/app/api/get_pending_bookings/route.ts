import getPendingBookings from "@/backend/pending_bookings/get_pending_bookings";
import { NextResponse } from "next/server";


export async function GET() {
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
