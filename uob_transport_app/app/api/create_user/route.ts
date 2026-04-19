import { NextRequest, NextResponse } from "next/server";
import sendReq from "@/backend/register/send_req";
import bcrypt from "bcryptjs";
import prisma from "@/utils/client";
import { withRateLimit } from "@/lib/rateLimit";

async function createUserHandler(req: Request) {
  const request = await req.json();
  const mail: string = request.mail;
  const password: string = request.password;
  const departmentName: string = request.department;
  const firstName: string = request.firstName;
  const lastName: string = request.lastName;
  const role: string = request.role;
  const phoneNumber: string = request.phoneNumber;

  // Server side role and mail validation
  if (
    (!mail.endsWith("@prolinetaxi.com") && role === "proline_staff") ||
    (!mail.endsWith("@bristol.ac.uk") && role === "finance_staff") ||
    (departmentName.length === 0 &&
      (role === "normal_user" || role === "finance_staff")) ||
    (role == "proline_staff" && departmentName.length !== 0)
  ) {
    return NextResponse.json({
      status: 500,
      message: "There was an error creating an user",
    }, { status: 500 });
  }

  // hashing
  const hashRounds = 10;
  const hashedPassword = await bcrypt.hash(password.trim(), hashRounds);

  try {
    // if the department already exists, appoint the existing dep_id
    const department = await prisma.department.findFirst({
      where: {
        dep_name: {
          equals: departmentName.trim(),
          mode: "insensitive",
        },
      },
    });

    if (role.trim() === "proline_staff") {
      // for proline staff reg-requests, no department is created, only user entry
      await prisma.user.create({
        data: {
          full_name: firstName.trim() + " " + lastName.trim(),
          phone_number: phoneNumber.trim(),
          role: role,
          email: mail.trim(),
          password: hashedPassword,
        },
      });
    } else if (department === null) {
      // TODO department should be created by normal user when registering
      const newDepartment = await prisma.department.create({
        data: {
          dep_name: departmentName.trim(),
        },
      });
      await prisma.user.create({
        data: {
          dep_id: newDepartment.dep_id,
          full_name: firstName.trim() + " " + lastName.trim(),
          phone_number: phoneNumber.trim(),
          role: role,
          user_status: role === "normal_user" ? 1 : 0,
          email: mail.trim(),
          password: hashedPassword,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          dep_id: department.dep_id,
          full_name: firstName.trim() + " " + lastName.trim(),
          phone_number: phoneNumber.trim(),
          role: role,
          user_status: role === "normal_user" ? 1 : 0,
          email: mail.trim(),
          password: hashedPassword,
        },
      });
    }
    await sendReq(firstName.trim(), mail.trim(), role)
    return NextResponse.json({
      status: 200,
      message: "User is created successfully.",
    }, { status: 200 });
  } catch (error) {
    console.error("There was a problem when creating an user.", error);
    return NextResponse.json({ status: 500, message: "User was not created." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return withRateLimit({
    limit: 100, // 100 requests per 10 minutes
    windowMs: 1000 * 60 * 10, // 10 minutes
    getIdentifier: (req) => req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for') ?? 'global', // get the IP address of the request
  })(createUserHandler)(request);
}
