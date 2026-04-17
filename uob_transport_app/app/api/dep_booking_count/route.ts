import prisma from "@/utils/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdmin } from "@/backend/access/user_access";

export async function GET() {
  // Security check
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Not Authenticated" }, { status: 401 });
  }

  if (!(await isAdmin(session.user.user_id))) {
    return NextResponse.json(
      { message: "This resource is forbidden" },
      { status: 403 },
    );
  }

  try {
    const depBookingData = await prisma.department.findMany({
      where: {
        booking: {
          some: {},
        },
      },
      select: {
        dep_id: true,
        dep_name: true,
        _count: {
          select: {
            booking: true,
          },
        },
      },
      orderBy: {
        booking: {
          _count: "desc",
        },
      },
    });
    const cleaned = depBookingData.map((e) => ({
      dep_id: e.dep_id,
      dep_name: e.dep_name,
      count: e._count.booking,
    }));
    return NextResponse.json(cleaned, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Unable to get department booking counts" },
      { status: 500 },
    );
  }
}
