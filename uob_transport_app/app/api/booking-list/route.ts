import { NextRequest } from "next/server";
import { getUserBookingsAccess, getUserBookingsCountAccess } from "@/backend/access/booking_access";
import { auth } from "@/auth";

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

  if (page && pageSize) {
    const bookings = await getUserBookingsAccess(session.user.user_id, parseInt(page), parseInt(pageSize))

    const totalNum = await getUserBookingsCountAccess(session.user.user_id)

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
