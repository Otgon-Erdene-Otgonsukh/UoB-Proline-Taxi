import prisma from "@/utils/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDepartmentIdfromUserId } from "@/backend/access/departments_access";

export async function GET() {
  const session = await auth();
  let depId;
  if (session) {
    depId = await getDepartmentIdfromUserId(session.user.user_id);
  }

  try {
    const totalBookings = await prisma.booking.count({
      where: {
        booking_status: { not: "Cancelled" },
        dep_id: depId?.dep_id ?? -1,
      },
    });

    const pendingBookings = await prisma.booking.count({
      where: {
        booking_status: "Pending",
        dep_id: depId?.dep_id ?? -1,
      },
    });

    const approvedBookings = await prisma.booking.count({
      where: {
        booking_status: "Approved",
        dep_id: depId?.dep_id ?? -1,
      },
    });

    const rejectedBookings = await prisma.booking.count({
      where: {
        booking_status: "Rejected",
        dep_id: depId?.dep_id ?? -1,
      },
    });

    const overdueBookings = await prisma.trip.count({
      where: {
        pickup_time: {
          lt: new Date(),
        },
        booking: {
          booking_status: "Pending",
          dep_id: depId?.dep_id ?? -1,
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
