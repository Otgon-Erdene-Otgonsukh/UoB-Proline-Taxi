/**
 * @jest-environment node
 */

import { POST } from "@/app/api/update_booking/route";
import { auth } from "@/auth";
import { getBookingDetails } from "@/backend/access/booking_access";
import { isAdmin, getUserFromID } from "@/backend/access/user_access";
import updateBooking from "@/backend/update_booking_details/update_booking_details";

jest.mock("../../auth", () => ({
  auth: jest.fn(),
}));
jest.mock("../../backend/access/booking_access");
jest.mock("../../backend/access/user_access");
jest.mock("../../backend/update_booking_details/update_booking_details");

const validLoc = (short: string, address: string, lat: number, lng: number) => ({
  short_name: short,
  address,
  lat,
  lng,
});

const baseBody = {
  booking_id: 1,
  pickup_location: validLoc("Pickup", "UoB, Bristol, United Kingdom", 51.45, -2.6),
  dropoff_location: validLoc(
    "Dropoff",
    "Temple Meads, Bristol, United Kingdom",
    51.44,
    -2.58,
  ),
  passenger_name: "Alice",
  email: "a@e.com",
  tel_number: "123",
  pickup_time: "2025-01-01T10:00:00Z",
  additional_info: "",
  via: [],
  returnTo: undefined,
  passengers: 2,
  passenger_num: 2,
  flight_num: "",
  airport: null,
  isLeadPassengerMyself: false,
  dep_id: 2,
};

const buildReq = (body: object) =>
  new Request("http://localhost:3000/api/update_booking", {
    method: "POST",
    body: JSON.stringify(body),
  });

describe("Update booking api endpoint branch tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => [
        {
          lat: "51.45",
          lon: "-2.6",
          name: "Pickup",
          display_name: "UoB, Bristol, United Kingdom",
        },
        {
          lat: "51.44",
          lon: "-2.58",
          name: "Dropoff",
          display_name: "Temple Meads, Bristol, United Kingdom",
        },
      ],
    })) as jest.Mock;
  });

  test("Unauthenticated user request is rejected", async () => {
    (auth as jest.Mock).mockResolvedValue(null);
    const res = await POST(buildReq(baseBody));
    expect(res.status).toBe(401);
  });

  test("Empty location address is rejected with 400", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    const bad = {
      ...baseBody,
      pickup_location: validLoc("", "", 0, 0),
    };
    const res = await POST(buildReq(bad));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain("Reqired location cannot be null");
  });

  test("Duplicate locations are rejected with 400", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    const dup = {
      ...baseBody,
      dropoff_location: validLoc(
        "Pickup",
        "UoB, Bristol, United Kingdom",
        51.45,
        -2.6,
      ),
    };
    const res = await POST(buildReq(dup));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("Cannot have duplicate locations.");
  });

  test("Passenger count over 5 is rejected", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    const res = await POST(buildReq({ ...baseBody, passengers: 10 }));
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.error).toBe("Passenger number cannot be more than 5.");
  });

  test("Admin successfully updates a booking", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (getBookingDetails as jest.Mock).mockResolvedValue({
      booking_id: 1,
      user_id: 3,
    });
    (updateBooking as jest.Mock).mockResolvedValue(undefined);

    const res = await POST(buildReq(baseBody));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(getBookingDetails).toHaveBeenCalledWith(-1, 1);
    expect(updateBooking).toHaveBeenCalled();
  });

  test("Returns 404 when booking not found", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (isAdmin as jest.Mock).mockResolvedValue(false);
    (getBookingDetails as jest.Mock).mockResolvedValue(null);

    const res = await POST(buildReq(baseBody));
    const data = await res.json();
    expect(res.status).toBe(404);
    expect(data.success).toBe(false);
  });

  test("Returns 400 when update throws", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (getBookingDetails as jest.Mock).mockResolvedValue({
      booking_id: 1,
      user_id: 3,
    });
    (updateBooking as jest.Mock).mockRejectedValue(new Error("db"));
    const res = await POST(buildReq(baseBody));
    expect(res.status).toBe(400);
  });

  test("Lead passenger self-fill fetches user from ID", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (getBookingDetails as jest.Mock).mockResolvedValue({
      booking_id: 1,
      user_id: 3,
    });
    (getUserFromID as jest.Mock).mockResolvedValue({ user_id: 3 });
    (updateBooking as jest.Mock).mockResolvedValue(undefined);

    const res = await POST(
      buildReq({ ...baseBody, isLeadPassengerMyself: true }),
    );
    expect(res.status).toBe(200);
    expect(getUserFromID).toHaveBeenCalledWith(3);
  });
});
