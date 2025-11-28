import { searchUserAccess } from "@/backend/access/user_access";
import { User } from '@/generated/prisma/browser';

export async function POST(request: Request) {
  const body = await request.json()

  const { email, password } = body;

  const userDetail: User | null = await searchUserAccess(email);

  // need encryption
  if (userDetail && userDetail.password === password) {
    return new Response(JSON.stringify({
      message: 'login success',
      username: userDetail.username
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response(JSON.stringify({
      message: 'login failed'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
