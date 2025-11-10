import { searchUserAccess, updateUserTokenAccess } from "@/backend/access/user_access";
import { User } from '@/generated/prisma/browser';
import { uuid } from "@/backend/utils/uuid";

export async function POST(request: Request) {
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
