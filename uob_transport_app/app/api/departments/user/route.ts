import { NextRequest } from "next/server";
import { getUsersByDepIdAccess } from "@/backend/access/user_access";

export async function GET(request: NextRequest) {
  // TODO Check super admin

  const getParams = request.nextUrl.searchParams;
  const depId = getParams.get('depId') || undefined

  if (depId === undefined) {
    return new Response(JSON.stringify({ error: 'Department ID is required' }), { status: 400 });
  }

  const userList = await getUsersByDepIdAccess(parseInt(depId))


  return new Response(JSON.stringify(userList), { status: 200 });

}