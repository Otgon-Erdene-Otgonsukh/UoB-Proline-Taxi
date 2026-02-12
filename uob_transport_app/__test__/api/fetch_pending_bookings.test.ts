/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GET } from "../../app/api/get_pending_bookings/route";
import { getPendingBookings, getPendingBookingsCount } from "@/backend/pending_bookings/get_pending_bookings";
import { auth } from "@/auth";

// Mock the database function
jest.mock("../../backend/pending_bookings/get_pending_bookings");

jest.mock("../../auth", () => ({
  auth: jest.fn().mockResolvedValue({
    user: { user_id: 3 }
  })
}));

test("check if the res status is success", async () => {
  // Mock return value - fake booking data
  const mockBookings = [
    {
      booking_id: 1,
      user_id: 3,
      trip_id: 1,
      booking_status: "Pending",
      time_created: new Date("2025-01-01").toLocaleString(),
      first_name: "John",
      tel_number: "1234567890",
      email: "john@test.com",
      additional_info: "Test booking",
    },
  ];

  (getPendingBookings as jest.Mock).mockResolvedValue(mockBookings);
  (getPendingBookingsCount as jest.Mock).mockResolvedValue(1);

  const req = new NextRequest("http://localhost:3000/api/get_pending_bookings?page=1&pageSize=10", {
    method: "GET",
  });

  const res = await GET(req);
  expect(res.status).toBe(200);

  const data = await res.json();
  expect(data).toBeDefined();
  expect(data).toEqual({
    pendingBookings: mockBookings,
    totalNum: 1,
  });
  expect(getPendingBookings).toHaveBeenCalledTimes(1);
});

test("check res status is fail when the api fails", async () => {  
  (getPendingBookings as jest.Mock).mockRejectedValue(new Error("fail"));
  const req = new NextRequest("http://localhost:3000/api/get_pending_bookings?page=1&pageSize=10", {
    method: "GET",
  });

  const res = await GET(req);
  expect(res.status).toBe(500);
})

test("the api responds with a fail status when session does not exist", async () => {
  (auth as jest.Mock).mockResolvedValue(null);
  const req = new NextRequest("http://localhost:3000/api/get_pending_bookings?page=1&pageSize=10", {
    method: "GET",
  });
  
  const res = await GET(req);
  expect(res.status).toBe(401)
})

test("the api responds with fail status when page or pagesize query params are missing", async () => {
  (auth as jest.Mock).mockResolvedValue({
    user_id: 3
  });
  const req = new NextRequest("http://localhost:3000/api/get_pending_bookings", {
    method: "GET",
  });
  
  const res = await GET(req);
  expect(res.status).toBe(201);
})

jest.clearAllMocks();