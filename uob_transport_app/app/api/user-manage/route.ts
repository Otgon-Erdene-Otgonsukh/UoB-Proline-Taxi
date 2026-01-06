import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { auth } from "@/auth";
import { getUserListAccess } from "@/backend/access/user_access";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {

  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({
      message: 'login required'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  // TODO Check super admin

  const searchParams = request.nextUrl.searchParams;

  const page = searchParams.get('page');
  const pageSize = searchParams.get('pageSize');
  const name = searchParams.get('name') || undefined
  const role = searchParams.get('role') || undefined
  const userStatus = searchParams.get('user_status') || undefined

  if (!page || !pageSize) {
    return new Response(JSON.stringify({ message: 'page params needed' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const userList = await getUserListAccess(parseInt(page), parseInt(pageSize), name, role, userStatus ? parseInt(userStatus) : undefined)

  return new Response(JSON.stringify({
    userList,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}