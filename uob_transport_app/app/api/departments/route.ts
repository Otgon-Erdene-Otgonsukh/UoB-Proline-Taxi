import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getDepartmentsListAccess } from "@/backend/access/departments";

export async function GET(request: NextRequest) {
  // TODO Check super admin

  const searchParams = request.nextUrl.searchParams;
  const depName = searchParams.get('depName') || undefined

  const departmentsList = await getDepartmentsListAccess(depName)

  return new Response(JSON.stringify(departmentsList), { status: 200 });

}