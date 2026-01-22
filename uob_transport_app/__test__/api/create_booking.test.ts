/**
 * @jest-environment node
 */

import { POST } from "@/app/api/create_booking/route";
import createBooking from "@/backend/create_booking/create_booking";

jest.mock("../../backend/create_booking/create_booking.ts");

test("create booking api works", async () => {
  (createBooking as jest.Mock).mockResolvedValue(undefined);
  const jsonBody = {
    user_id: 1,
    pickup_location: "Test",
    dropoff_location: "test",
    pickup_time: "",
    returnDT: "",
    first_name: "",
    surname: "",
    email: "",
    tel_number: "",
    additional_info: "",
    via: "",
    returnTo: "",
    passengers: 1,
    department: "",
    airport: "",
    flight_num: "",
  };
  const req = new Request("http://localhost:3000/api/create_booking", {
    method: "POST",
    body: JSON.stringify(jsonBody),
  });

  const res = await POST(req);
  expect(res.status).toBe(200);
  expect(createBooking).toHaveBeenCalledTimes(1);
  expect(createBooking).toHaveBeenCalledWith(jsonBody.user_id, jsonBody.pickup_location, null, null, jsonBody.dropoff_location, null, null, expect.any(Date), expect.any(Date), jsonBody.first_name, jsonBody.surname, jsonBody.email, jsonBody.tel_number, jsonBody.additional_info, jsonBody.via, jsonBody.returnTo, jsonBody.passengers, jsonBody.department, jsonBody.airport, jsonBody.flight_num)
});
