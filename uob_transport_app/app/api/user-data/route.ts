import prisma from "@/utils/client";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: "Request rejected" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        user_id: session.user.user_id,
      },
      omit: {
        password: true,
      },
      include: {
        department: true,
      },
    });

    return NextResponse.json(
      {
        body: user,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}
