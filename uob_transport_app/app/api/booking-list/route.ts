import { NextRequest } from "next/server";
import { getUserBookingsAccess, getUserBookingsCountAccess } from "@/backend/access/booking_access";
import { auth } from "@/auth";
import { isAdmin } from "@/backend/access/user_access";

export async function GET(
  request: NextRequest,
) {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({
      message: 'login required'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  const searchParams = request.nextUrl.searchParams;

  const page = searchParams.get('page');
  const pageSize = searchParams.get('pageSize');
  const from = (searchParams.get('from') !== null && searchParams.get('from') !== "") ? searchParams.get('from')! : undefined;
  const to = (searchParams.get('to') !== null && searchParams.get('to') !== "") ? searchParams.get('to')! : undefined;
  const bookingStatus = (searchParams.get('bookingStatus') !== null && searchParams.get('bookingStatus') !== "") ? searchParams.get('bookingStatus')! : undefined;
  const pickUpTimeFrom = (searchParams.get('pickUpTimeFrom') !== null && searchParams.get('pickUpTimeFrom') !== "") ? searchParams.get('pickUpTimeFrom')! : undefined;
  const pickUpTimeTo = (searchParams.get('pickUpTimeTo') !== null && searchParams.get('pickUpTimeTo') !== "") ? searchParams.get('pickUpTimeTo')! : undefined;
  if (page && pageSize) {
    const bookings = await getUserBookingsAccess(await isAdmin(session.user.user_id) ? -1 : session.user.user_id, parseInt(page), parseInt(pageSize), {
      from,
      to,
      bookingStatus,
      pickUpTimeFrom,
      pickUpTimeTo,
    })

    const totalNum = await getUserBookingsCountAccess(await isAdmin(session.user.user_id) ? -1 : session.user.user_id, {
      from,
      to,
      bookingStatus,
      pickUpTimeFrom,
      pickUpTimeTo,
    })

    return new Response(JSON.stringify({
      bookings,
      totalNum,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response(JSON.stringify({ message: 'page params needed' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
