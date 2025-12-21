import updateStatus from "@/backend/update_booking_status/update_status";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const bookingId: number = body.bookingId;
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
      { status: 500 }
    );
  }
}
