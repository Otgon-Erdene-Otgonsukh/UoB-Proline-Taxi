import createBooking from "@/backend/create_booking/create_booking";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@/generated/prisma/client";
import { sesClient } from "@/utils/ses_client";
import { render } from "@react-email/components";
import BookingInfo from "@/components/emails/booking_info";
import { SendEmailCommand } from "@aws-sdk/client-sesv2";
import { formLocation, location } from "@/model/models";
import { commonLocations } from "@/model/models";
import { getUserFromID } from "@/backend/access/user_access";

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
    const pickup_loc: location = request_json["pickup_location"];
    const dropoff_loc: location = request_json["dropoff_location"];
    const passenger_name: string = request_json["passenger_name"].toString();
    const email: string = request_json["email"].toString();
    const tel_number: string = request_json["tel_number"].toString();
    const pickup_time = new Date(request_json["pickup_time"]);
    const additional_info: string = request_json["additional_info"].toString();
    const via: location[] = request_json["via"];
    const returnTo: location | undefined = request_json["returnTo"] ? request_json["returnTo"] : undefined;
    const passenger_num: number = request_json["passengers"];
    const flight_num: string = request_json["flight_num"].toString();
    const airport: string = request_json["airport"].toString();
    const returnDT: Date | undefined = request_json["return_time"] ? new Date(request_json["return_time"]) : undefined;
    const dep_id: number = request_json["dep_id"];
    const isLeadPassengerMyself: boolean = request_json["isLeadPassengerMyself"];

    // Validation.

    // Check that all required values are present and valid.
    const aggregatedArray = [pickup_loc, dropoff_loc, ...via];

    // Optionally add return location to validation if it was provided.
    if (returnTo != undefined) {
      aggregatedArray.push(returnTo);
    }

    for (const loc of aggregatedArray) {
      if (loc === null || loc == undefined || loc.address.trim() === "" || loc.short_name.trim() === "" || loc.lat == null || loc.lng == null) { // Check if the location is null or has an empty address. Lat/lon can be null as we can derive them from the address or common location short name.
        // Not allowed to be null or empty.
        return NextResponse.json(
          { error: "Reqired location cannot be null or empty." },
          { status: 400 },
        );
      }

      // Check that, if it's a commonLocation, that the short name and lat/lon and address match expected values.
      if (loc.short_name in commonLocations) {
        if (commonLocations[loc.short_name].address !== loc.address
          || commonLocations[loc.short_name].lat !== loc.lat
          || commonLocations[loc.short_name].lng !== loc.lng
        ) {
          return NextResponse.json(
            { error: "Address / latitude and longitude, or short name / address mismatch." },
            { status: 400 },
          );
        }
      } else {
        // If it's a nominatim address, check by sending the requests again.
        // adapted from booking page client.
        const headers = {
          "Content-Type": "application/json",
          "Accept-Language": "en-GB",
          "User-Agent": "UoB Transport App - https://uobst.ilm.gg/ (Backend address validation)"
        }

        const result = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(loc.address)}`, { headers });
        if (result.ok) {
          const data = await result.json();
          if (data && data.length > 0) {
            for (const resloc of data) {
              if (parseFloat(resloc.lat) === loc.lat && parseFloat(resloc.lon) === loc.lng && resloc.display_name.toLowerCase() === loc.address.toLowerCase()) {
                const expected_loc: location = { short_name: resloc.name, lat: parseFloat(resloc.lat), lng: parseFloat(resloc.lon), address: resloc.display_name };
                if (loc.lat != expected_loc.lat || loc.lng != expected_loc.lng || loc.short_name.toLowerCase() != expected_loc.short_name.toLowerCase()) {
                  return NextResponse.json(
                    { error: "Location address does not match its longitude, latitude, or short name." },
                    { status: 400 },
                  );
                } else {
                  // Check that the result is in the UK
                  if (!data[0].display_name.includes("United Kingdom")) {
                    return NextResponse.json(
                      { error: "Location must be in United Kingdom." },
                      { status: 400 },
                    );
                  }
                }
              }
            }
          } else {
            return NextResponse.json(
              { error: "Invalid location address." },
              { status: 400 },
            );
          }
        } else {
          return NextResponse.json(
            { error: "Error validating location address." },
            { status: 500 },
          );
        };
      }
    }


    const aggregatedArray2 = [pickup_loc, dropoff_loc, ...via];
    // Ensure that none of the locations (except returnTo) are the same:
    for (const locX of aggregatedArray2) {
      for (const locY of aggregatedArray2) {
        if (locX.address === locY.address && locX !== locY) {
          return NextResponse.json(
            { error: "Cannot have duplicate locations." },
            { status: 400 },
          );
        }
      }
    }

    if (passenger_num > 5) {
      return NextResponse.json(
        { error: "Passenger number cannot be more than 5." },
        { status: 201 },
      );
    }

    let user = null;
    if (isLeadPassengerMyself) {
      user = await getUserFromID(user_id);
    }

    // Lat/lon fields are null as we introduce lat/lon automatically later on / vice versa.
    await createBooking(
      user_id,
      pickup_loc,
      dropoff_loc,
      pickup_time,
      returnDT,
      user?.full_name || passenger_name,
      user?.email || email,
      user?.phone_number || tel_number,
      additional_info,
      via,
      returnTo,
      passenger_num,
      airport,
      flight_num,
      user?.dep_id || dep_id,
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
