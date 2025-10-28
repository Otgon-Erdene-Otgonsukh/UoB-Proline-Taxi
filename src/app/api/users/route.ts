import { NextResponse } from 'next/server';
//import prisma client here to query the database

export async function GET() {
  return NextResponse.json({ message: 'Hello from Next.js API!' });
  // get user details for login
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ received: body });
  // update user details (forgot password flow)
}
