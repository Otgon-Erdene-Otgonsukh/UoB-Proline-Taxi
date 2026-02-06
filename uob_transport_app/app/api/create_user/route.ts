import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import sendReq from "@/backend/register/send_req";
import bcrypt from "bcryptjs";
import { departments } from "@/model/models";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const request = await req.json();
  const mail: string = request.mail;
  const password: string = request.password;
  const username: string = request.username;
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
    (role == "proline_staff" && departmentName.length !== 0) ||
    (!departments.includes(departmentName))
  ) {
    return NextResponse.json({
      status: 500,
      message: "There was an error creating an user",
    });
  }

  // hashing
  const hashRounds = 10;
  const hashedPassword = await bcrypt.hash(password, hashRounds);

  try {
    // if the department already exists, appoint the existing dep_id
    const department = await prisma.department.findFirst({
      where: {
        dep_name: {
          equals: departmentName,
          mode: "insensitive",
        },
      },
    });

    if (role === "proline_staff") {
      // for proline staff reg-requests, no department is created, only user entry
      await prisma.user.create({
        data: {
          username: username,
          name: firstName,
          surname: lastName,
          phone_number: phoneNumber,
          role: role,
          email: mail,
          password: hashedPassword,
        },
      });
    } else if (department === null) {
      const newDepartment = await prisma.department.create({
        data: {
          dep_name: departmentName,
        },
      });
      await prisma.user.create({
        data: {
          dep_id: newDepartment.dep_id,
          username: username,
          name: firstName,
          surname: lastName,
          phone_number: phoneNumber,
          role: role,
          user_status: role === "normal_user" ? 1 : 0,
          email: mail,
          password: hashedPassword,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          dep_id: department.dep_id,
          username: username,
          name: firstName,
          surname: lastName,
          phone_number: phoneNumber,
          role: role,
          user_status: role === "normal_user" ? 1 : 0,
          email: mail,
          password: hashedPassword,
        },
      });
    }
    await sendReq(firstName, mail)
    return NextResponse.json({
      status: 200,
      message: "User is created successfully.",
    }, { status: 200 });
  } catch (error) {
    console.error("There was a problem when creating an user.", error);
    return NextResponse.json({ status: 500, message: "User was not created." }, { status: 500 });
  }
}
