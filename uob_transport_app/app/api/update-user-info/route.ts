import update_user from "@/backend/update_user_info/update_user"
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const user_id: number = body.user_id;
    const newName: string | undefined = body.name;
    const newLastName: string | undefined = body.surname;
    const newUserName: string | undefined = body.username;
    const newEmail: string | undefined = body.email;
    const newPhoneNumber: string | undefined = body.phone_number;
    const newDepartment: string | undefined = body.department;
    try {
        await update_user(user_id, newName, newLastName, newUserName, newEmail, newPhoneNumber, newDepartment);
        return NextResponse.json({message: "success"}, {status: 200})
    } catch (error) {
        console.error("There was an error updating user info", error);
        return NextResponse.json({message: "fail"}, {status: 500});
    }
}