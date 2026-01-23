/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GET } from "../../app/api/get_pending_bookings/route";
import { getPendingBookings } from "@/backend/pending_bookings/get_pending_bookings";

// Mock the database function
jest.mock("../../backend/pending_bookings/get_pending_bookings");

test("check if the res status is good", async () => {
  // Mock return value - fake booking data
  const mockBookings = [
    {
      booking_id: 1,
      user_id: 1,
      trip_id: 1,
      booking_status: "Pending",
      time_created: new Date("2025-01-01").toLocaleString(),
      first_name: "John",
      surname: "Doe",
      tel_number: "1234567890",
      email: "john@test.com",
      additional_info: "Test booking",
    },
  ];

  (getPendingBookings as jest.Mock).mockResolvedValue(mockBookings);

  const body = { bookingId: 11, newStatus: "Rejected", po: "PO-111" };
  const req = new NextRequest("http://localhost:3000/api/get_pending_bookings", {
    method: "GET",
  });

  const res = await GET(req);
  expect(res.status).toBe(200);

  const data = await res.json();
  expect(data).toBeDefined();
  expect(data).toEqual(mockBookings);
  expect(getPendingBookings).toHaveBeenCalledTimes(1);
});
