import { getPendingBookings, getPendingBookingsCount } from "@/backend/pending_bookings/get_pending_bookings";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";


export async function GET(request: NextRequest,) {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({
      message: 'login required'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const searchParams = request.nextUrl.searchParams;

  const page = searchParams.get('page');
  const pageSize = searchParams.get('pageSize');
  const from = (searchParams.get('from') !== null && searchParams.get('from') !== "") ? searchParams.get('from')! : undefined;
  const to = (searchParams.get('to') !== null && searchParams.get('to') !== "") ? searchParams.get('to')! : undefined;
  const passengerName = (searchParams.get('passengerName') !== null && searchParams.get('passengerName') !== "") ? searchParams.get('passengerName')! : undefined;
  const pickUpTimeFrom = (searchParams.get('pickUpTimeFrom') !== null && searchParams.get('pickUpTimeFrom') !== "") ? searchParams.get('pickUpTimeFrom')! : undefined;
  const pickUpTimeTo = (searchParams.get('pickUpTimeTo') !== null && searchParams.get('pickUpTimeTo') !== "") ? searchParams.get('pickUpTimeTo')! : undefined;
  const isFlight = (searchParams.get('isFlight') === 'true');
  const total = searchParams.get('total') === 'true';
  const status = searchParams.get('status') === 'true';
  const overdue = searchParams.get('overdue') === 'true';

  if (!page || !pageSize) {
    return new Response(JSON.stringify({ message: 'page params needed' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // TODO: Add admin check / privilege check here later, these are currently not done.
  // All logged in users can currently view pending bookings.
  // This part of logic is not clear for now. Isn't it to be the department manager who can view and approve pending bookings?

  try {
    const pendingBookings = await getPendingBookings(parseInt(page), parseInt(pageSize), {
      from,
      to,
      passengerName,
      pickUpTimeFrom,
      pickUpTimeTo,
      isFlight,
      total,
      status,
      overdue
    });

    const totalNum = await getPendingBookingsCount({
      from,
      to,
      passengerName,
      pickUpTimeFrom,
      pickUpTimeTo,
      isFlight,
      total,
      status,
      overdue
    });
    return NextResponse.json({ pendingBookings, totalNum }, { status: 200 });
  } catch (error) {
    console.error("There was an error fetching pending bookings.", error);
    return NextResponse.json(
      { error: "There was a problem fetching bookings." },
      { status: 500 }
    );
  }
}
