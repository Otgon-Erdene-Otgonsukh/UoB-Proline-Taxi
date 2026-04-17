import { NextRequest, NextResponse } from "next/server";
import { createNewDepartmentAccess } from "@/backend/access/departments_access";

export async function POST(req: NextRequest) {
  // TODO check super admin
  const request = await req.json();
  const name: string = request.depName;
  
  if (name === '') {
    return NextResponse.json({
      status: 201,
      message: "There was an error creating an department",
    }, { status: 201 });
  }

  const department = await createNewDepartmentAccess(name)

  if (department) {
    return new Response(JSON.stringify({
      status: 200,
      message: "Department is created successfully.",
    }), { status: 200 });
  } else {
    return NextResponse.json({
      status: 201,
      message: "There was an error creating an department",
    }, { status: 201 });
  }
}