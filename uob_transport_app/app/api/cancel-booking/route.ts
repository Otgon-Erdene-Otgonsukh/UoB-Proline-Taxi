import { NextRequest } from "next/server";
// import { loginRequired } from '../utils/login'
import { cancelBookingsAccess } from "@/backend/access/booking_access";

export async function POST(request: NextRequest) {
  // const userDetail = await loginRequired(request)
  // if (!userDetail) {
  //   return new Response(JSON.stringify({
  //     message: 'login required'
  //   }), {
  //     status: 201,
  //     headers: { 'Content-Type': 'application/json' },
  //   })
  // }

  const requestJson = await request.json()
  const bookingId = requestJson['bookingId']

  try {
    await cancelBookingsAccess(bookingId)
    return new Response(JSON.stringify({
      message: 'update success'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error canceling booking:', error);
    return new Response(JSON.stringify({
      message: 'update failed, please try again later'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }

}