/**
 * @jest-environment node
 */

import { POST } from "@/src/app/api/create_booking/route";
import createBooking from "@/backend/create_booking/create_booking";

jest.mock("../../backend/create_booking/create_booking.ts");

test("create booking api works", async () => {
  (createBooking as jest.Mock).mockResolvedValue(undefined);
  const jsonBody = {
    user_id: 1,
    pickup_location: "Test",
    dropoff_location: "test",
    pickup_time: "",
    first_name: "",
    surname: "",
    email: "",
    tel_number: "",
    additional_info: "",
    via: "",
    returnTo: "",
    passengers: 1,
    department: "",
  };
  const req = new Request("http://localhost:3000/api/create_booking", {
    method: "POST",
    body: JSON.stringify(jsonBody),
  });

  const res = await POST(req)
  expect(res.status).toBe(200)
  expect(createBooking).toHaveBeenCalledTimes(1)
});
