import prisma from "@/utils/client";
import { NextResponse } from "next/server";
import { sesClient } from "@/utils/ses_client";
import { SendEmailCommand } from "@aws-sdk/client-sesv2";
import BookingPrice from "@/components/emails/booking_price";
import { render } from "@react-email/components";
import { location } from "@/model/models";

export async function POST(req: Request) {
  const body = await req.json();
  const price = body.price;
  const booking_id = body.booking_id;

  try {
    await prisma.booking.update({
      where: {
        booking_id: booking_id,
      },
      data: {
        trip: {
          update: {
            price: parseFloat(price),
          },
        },
      },
    });

    // Sending Price Email
    const booking = await prisma.booking.findUnique({
      where: {
        booking_id: booking_id,
      },
      include: {
        department: true,
        trip: true,
      },
    });

    const financeStaffEmails = await prisma.user.findMany({
      where: {
        role: "finance_staff",
        dep_id: booking?.dep_id,
      },
      select: {
        email: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 },
      );
    }

    const from = JSON.parse(booking.trip.pickup_location) as location;
    const via = booking.trip.via
      ? (JSON.parse(booking.trip.via) as location[])
      : [];
    const to = JSON.parse(booking.trip.dropoff_location) as location;
    const airport = booking.trip.airport
      ? (JSON.parse(booking.trip.airport) as location)
      : null;
    const returnTo = booking.trip.return_drop_loc
      ? (JSON.parse(booking.trip.return_drop_loc) as location)
      : undefined;

    const emailHtml = await render(
      BookingPrice({
        from,
        via,
        to,
        airport,
        flightNum: booking.trip.flight_num ?? "",
        pickUpTime: booking.trip.pickup_time,
        returnTime: booking.trip.return_pickup_time ?? undefined,
        returnTo,
        passengerName: booking.passenger_name,
        phoneNumber: booking.tel_number,
        department: booking.department.dep_name,
        price: String(price),
      }),
    );

    // Send mail to every finance staff under the same department as the booking
    const input = new SendEmailCommand({
        FromEmailAddress: `UoB Taxi & Chauffeur <${process.env.SES_FROM_EMAIL!}>`,
        Destination: {
            ToAddresses: financeStaffEmails.map(e => e.email)
        },
        Content: {
            Simple: {
                Subject: {
                    Data: "Price Attachment Notice"
                },
                Body: {
                    Html: {
                        Data: emailHtml
                    }
                }
            }
        }
    });

    // Send email
    await sesClient.send(input);

    return NextResponse.json(
      { message: "Price attached successfully" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "There was an error when attaching price" },
      { status: 500 },
    );
  }
}
