import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { getNormalDashboardData } from "@/backend/normal_dashboard_data/normal_dash_data";

export async function GET() {
  const session = await auth();
  if (!session) {
    return new Response(
      JSON.stringify({
        message: "login required",
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const data = await getNormalDashboardData(session.user.user_id);
  return NextResponse.json( data, { status: 200 });
}
