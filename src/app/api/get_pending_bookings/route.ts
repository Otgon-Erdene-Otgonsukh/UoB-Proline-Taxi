import getPendingBookings from "@/backend/pending_bookings/get_pending_bookings";
import { NextResponse } from "next/server";

// Handle BigInt serialization
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET() {
  try {
    const pendingBookings = await getPendingBookings();
    return NextResponse.json(pendingBookings, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "There was a problem fetching bookings." },
      { status: 500 }
    );
  }
}
