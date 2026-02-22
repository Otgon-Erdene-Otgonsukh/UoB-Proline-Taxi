import update_user from "@/backend/update_user_info/update_user";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const user_id: number = body.user_id;
  const newName: string | undefined = body.name;
  const newEmail: string | undefined = body.email;
  const newPhoneNumber: string | undefined = body.phone_number;
  const newDepartment: string | undefined = body.department;

  //IDOR Check
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (user_id !== session.user.user_id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await update_user(
      user_id,
      newName?.trim(),
      newEmail?.trim(),
      newPhoneNumber?.trim(),
      newDepartment,
    );
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error("There was an error updating user info", error);
    return NextResponse.json({ message: "fail" }, { status: 500 });
  }
}
