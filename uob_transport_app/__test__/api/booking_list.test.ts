/**
 * @jest-environment node
 */

import { GET } from "@/app/api/booking-list/route";
import { auth } from "@/auth";
import {
  getUserBookingsAccess,
  getUserBookingsCountAccess,
} from "@/backend/access/booking_access";
import { isAdmin } from "@/backend/access/user_access";
import { NextRequest } from "next/server";

jest.mock("../../auth", () => ({
  auth: jest.fn(),
}));
jest.mock("../../backend/access/booking_access");
jest.mock("../../backend/access/user_access");

describe("Booking list api endpoint branch tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Unauthenticated user request is rejected", async () => {
    (auth as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest(
      "http://localhost:3000/api/booking-list?page=1&pageSize=10",
    );
    const res = await GET(req);
    expect(res.status).toBe(201);
    expect(getUserBookingsAccess).not.toHaveBeenCalled();
  });

  test("Missing page params returns 201 warning", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (isAdmin as jest.Mock).mockResolvedValue(false);
    const req = new NextRequest("http://localhost:3000/api/booking-list");
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.message).toBe("page params needed");
  });

  test("Admin request passes -1 as user id to access layer", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (getUserBookingsAccess as jest.Mock).mockResolvedValue([{ id: 1 }]);
    (getUserBookingsCountAccess as jest.Mock).mockResolvedValue(1);

    const req = new NextRequest(
      "http://localhost:3000/api/booking-list?page=1&pageSize=10&from=a&to=b&bookingStatus=Pending&pickUpTimeFrom=2025-01-01&pickUpTimeTo=2025-02-01&isExport=true&department=Arts",
    );
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.bookings).toEqual([{ id: 1 }]);
    expect(data.totalNum).toBe(1);
    expect(getUserBookingsAccess).toHaveBeenCalledWith(
      -1,
      1,
      10,
      expect.objectContaining({
        from: "a",
        to: "b",
        bookingStatus: "Pending",
        pickUpTimeFrom: "2025-01-01",
        pickUpTimeTo: "2025-02-01",
        isExport: true,
        department: "Arts",
      }),
    );
  });

  test("Normal user request passes own user_id to access layer", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 7 } });
    (isAdmin as jest.Mock).mockResolvedValue(false);
    (getUserBookingsAccess as jest.Mock).mockResolvedValue([]);
    (getUserBookingsCountAccess as jest.Mock).mockResolvedValue(0);

    const req = new NextRequest(
      "http://localhost:3000/api/booking-list?page=2&pageSize=5",
    );
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(getUserBookingsAccess).toHaveBeenCalledWith(
      7,
      2,
      5,
      expect.objectContaining({
        from: undefined,
        to: undefined,
        bookingStatus: undefined,
      }),
    );
  });
});
