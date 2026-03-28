import { NextRequest, NextResponse } from "next/server";
import { deleteDepartmentAccess } from "@/backend/access/departments_access";

export async function POST(req: NextRequest) {
  // TODO check super admin
  const request = await req.json();
  const id: number = request.depId;

  const department = await deleteDepartmentAccess(id);

  if (department) {
    return new Response(JSON.stringify({
      status: 200,
      message: "Department is deleted successfully.",
    }), { status: 200 });
  } else {
    return NextResponse.json({
      status: 201,
      message: "There was an error deleting the department",
    }, { status: 201 });
  }
}