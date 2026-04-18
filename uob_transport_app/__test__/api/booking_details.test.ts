/**
 * @jest-environment node
 */

import { GET } from "@/app/api/booking_details/route";
import { auth } from "@/auth";
import {
  getBookingDetails,
  getTripDetails,
} from "@/backend/access/booking_access";
import { isAdmin } from "@/backend/access/user_access";

jest.mock("../../auth", () => ({
  auth: jest.fn(),
}));
jest.mock("../../backend/access/booking_access");
jest.mock("../../backend/access/user_access");

const buildReq = (q: string) =>
  new Request(`http://localhost:3000/api/booking_details${q}`);

describe("Booking details api endpoint branch tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Unauthenticated user request is rejected", async () => {
    (auth as jest.Mock).mockResolvedValue(null);
    const res = await GET(buildReq("?id=1"));
    expect(res.status).toBe(401);
  });

  test("Missing id returns 400", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    const res = await GET(buildReq(""));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.message).toBe("Invalid query parameters.");
  });

  test("Non-numeric id returns 400", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    const res = await GET(buildReq("?id=abc"));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.message).toBe("ID is not an integer.");
  });

  test("Booking not found returns 404", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (isAdmin as jest.Mock).mockResolvedValue(false);
    (getBookingDetails as jest.Mock).mockResolvedValue(null);
    const res = await GET(buildReq("?id=5"));
    const data = await res.json();
    expect(res.status).toBe(404);
    expect(data.message).toBe("Booking not found.");
  });

  test("Trip not found returns 404", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (getBookingDetails as jest.Mock).mockResolvedValue({
      booking_id: 5,
      trip_id: 10,
    });
    (getTripDetails as jest.Mock).mockResolvedValue(null);
    const res = await GET(buildReq("?id=5"));
    const data = await res.json();
    expect(res.status).toBe(404);
    expect(data.message).toBe("Trip details not found.");
  });

  test("Returns 200 with combined booking and parsed trip details", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (getBookingDetails as jest.Mock).mockResolvedValue({
      booking_id: 5,
      trip_id: 10,
    });
    (getTripDetails as jest.Mock).mockResolvedValue({
      pickup_location: JSON.stringify({ lat: 1, lng: 2 }),
      dropoff_location: JSON.stringify({ lat: 3, lng: 4 }),
      via: JSON.stringify([{ lat: 5, lng: 6 }]),
      return_drop_loc: null,
    });

    const res = await GET(buildReq("?id=5"));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.trip.pickup_location).toEqual({ lat: 1, lng: 2 });
    expect(data.trip.via).toEqual([{ lat: 5, lng: 6 }]);
  });

  test("Returns 500 when booking access throws", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (isAdmin as jest.Mock).mockResolvedValue(false);
    (getBookingDetails as jest.Mock).mockRejectedValue(new Error("db"));
    const res = await GET(buildReq("?id=5"));
    expect(res.status).toBe(500);
  });
});
