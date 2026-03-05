import prisma from "@/utils/client";
import {
  MonthlyBookingData,
  DepartmentRevenue,
  SuperCardData,
  SuperData,
} from "@/model/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Data for Line Graph
    const montlyDepartmentBookings: [{ month: Date; count: number }] =
      await prisma.$queryRaw`
        SELECT 
            DATE_TRUNC('month', t."pickup_time") AS month,
            COUNT(*)::int AS count
        FROM "trip" t
        INNER JOIN "booking" b ON t.trip_id = b.trip_id
        WHERE t."pickup_time" >= DATE_TRUNC('month', NOW()) - INTERVAL '4 months'
          AND t."pickup_time" <= DATE_TRUNC('month', NOW()) + INTERVAL '3 months'
          AND b."booking_status" != 'Cancelled'
        GROUP BY month
        ORDER BY month ASC;
    `;
    const formattedDepartmentBookings: MonthlyBookingData[] =
      montlyDepartmentBookings.map((e) => ({
        month: e.month.toISOString().slice(0, 7),
        count: e.count,
      }));

    // Data for Bar Graph - Group bookings by department with name, count and total price
    const departmentPriceCount: [
      {
        depName: string;
        bookingCount: number;
        totalPrice: number;
      },
    ] = await prisma.$queryRaw`
        SELECT 
            d.dep_name AS "depName",
            COUNT(b.booking_id)::int AS "bookingCount",
            COALESCE(
              SUM(
                CASE 
                  WHEN t.price IS NOT NULL
                  THEN CAST(t.price AS DECIMAL) 
                  ELSE 0 
                END
              ), 0
            ) AS "totalPrice"
        FROM "booking" b
        INNER JOIN "trip" t ON b.trip_id = t.trip_id
        INNER JOIN "department" d ON b.dep_id = d.dep_id
        WHERE b.booking_status != 'Cancelled'
        GROUP BY b.dep_id, d.dep_name
        ORDER BY "bookingCount" DESC
        LIMIT 6;
    `;
    const formattedData: DepartmentRevenue[] = departmentPriceCount.map(
      (e) => ({
        department: e.depName,
        bookingCount: e.bookingCount,
        priceTotal: e.totalPrice,
      }),
    );

    // Card Data
    const userCount = await prisma.user.count();
    const totalBookingNum = await prisma.booking.count({
      where: {
        booking_status: {
          not: "Cancelled",
        },
      },
    });
    const pendingUserCount = await prisma.user.count({
      where: {
        user_status: 0,
      },
    });
    const pricelessBookings = await prisma.trip.count({
      where: {
        price: null,
        booking: {
          booking_status: {
            not: "Cancelled",
          },
        },
      },
    });

    const cardData: SuperCardData = {
      totalUser: userCount,
      totalBooking: totalBookingNum,
      pendingUser: pendingUserCount,
      priceRequired: pricelessBookings,
    };

    const superData: SuperData = {
      cardData: cardData,
      lineGraph: formattedDepartmentBookings,
      barGraph: formattedData,
    };

    return NextResponse.json(superData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong when catching dashboard information" },
      { status: 500 },
    );
  }
}
