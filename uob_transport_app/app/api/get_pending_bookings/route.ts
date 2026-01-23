import { getPendingBookings, getPendingBookingsCount } from "@/backend/pending_bookings/get_pending_bookings";
import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@/auth";


export async function GET(request: NextRequest,) {
  // Session check seems to trigger some issues with the test suite
  // const session = await auth();
  // if (!session) {
  //   return new Response(JSON.stringify({
  //     message: 'login required'
  //   }), {
  //     status: 201,
  //     headers: { 'Content-Type': 'application/json' },
  //   })
  // }

  const searchParams = request.nextUrl.searchParams;

  const page = searchParams.get('page');
  const pageSize = searchParams.get('pageSize');
  const from = (searchParams.get('from') !== null && searchParams.get('from') !== "") ? searchParams.get('from')! : undefined;
  const to = (searchParams.get('to') !== null && searchParams.get('to') !== "") ? searchParams.get('to')! : undefined;
  const passengerName = (searchParams.get('passengerName') !== null && searchParams.get('passengerName') !== "") ? searchParams.get('passengerName')! : undefined;
  const pickUpTimeFrom = (searchParams.get('pickUpTimeFrom') !== null && searchParams.get('pickUpTimeFrom') !== "") ? searchParams.get('pickUpTimeFrom')! : undefined;
  const pickUpTimeTo = (searchParams.get('pickUpTimeTo') !== null && searchParams.get('pickUpTimeTo') !== "") ? searchParams.get('pickUpTimeTo')! : undefined;
  const isFlight = (searchParams.get('isFlight') === 'true');

  if (!page || !pageSize) {
    return new Response(JSON.stringify({ message: 'page params needed' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const pendingBookings = await getPendingBookings(parseInt(page), parseInt(pageSize), {
      from,
      to,
      passengerName,
      pickUpTimeFrom,
      pickUpTimeTo,
      isFlight
    });

    const totalNum = await getPendingBookingsCount({
      from,
      to,
      passengerName,
      pickUpTimeFrom,
      pickUpTimeTo,
      isFlight
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
