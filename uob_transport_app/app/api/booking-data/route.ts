import { PrismaClient } from "@/generated/prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const totalBookings = await prisma.booking.count({
      where: {
        booking_status: { not: "Cancelled" },
      },
    });

    const pendingBookings = await prisma.booking.count({
      where: {
        booking_status: "Pending",
      },
    });

    const approvedBookings = await prisma.booking.count({
      where: {
        booking_status: "Approved",
      },
    });

    const rejectedBookings = await prisma.booking.count({
      where: {
        booking_status: "Rejected",
      },
    });

    const overdueBookings = await prisma.trip.count({
      where: {
        pickup_time: {
          lt: new Date(),
        },
        booking: {
          booking_status: "Pending",
        },
      },
    });
    return NextResponse.json(
      {
        total: totalBookings,
        pending: pendingBookings,
        approved: approvedBookings,
        rejected: rejectedBookings,
        overdue: overdueBookings,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("There was error fetching booking data", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 },
    );
  }
}
