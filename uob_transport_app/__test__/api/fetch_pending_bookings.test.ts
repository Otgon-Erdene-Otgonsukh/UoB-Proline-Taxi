/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GET } from "../../app/api/get_pending_bookings/route";
import { getPendingBookings, getPendingBookingsCount } from "@/backend/pending_bookings/get_pending_bookings";
import { isAdmin, isFinanceStaff } from "@/backend/access/user_access";
import { auth } from "@/auth";

jest.mock("../../backend/pending_bookings/get_pending_bookings");
jest.mock("../../backend/access/user_access");

jest.mock("../../auth", () => ({
  auth: jest.fn().mockResolvedValue({
    user: { user_id: 3 }
  })
}));

beforeEach(() => {
  jest.clearAllMocks();
  // Default: user is admin so existing tests still pass
  (isAdmin as jest.Mock).mockResolvedValue(true);
  (isFinanceStaff as jest.Mock).mockResolvedValue(false);
});

test("check if the res status is success", async () => {
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
});

test("the api responds with a fail status when session does not exist", async () => {
  (auth as jest.Mock).mockResolvedValue(null);
  const req = new NextRequest("http://localhost:3000/api/get_pending_bookings?page=1&pageSize=10", {
    method: "GET",
  });

  const res = await GET(req);
  expect(res.status).toBe(401);
});

test("the api responds with fail status when page or pagesize query params are missing", async () => {
  (auth as jest.Mock).mockResolvedValue({
    user: { user_id: 3 }
  });
  const req = new NextRequest("http://localhost:3000/api/get_pending_bookings", {
    method: "GET",
  });

  const res = await GET(req);
  expect(res.status).toBe(201);
});

test("finance staff can view pending bookings", async () => {
  (auth as jest.Mock).mockResolvedValue({ user: { user_id: 5 } });
  (isAdmin as jest.Mock).mockResolvedValue(false);
  (isFinanceStaff as jest.Mock).mockResolvedValue(true);
  (getPendingBookings as jest.Mock).mockResolvedValue([]);
  (getPendingBookingsCount as jest.Mock).mockResolvedValue(0);

  const req = new NextRequest("http://localhost:3000/api/get_pending_bookings?page=1&pageSize=10", {
    method: "GET",
  });

  const res = await GET(req);
  expect(res.status).toBe(200);
});

test("non-admin non-finance user gets 403", async () => {
  (auth as jest.Mock).mockResolvedValue({ user: { user_id: 9 } });
  (isAdmin as jest.Mock).mockResolvedValue(false);
  (isFinanceStaff as jest.Mock).mockResolvedValue(false);

  const req = new NextRequest("http://localhost:3000/api/get_pending_bookings?page=1&pageSize=10", {
    method: "GET",
  });

  const res = await GET(req);
  expect(res.status).toBe(403);
});