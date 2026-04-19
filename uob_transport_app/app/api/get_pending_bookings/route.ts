import {
  getPendingBookings,
  getPendingBookingsCount,
} from "@/backend/pending_bookings/get_pending_bookings";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdmin, isFinanceStaff } from "@/backend/access/user_access";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return new Response(
      JSON.stringify({ message: "login required" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Only admins and finance staff can view pending bookings
  const userId = session.user.user_id;
  if (!await isAdmin(userId) && !await isFinanceStaff(userId)) {
    return new Response(
      JSON.stringify({ message: "Forbidden" }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const searchParams = request.nextUrl.searchParams;

  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");
  const from =
    searchParams.get("from") !== null && searchParams.get("from") !== ""
      ? searchParams.get("from")!
      : undefined;
  const to =
    searchParams.get("to") !== null && searchParams.get("to") !== ""
      ? searchParams.get("to")!
      : undefined;
  const passengerName =
    searchParams.get("passengerName") !== null &&
    searchParams.get("passengerName") !== ""
      ? searchParams.get("passengerName")!
      : undefined;
  const pickUpTimeFrom =
    searchParams.get("pickUpTimeFrom") !== null &&
    searchParams.get("pickUpTimeFrom") !== ""
      ? searchParams.get("pickUpTimeFrom")!
      : undefined;
  const pickUpTimeTo =
    searchParams.get("pickUpTimeTo") !== null &&
    searchParams.get("pickUpTimeTo") !== ""
      ? searchParams.get("pickUpTimeTo")!
      : undefined;
  const isFlight = searchParams.get("isFlight") === "true";
  const total = searchParams.get("total") === "true";
  const status = searchParams.get("status") === "true";
  const overdue = searchParams.get("overdue") === "true";
  const price = searchParams.get("price") === "true";
  const withoutPrice = searchParams.get("withoutPrice") === "true";

  if (!page || !pageSize) {
    return new Response(JSON.stringify({ message: "page params needed" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const pendingBookings = await getPendingBookings(
      parseInt(page),
      parseInt(pageSize),
      {
        from,
        to,
        passengerName,
        pickUpTimeFrom,
        pickUpTimeTo,
        isFlight,
        total,
        status,
        overdue,
        price,
        withoutPrice,
      },
    );

    const totalNum = await getPendingBookingsCount({
      from,
      to,
      passengerName,
      pickUpTimeFrom,
      pickUpTimeTo,
      isFlight,
      total,
      status,
      overdue,
      price,
      withoutPrice,
    });

    return NextResponse.json({ pendingBookings, totalNum }, { status: 200 });
  } catch (error) {
    console.error("There was an error fetching pending bookings.", error);
    return NextResponse.json(
      { error: "There was a problem fetching bookings." },
      { status: 500 },
    );
  }
}