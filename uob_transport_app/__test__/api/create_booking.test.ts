/**
 * @jest-environment node
 */

import { POST } from "@/app/api/create_booking/route";
import createBooking from "@/backend/create_booking/create_booking";
import { auth } from "@/auth";
import { render } from "@react-email/components";
import { sesClient } from "@/utils/ses_client";

jest.mock("../../backend/create_booking/create_booking.ts");
jest.mock("../../auth", () => ({
  auth: jest.fn(),
}));
jest.mock("../../generated/prisma/client.ts");

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

jest.mock("../../generated/prisma/client.ts", () => {
  const MockPrismaClient = jest.fn(() => ({
    user: {
      findUnique: jest.fn(),
    },
    booking: {
      create: jest.fn(),
    },
  }));

  // Return both the class and the mock methods
  return {
    PrismaClient: MockPrismaClient,
  };
});

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

    (createBooking as jest.Mock).mockResolvedValue(undefined);
    (render as jest.Mock).mockResolvedValue("<div>Mocked Booking Info</div>");

    (sesClient.send as jest.Mock).mockResolvedValue(undefined);

    const jsonBody = {
      user_id: 3,
      pickup_location: "Test",
      dropoff_location: "test",
      pickup_time: "2024-12-01T10:00:00Z",
      first_name: "John",
      surname: "Doe",
      email: "test@example.com",
      tel_number: "1234567890",
      additional_info: "Some info",
      via: "Via location",
      passengers: 1,
      department: "Engineering",
      airport: "LHR",
      flight_num: "BA123",
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
      null,
      null,
      jsonBody.dropoff_location,
      null,
      null,
      expect.any(Date),
      undefined, // no return_time
      jsonBody.first_name,
      jsonBody.surname,
      jsonBody.email,
      jsonBody.tel_number,
      jsonBody.additional_info,
      jsonBody.via,
      undefined, // no returnTo
      jsonBody.passengers,
      jsonBody.department,
      jsonBody.airport,
      jsonBody.flight_num,
    );
  });

  test("when no session exists, the request is denied", async () => {
    (auth as jest.Mock).mockResolvedValue(null);
    (createBooking as jest.Mock).mockResolvedValue(undefined);
    const jsonBody = {
      user_id: 3,
      pickup_location: "Test",
      dropoff_location: "test",
      pickup_time: "",
      returnDT: "",
      first_name: "",
      surname: "",
      email: "",
      tel_number: "",
      additional_info: "",
      via: "",
      returnTo: "",
      passengers: 1,
      department: "",
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
});

jest.clearAllMocks();