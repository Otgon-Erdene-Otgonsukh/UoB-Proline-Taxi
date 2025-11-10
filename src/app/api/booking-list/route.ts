import { NextRequest } from "next/server";
import { loginRequired } from '../utils/login'
import { getUserBookings } from "@/backend/access/booking_access";

export async function GET(
  request: NextRequest,
) {
  const userDetail = await loginRequired(request)
  if (!userDetail) {
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
    const bookings = await getUserBookings(userDetail.user_id, parseInt(page), parseInt(pageSize))

    return new Response(JSON.stringify({
      bookings
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
