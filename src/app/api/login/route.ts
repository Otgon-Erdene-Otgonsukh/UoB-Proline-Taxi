import { searchUserAccess, updateUserTokenAccess } from "@/backend/access/user_access";
import { NextRequest } from "next/server";
import { User } from '@/generated/prisma/browser';
import { uuid } from "@/backend/utils/uuid";

export async function GET(
  request: NextRequest,
) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  return new Response(JSON.stringify({ id, name: `User ${id}` }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: Request,) {
  const body = await request.json()

  const { email, password } = body;

  const userDetail: User | null = await searchUserAccess(email);

  // need encryption
  if (userDetail && userDetail.password === password) {
    const token = uuid()
    updateUserTokenAccess(email, token)
    return new Response(JSON.stringify({
      message: 'login success',
      token: token
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response(JSON.stringify({
      message: 'login failed'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
