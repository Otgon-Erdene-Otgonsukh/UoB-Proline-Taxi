import createBooking from "@/backend/create_booking/create_booking";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@/generated/prisma/client";
import { sesClient } from "@/utils/ses_client";
import { render } from "@react-email/components";
import BookingInfo from "@/components/emails/booking_info";
import { SendEmailCommand } from "@aws-sdk/client-sesv2";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  // Check if user is signed in.
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

  try {
    // Get the JSON body of the POST request.
    const request_json = await request.json();
    const user_id = session.user.user_id; // Use the user ID from the session.
    const pickup_loc: string = request_json["pickup_location"].toString();
    const dropoff_loc: string = request_json["dropoff_location"].toString();
    const passenger_name: string = request_json["passenger_name"].toString();
    const email: string = request_json["email"].toString();
    const tel_number: string = request_json["tel_number"].toString();
    const pickup_time = new Date(request_json["pickup_time"]);
    const additional_info: string = request_json["additional_info"].toString();
    const via: string = request_json["via"].toString();
    const returnTo: string | undefined = request_json["returnTo"] ? request_json["returnTo"].toString() : undefined;
    const passenger_num: number = request_json["passengers"];
    const flight_num: string = request_json["flight_num"].toString();
    const airport: string = request_json["airport"].toString();
    const returnDT: Date | undefined = request_json["return_time"] ? new Date(request_json["return_time"]) : undefined;
    const dep_id: number = request_json["dep_id"];

    // Lat/lon fields are null as we introduce lat/lon automatically later on / vice versa.
    await createBooking(
      user_id,
      pickup_loc,
      null,
      null,
      dropoff_loc,
      null,
      null,
      pickup_time,
      returnDT,
      passenger_name,
      email,
      tel_number,
      additional_info,
      via,
      returnTo,
      passenger_num,
      airport,
      flight_num,
      dep_id
    );

    // Email sending with AWS SES
    const userEmail = await prisma.user.findUnique({
      where: {
        user_id: user_id,
      },
      select: {
        email: true,
      },
    });

    const emailHtml = await render(
      BookingInfo({
        from: pickup_loc,
        via: via,
        to: dropoff_loc,
        airport: airport,
        flightNum: flight_num,
        pickUpTime: pickup_time,
        returnTime: returnDT,
        returnTo: returnTo,
        passengerName: passenger_name,
        phoneNumber: tel_number,
      }),
    );

    if (userEmail?.email) {
      const input = new SendEmailCommand({
        FromEmailAddress: `UoB Taxi & Chauffeur <${process.env.SES_FROM_EMAIL!}>`,
        Destination: {
          ToAddresses:
            //userEmail.email === email
            //? [userEmail.email]
            //: [userEmail.email, email.trim()],
            ["janedoe@ioanm.com"]
        },
        Content: {
          Simple: {
            Subject: {
              Data: "Booking Submission Confirmation",
            },
            Body: {
              Html: {
                Data: emailHtml,
              },
            },
          },
        },
      });

      // Send Email
      await sesClient.send(input);
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("There was an error when creating a booking.", error);
    return NextResponse.json(
      { error: "There was a problem creating this booking." },
      { status: 500 },
    );
  }
}
