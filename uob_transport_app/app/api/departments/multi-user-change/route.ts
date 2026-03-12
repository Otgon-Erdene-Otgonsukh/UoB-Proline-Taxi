import { NextRequest, NextResponse } from "next/server";
import { changeDepartmentForUsersAccess } from "@/backend/access/user_access";

export async function POST(req: NextRequest) {
  // TODO check super admin
  const request = await req.json();
  const depId: number = request.depId;
  const userIds: number[] = request.userIds;

  if (depId < 0 || userIds.length === 0) {
    return NextResponse.json({
      status: 201,
      message: "There was an error with the payload",
    }, { status: 201 });
  }

  const payload = await changeDepartmentForUsersAccess(userIds, depId)

  if (payload) {
    return new Response(JSON.stringify({
      status: 200,
      message: "Update successfully.",
    }), { status: 200 });
  } else {
    return NextResponse.json({
      status: 201,
      message: "There was an error, try again later",
    }, { status: 201 });
  }
}