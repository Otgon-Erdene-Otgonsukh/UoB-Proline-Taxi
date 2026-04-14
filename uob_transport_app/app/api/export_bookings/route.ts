import { NextRequest } from "next/server";
import { getBookingIDsByDepartment, getBookingTrip } from "@/backend/access/booking_access";
import { auth } from "@/auth";
import { isAdmin } from "@/backend/access/user_access";
import { location } from "@/model/models";

export async function POST(
    request: NextRequest,
    ) {

    // Log in and admin permissions are required.
    const session = await auth();
    if (!session) {
        return new Response(JSON.stringify({
            message: 'login required'
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    if (!isAdmin(session.user.user_id)) {
        return new Response(JSON.stringify({
            message: 'Not authorised.'
        }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    // Set up how CSV body will be generated.
    type bookingID = number[] | null;
    const jsonBody = await request.json();
    const bookingIds = jsonBody["bookingIds"] as bookingID;
    const depId = jsonBody["depId"] as number;

    const csvHeaders = [
        "uob_booking_id", "date", "name", "phone", "address/lat", "address/lng", "address/formatted",
        "destination/lat", "destination/lng", "destination/formatted",
        "vias/via1/lat", "vias/via1/lng", "vias/via1/formatted",
        "vias/via2/lat", "vias/via2/lng", "vias/via2/formatted",
        "vias/via3/lat", "vias/via3/lng", "vias/via3/formatted",
        "booking_status", "po_number", "num_passengers", "additional_info"
    ]
    let resArray = [];
    let bookingIdArray : number[] = [];

    // If the parameter is bookingIds, use the list of booking IDs in the POST request.
    if (bookingIds) {
        bookingIdArray = bookingIds
    } else if (depId) {
        // If it's depId instead, fetch all of the bookings belonging to that department and put their IDs into that array.
        bookingIdArray = (await getBookingIDsByDepartment(depId));
    }

    // Convert each booking entry into a row in CSV.
    for (const id of bookingIdArray) {
        console.log(id)
        const booking = await getBookingTrip(id)
        if (booking != null) {
            const pickupLoc = JSON.parse(booking?.trip?.pickup_location) as location
            const dropoffLoc = JSON.parse(booking?.trip?.dropoff_location) as location
            const vias = booking?.trip?.via ? JSON.parse(booking?.trip?.via) as location[] : []

            // Construct the CSV row as an array.
            resArray.push([
                booking?.booking_id, booking?.trip?.pickup_time,
                booking?.passenger_name, booking?.tel_number,

                pickupLoc.lat, pickupLoc.lng, pickupLoc.address,
                dropoffLoc.lat, dropoffLoc.lng, dropoffLoc.address,

                vias[0]?.lat || "", vias[0]?.lng || "", vias[0]?.address || "",
                
                vias[1]?.lat || "", vias[1]?.lng || "", vias[1]?.address || "",
                
                vias[2]?.lat || "", vias[2]?.lng || "", vias[2]?.address || "",
                
                booking?.booking_status, booking?.trip?.PO, booking?.trip?.passenger_num, booking?.additional_info
            ])
        }
    }


     // Convert the nested array into a CSV string, where the header is also the first item.
    let outputStringCSV = csvHeaders.join(",") + "\n";
    
    for (let i = 0; i < resArray.length; i++) {
        for (let j = 0; j < resArray[i].length; j++) {
            // Wrap strings with quotes
            if (typeof resArray[i][j] === "string") {
                outputStringCSV += `"${resArray[i][j]}"`;
            } else {
                outputStringCSV += resArray[i][j];
            }
            if (j < resArray[i].length - 1) {
                outputStringCSV += ",";
            }
        }
        outputStringCSV += "\n";
    }

    return new Response(
      outputStringCSV,
        {
            status: 200,
            headers: { 
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="bookings_export.csv"'
            },
        },
    )
  }
