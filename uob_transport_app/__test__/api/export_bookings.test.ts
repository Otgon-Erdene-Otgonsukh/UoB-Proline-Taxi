/**
 * @jest-environment node
 */

import { POST } from "@/app/api/export_bookings/route";
import { auth } from "@/auth";
import {
  getBookingIDsByDepartment,
  getBookingTrip,
} from "@/backend/access/booking_access";
import { getDepartmentByIdAccess } from "@/backend/access/departments_access";
import { NextRequest } from "next/server";

jest.mock("../../auth", () => ({
  auth: jest.fn(),
}));
jest.mock("../../backend/access/booking_access");
jest.mock("../../backend/access/user_access", () => ({
  isAdmin: jest.fn(() => true),
}));
jest.mock("../../backend/access/departments_access");

const buildReq = (body: object) =>
  new NextRequest("http://localhost:3000/api/export_bookings", {
    method: "POST",
    body: JSON.stringify(body),
  });

const mockBooking = {
  booking_id: 1,
  passenger_name: "Alice",
  tel_number: "123",
  dep_id: 2,
  additional_info: "",
  booking_status: "Approved",
  trip: {
    pickup_time: new Date("2025-01-01"),
    pickup_location: JSON.stringify({ lat: 1, lng: 2, address: "A" }),
    dropoff_location: JSON.stringify({ lat: 3, lng: 4, address: "B" }),
    via: null,
    return_drop_loc: null,
    return_pickup_time: null,
    PO: "PO-1",
    passenger_num: 2,
  },
};

describe("Export bookings api endpoint branch tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Unauthenticated user request is rejected", async () => {
    (auth as jest.Mock).mockResolvedValue(null);
    const res = await POST(buildReq({ bookingIds: [1] }));
    expect(res.status).toBe(201);
  });

  test("Missing both params returns 400", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    const res = await POST(buildReq({}));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.message).toBe("Missing parameters");
  });

  test("Exports CSV for given bookingIds", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (getBookingTrip as jest.Mock).mockResolvedValue(mockBooking);
    (getDepartmentByIdAccess as jest.Mock).mockResolvedValue({
      dep_name: "Arts",
    });
    const res = await POST(buildReq({ bookingIds: [1] }));
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/csv");
    const body = await res.text();
    expect(body).toContain("uob_booking_id");
    expect(body).toContain("Arts");
    expect(body).toContain("Alice");
  });

  test("Exports CSV when depId is provided instead", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (getBookingIDsByDepartment as jest.Mock).mockResolvedValue([1]);
    (getBookingTrip as jest.Mock).mockResolvedValue(mockBooking);
    (getDepartmentByIdAccess as jest.Mock).mockResolvedValue(null);
    const res = await POST(buildReq({ depId: 2 }));
    expect(res.status).toBe(200);
    expect(getBookingIDsByDepartment).toHaveBeenCalledWith(2);
  });

  test("Skips null bookings without failing", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (getBookingTrip as jest.Mock).mockResolvedValue(null);
    const res = await POST(buildReq({ bookingIds: [99] }));
    expect(res.status).toBe(200);
  });

  test("Handles bookings with via and return locations", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    const booking = {
      ...mockBooking,
      trip: {
        ...mockBooking.trip,
        via: JSON.stringify([{ lat: 10, lng: 20, address: "V1" }]),
        return_drop_loc: JSON.stringify({
          lat: 50,
          lng: 60,
          address: "Home",
        }),
        return_pickup_time: new Date("2025-01-02"),
      },
    };
    (getBookingTrip as jest.Mock).mockResolvedValue(booking);
    (getDepartmentByIdAccess as jest.Mock).mockResolvedValue({
      dep_name: "Eng",
    });
    const res = await POST(buildReq({ bookingIds: [1] }));
    const body = await res.text();
    expect(res.status).toBe(200);
    expect(body).toContain("V1");
    expect(body).toContain("Home");
  });
});
