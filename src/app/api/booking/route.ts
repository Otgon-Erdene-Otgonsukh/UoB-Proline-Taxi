import { NextResponse } from 'next/server';
// import prisma client here to query the database

export async function GET() {
  return NextResponse.json({ message: 'Hello from Next.js API!' });
  // get booking details form users and booking table to display at the home page list of bookings 
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ received: body });
  // add bookings to the bookings table
}
