import prisma from "@/utils/client";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  const subscription: object = data.subscription;

  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  try {
    await prisma.user.update({
      where: {
        user_id: session.user.user_id,
      },
      data: {
        subscription: JSON.stringify(subscription),
      },
    });

    return NextResponse.json(
      { message: "Subscription created succesffully" },
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
