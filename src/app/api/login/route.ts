import { userLogin } from "@/backend/app/user";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id'); // e.g. `/api/search?query=hello`
  // e.g. Query a database for user with ID `id`
  return new Response(JSON.stringify({ id, name: `User ${id}` }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: Request,) {
  const body = await request.json()

  const { email, password } = body;

  const toReturn = await userLogin(email, password)

  return new Response(JSON.stringify(toReturn), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
