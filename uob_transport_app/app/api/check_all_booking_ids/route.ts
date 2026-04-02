import prisma from "@/utils/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  const from = data.from ? data.from : undefined;
  const to = data.to ? data.to : undefined;
  const pickUpTimeFrom = data.pickUpTimeFrom ? data.pickUpTimeFrom : undefined;
  const pickUpTimeTo = data.pickUpTimeTo ? data.pickUpTimeTo : undefined;
  const bookingStatus = data.bookingStatus ? data.bookingStatus : undefined;

  // build up prisma query
  const query: { [key: string]: string | number | object } = {};

  if (from !== undefined) {
    query["trip"] = {
      pickup_location: {
        contains: from.trim(),
        mode: "insensitive",
      },
    };
  }

  if (to !== undefined) {
    query["trip"] = {
      ...(query["trip"] as object),
      dropoff_location: {
        contains: to.trim(),
        mode: "insensitive",
      },
    };
  }

  if (pickUpTimeFrom !== undefined && pickUpTimeTo !== undefined) {
    const toDate = new Date(pickUpTimeTo);
    toDate.setUTCHours(23, 59, 59, 999);

    query["trip"] = {
      ...(query["trip"] as object),
      pickup_time: {
        gte: new Date(pickUpTimeFrom),
        lte: toDate,
      },
    };
  } else if (pickUpTimeFrom !== undefined) {
    query["trip"] = {
      ...(query["trip"] as object),
      pickup_time: {
        gte: new Date(pickUpTimeFrom),
      },
    };
  } else if (pickUpTimeTo !== undefined) {
    const toDate = new Date(pickUpTimeTo);
    toDate.setUTCHours(23, 59, 59, 999);

    query["trip"] = {
      ...(query["trip"] as object),
      pickup_time: {
        lte: toDate,
      },
    };
  }

  if (bookingStatus !== undefined) {
    query["booking_status"] = bookingStatus;
  } else {
    query["booking_status"] = {
      in: ["Approved", "Pending"],
    };
  }

  try {
    const bookingIds = await prisma.booking.findMany({
      where: {
        ...query,
      },
      select: {
        booking_id: true,
      },
    });

    const cleaned = bookingIds.map((e) => e.booking_id);

    return NextResponse.json(cleaned, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "There was a problem fetching booking ids" },
      { status: 500 },
    );
  }
}
