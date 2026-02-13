/**
 * @jest-environment node
 */

import { POST } from "@/app/api/cancel-booking/route";
import { auth } from "@/auth";
import {
  cancelBookingsAccess,
  getBookingDetails,
} from "@/backend/access/booking_access";
import { isAdmin } from "@/backend/access/user_access";
import { NextRequest } from "next/server";

jest.mock("../../auth", () => ({
  auth: jest.fn(),
}));
jest.mock("../../backend/access/user_access");
jest.mock("../../backend/access/booking_access");

const data = {
  bookingId: 2,
};

describe("Cancel booking api end point branch tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Unsessioned user request is rejected", async () => {
    (auth as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest("http://localhost:3000/api/cancel-booking", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  test("An admin user cancels a booking that exists", async () => {
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (getBookingDetails as jest.Mock).mockResolvedValue({
        booking_id: 2,
        user_id: 3
    });
    (auth as jest.Mock).mockResolvedValue({
        user: {
            user_id: 3
        }
    });
    (cancelBookingsAccess as jest.Mock).mockResolvedValue(undefined);
    const req = new NextRequest("http://localhost:3000/api/cancel-booking", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  test("Non-existent booking cancel requests are returned with 404 not found status", async () => {
    (isAdmin as jest.Mock).mockResolvedValue(false);
    (auth as jest.Mock).mockResolvedValue({
        user: {
            user_id: 3
        }
    });
    (getBookingDetails as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest("http://localhost:3000/api/cancel-booking", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  test("An error response is sent when fetching booking fails", async () => {
    (isAdmin as jest.Mock).mockResolvedValue(false);
    (auth as jest.Mock).mockResolvedValue({
        user: {
            user_id: 3
        }
    });
    (getBookingDetails as jest.Mock).mockRejectedValue(new Error());
    const req = new NextRequest("http://localhost:3000/api/cancel-booking", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  test("An error response is sent when cancel booking process fails", async () => {
     (isAdmin as jest.Mock).mockResolvedValue(false);
    (auth as jest.Mock).mockResolvedValue({
        user: {
            user_id: 3
        }
    });
    (getBookingDetails as jest.Mock).mockResolvedValue({
        booking_id: 3
    });
    (cancelBookingsAccess as jest.Mock).mockRejectedValue(new Error());
    const req = new NextRequest("http://localhost:3000/api/cancel-booking", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  })
});
