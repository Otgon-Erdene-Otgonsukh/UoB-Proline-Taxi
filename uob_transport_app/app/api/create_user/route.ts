import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const request = await req.json();
  const mail = request.mail;
  const password = request.password;
  const username = request.username;
  const departmentName = request.department;
  const firstName = request.firstName;
  const lastName = request.lastName;
  const role = request.role;
  const phoneNumber = request.phoneNumber;

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

    if (department === null) {
      const newDepartment = await prisma.department.create({
        data: {
          dep_name: departmentName,
        },
      });
      await prisma.user.create({
        data: {
          user_id: 4,
          dep_id: newDepartment.dep_id,
          username: username,
          name: firstName,
          surname: lastName,
          phone_number: phoneNumber,
          role: role,
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
          email: mail,
          password: hashedPassword,
        },
      });
    }
    return NextResponse.json({
      status: 200,
      message: "User is created successfully.",
    });
  } catch (error) {
    console.error("There was a problem when creating an user.", error);
    return NextResponse.json({ status: 500, message: "User was not created." });
  }
}
