/**
 * @jest-environment node
 */

import { POST } from "@/app/api/create_booking/route";
import createBooking from "@/backend/create_booking/create_booking";
import { auth } from "@/auth";
import { render } from "@react-email/components";
import { sesClient } from "@/utils/ses_client";
import { prismaMock } from "@/utils/singleton";
import { getUserFromID } from "@/backend/access/user_access";

jest.mock("../../backend/create_booking/create_booking.ts");
jest.mock("../../auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@react-email/components", () => ({
  render: jest.fn(),
}));

jest.mock("../../utils/ses_client.ts", () => ({
  sesClient: {
    send: jest.fn(),
  },
}));

jest.mock("@aws-sdk/client-sesv2", () => ({
  SendEmailCommand: jest.fn(),
}));

global.fetch = jest.fn()

jest.mock("@/backend/access/user_access", () => ({
  getUserFromID: jest.fn(),
}));

describe("create booking api route tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("create booking api works", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: {
        user_id: 3,
      },
    });

    prismaMock.booking.create.mockResolvedValue(undefined);
    prismaMock.trip.create.mockResolvedValue({ trip_id: 1 });
    (render as jest.Mock).mockResolvedValue("<div>Mocked Booking Info</div>");

    (sesClient.send as jest.Mock).mockResolvedValue(undefined);

    const jsonBody = {
      user_id: 3,
      pickup_location: {
        short_name: "Physics Laboratory",
        lat: 51.4585453,
        lng: -2.6021440,
        address: "H.H. Wills Physics Laboratory, Tyndall Avenue, Tyndall's Park, Cotham, Bristol, City of Bristol, West of England, England, BS8 1TL, United Kingdom"
      },
      dropoff_location: { 
        short_name: "Wills Memorial Building",
        lat: 51.455927,
        lng: -2.604696,
        address: "Wills Memorial Building, Queen's Road, Tyndall's Park, City Centre, Bristol, City of Bristol, West of England, England, BS8 1RJ, United Kingdom"
      },
      pickup_time: "2024-12-01T10:00:00Z",
      passenger_name: "John",
      email: "test@example.com",
      tel_number: "1234567890",
      additional_info: "Some info",
      via: [
        { 
          short_name: "Victoria Rooms",
          lat: 51.458173,
          lng: -2.609358,
          address: "Victoria Rooms, Whiteladies Road, Tyndall's Park, Clifton, Bristol, City of Bristol, West of England, England, BS8 2PY, United Kingdom"
        }
      ],
      passengers: 1,
      airport: "LHR",
      flight_num: "BA123",
      dep_id: 2,
    };

    const req = new Request("http://localhost:3000/api/create_booking", {
      method: "POST",
      body: JSON.stringify(jsonBody),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(createBooking).toHaveBeenCalledTimes(1);
    expect(createBooking).toHaveBeenCalledWith(
      3, // from session.user.user_id
      jsonBody.pickup_location,
      jsonBody.dropoff_location,
      expect.any(Date),
      undefined, // no return_time
      jsonBody.passenger_name,
      jsonBody.email,
      jsonBody.tel_number,
      jsonBody.additional_info,
      jsonBody.via,
      undefined, // no returnTo
      jsonBody.passengers,
      jsonBody.airport,
      jsonBody.flight_num,
      2
    );
  });

  test("when no session exists, the request is denied", async () => {
    (auth as jest.Mock).mockResolvedValue(null);
    prismaMock.booking.create.mockResolvedValue(undefined);
    const jsonBody = {
      user_id: 3,
      pickup_location: "Test",
      dropoff_location: "test",
      pickup_time: "",
      returnDT: "",
      first_name: "",
      email: "",
      tel_number: "",
      additional_info: "",
      via: "",
      returnTo: "",
      passengers: 1,
      airport: "",
      flight_num: "",
    };
    const req = new Request("http://localhost:3000/api/create_booking", {
      method: "POST",
      body: JSON.stringify(jsonBody),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  test("returns 400 when location is invalid", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [
        {
          lat: "1",
          lon: "1",
          display_name: "same",
          name: "same",
        },
      ],
    });

    const req = new Request("http://test", {
      method: "POST",
      body: JSON.stringify({
        pickup_location: { address: "", short_name: "", lat: 1, lng: 1 },
        dropoff_location: { address: "A", short_name: "A", lat: 1, lng: 1 },
        pickup_time: new Date().toISOString(),
        passenger_name: "A",
        email: "a",
        tel_number: "1",
        additional_info: "",
        via: [],
        passengers: 1,
        airport: null,
        flight_num: "",
        dep_id: 1,
      }),
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  test("returns 400 when duplicate locations exist", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [
        {
          lat: "1",
          lon: "1",
          display_name: "same",
          name: "same",
        },
      ],
    });

    const loc = {
      address: "same",
      short_name: "same",
      lat: 1,
      lng: 1,
    };

    const req = new Request("http://test", {
      method: "POST",
      body: JSON.stringify({
        pickup_location: loc,
        dropoff_location: loc,
        pickup_time: new Date().toISOString(),
        passenger_name: "A",
        email: "a",
        tel_number: "1",
        additional_info: "",
        via: [],
        passengers: 1,
        airport: null,
        flight_num: "",
        dep_id: 1,
      }),
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  test("returns 201 when passenger number > 5", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });

    const loc = {
      address: "A",
      short_name: "A",
      lat: 1,
      lng: 1,
    };

    const req = new Request("http://test", {
      method: "POST",
      body: JSON.stringify({
        pickup_location: loc,
        dropoff_location: { ...loc, address: "B" },
        pickup_time: new Date().toISOString(),
        passenger_name: "A",
        email: "a",
        tel_number: "1",
        additional_info: "",
        via: [],
        passengers: 6,
        airport: null,
        flight_num: "",
        dep_id: 1,
      }),
    });

    const res = await POST(req);

    expect(res.status).toBe(201);
  });

  test("returns 400 when nominatim returns no results", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const loc = {
      address: "random",
      short_name: "random",
      lat: 1,
      lng: 1,
    };

    const req = new Request("http://test", {
      method: "POST",
      body: JSON.stringify({
        pickup_location: loc,
        dropoff_location: { ...loc, address: "B" },
        pickup_time: new Date().toISOString(),
        passenger_name: "A",
        email: "a",
        tel_number: "1",
        additional_info: "",
        via: [],
        passengers: 1,
        airport: null,
        flight_num: "",
        dep_id: 1,
      }),
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  test("returns 500 when fetch fails", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => [],
    });

    const loc = {
      address: "random",
      short_name: "random",
      lat: 1,
      lng: 1,
    };

    const req = new Request("http://test", {
      method: "POST",
      body: JSON.stringify({
        pickup_location: loc,
        dropoff_location: { ...loc, address: "B" },
        pickup_time: new Date().toISOString(),
        passenger_name: "A",
        email: "a",
        tel_number: "1",
        additional_info: "",
        via: [],
        passengers: 1,
        airport: null,
        flight_num: "",
        dep_id: 1,
      }),
    });

    const res = await POST(req);

    expect(res.status).toBe(500);
  });
});

jest.clearAllMocks();