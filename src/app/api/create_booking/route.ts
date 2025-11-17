import createBooking from "@/backend/create_booking/create_booking";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        // Get the JSON body of the POST request.
        const request_json = await request.json()
        const user_id = request_json["user_id"]
        const pickup_loc = request_json["pickup_location"].toString()
        const dropoff_loc = request_json["dropoff_location"].toString()
        const first_name = request_json["first_name"].toString()
        const surname = request_json["surname"].toString()
        const email = request_json["email"].toString()
        const tel_number = request_json["tel_number"].toString()
        const pickup_time = new Date(request_json["pickup_time"])
        const additional_info = request_json["additional_info"].toString()
        const via = request_json["via"].toString()
        const returnTo = request_json["returnTo"].toString()
        const passenger_num = request_json["passengers"]

        // Lat/lon fields are null as we introduce lat/lon automatically later on / vice versa.
        await createBooking(user_id, pickup_loc, null, null, dropoff_loc, null, null, pickup_time, first_name, surname, email, tel_number, additional_info, via, returnTo, passenger_num);
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json(
        { error: "There was a problem creating this booking." },
        { status: 500 }
        );
    }
}
