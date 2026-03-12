import { NextRequest, NextResponse } from "next/server";
import { updateDepartmentNameAccess } from "@/backend/access/departments_access";

/**
 * Updates a department's name.
 * @param req 
 * @returns 
 */
export async function POST(req: NextRequest) {
  // TODO check super admin
  const request = await req.json();
  const depId: number = request.depId;
  const name: string = request.depName;

  if (!depId) {
    return NextResponse.json({
      status: 201,
      message: "Department id is required.",
    }, { status: 201 });
  }
  if (name === '') {
    return NextResponse.json({
      status: 201,
      message: "Department name is required.",
    }, { status: 201 });
  }

  const department = await updateDepartmentNameAccess(depId, name)

  if (department) {
    return new Response(JSON.stringify({
      status: 200,
      message: "Department name is updated successfully.",
    }), { status: 200 });
  } else {
    return NextResponse.json({
      status: 201,
      message: "There was an error updating the department name",
    }, { status: 201 });
  }
}