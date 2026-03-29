import updateBooking from "@/backend/update_booking_details/update_booking_details";
import { NextResponse } from "next/server";
import { getBookingDetails } from "@/backend/access/booking_access";
import { auth } from "@/auth";
import { isAdmin } from "@/backend/access/user_access";
import { location } from "@/model/models";
import { commonLocations } from "@/model/models";
import { getUserFromID } from "@/backend/access/user_access";

export async function POST(req: Request) {
  // Check if user is signed in.
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({
      message: 'login required'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const request_json = await req.json();
    
    const booking_id: number = request_json.booking_id;
    let booking = null;

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
    const airport: location | null = request_json["airport"];
    const returnDT: Date | undefined = request_json["return_time"] ? new Date(request_json["return_time"]) : undefined;
    const isLeadPassengerMyself: boolean = request_json["isLeadPassengerMyself"];

    // Validation (same as create booking API endpoint)

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

        let result = null;
        if (loc.address.includes("Airport")) {
            result = await fetch(`https://nominatim.openstreetmap.org/search?format=json&aeroway=aerodrome&q=${encodeURIComponent(loc.short_name)}`, { headers });
        } else result = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(loc.address)}`, { headers });

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

    // Check if the logged in user is an Admin or owns the booking
    if (await isAdmin(session.user.user_id)) {
      booking = await getBookingDetails(-1, booking_id)
    } else {
      booking = await getBookingDetails(session.user.user_id, booking_id)
    }

    const user_id = booking?.user_id; // Use the user ID from the booking.

    let user = null;
    if (isLeadPassengerMyself && user_id) {
        user = await getUserFromID(user_id);
    }

    // Booking is null if booking does not exist or does not belong to user/admin.
    if (booking === null) {
      return new Response(JSON.stringify({
        success: false, message: 'Booking not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // We have already checked if the booking belongs to them, so we can update it:

    await updateBooking(booking_id,
        request_json["pickup_location"],
        request_json["dropoff_location"],
        request_json["pickup_time"],
        request_json["return_pickup_time"],
        request_json["passenger_name"],
        request_json["email"], request_json["tel_number"],
        request_json["additional_info"],
        request_json["via"],
        request_json["return_drop_loc"],
        request_json["passenger_num"],
        request_json["airport"],
        request_json["flight_num"],
        request_json["dep_id"]
    );

    return NextResponse.json(
      { success: true, message: "Booking status updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error("There was an error when updating bookings.", error);
    return NextResponse.json(
      { success: false, error: "Failed to update booking status" },
      { status: 400 }
    );
  }
}
