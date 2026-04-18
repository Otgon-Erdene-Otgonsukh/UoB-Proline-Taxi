/**
 * @jest-environment node
 */

import { POST } from "@/app/api/price-attach/route";
import { auth } from "@/auth";
import { prismaMock } from "@/utils/singleton";
import { USER_ROLE } from "@/model/models";
import { sesClient } from "@/utils/ses_client";

jest.mock("../../auth", () => ({
  auth: jest.fn(),
}));
jest.mock("../../utils/ses_client", () => ({
  sesClient: { send: jest.fn() },
}));
jest.mock("@react-email/components", () => ({
  render: jest.fn().mockResolvedValue("<html></html>"),
}));
jest.mock("../../components/emails/booking_price", () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

const buildReq = (body: object) =>
  new Request("http://localhost:3000/api/price-attach", {
    method: "POST",
    body: JSON.stringify(body),
  });

describe("Price attach api endpoint branch tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Unauthenticated user request is rejected", async () => {
    (auth as jest.Mock).mockResolvedValue(null);
    const res = await POST(buildReq({ booking_id: 1, price: "10" }));
    expect(res.status).toBe(401);
  });

  test("Non-super-admin user request is forbidden", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { user_id: 1, account_type: USER_ROLE.NORMAL_USER },
    });
    const res = await POST(buildReq({ booking_id: 1, price: "10" }));
    expect(res.status).toBe(403);
  });

  test("Super admin successfully attaches a price and sends email", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { user_id: 1, account_type: USER_ROLE.SUPER_ADMIN },
    });
    (prismaMock.booking.update as jest.Mock).mockResolvedValue({});
    (prismaMock.booking.findUnique as jest.Mock).mockResolvedValue({
      booking_id: 1,
      dep_id: 2,
      passenger_name: "Alice",
      tel_number: "123",
      department: { dep_name: "Arts" },
      trip: {
        pickup_location: JSON.stringify({ lat: 1, lng: 2, address: "A" }),
        dropoff_location: JSON.stringify({ lat: 3, lng: 4, address: "B" }),
        via: null,
        airport: null,
        flight_num: null,
        pickup_time: new Date("2025-01-01"),
        return_pickup_time: null,
        return_drop_loc: null,
      },
    });
    (prismaMock.user.findMany as jest.Mock).mockResolvedValue([
      { email: "finance@e.com" },
    ]);
    (sesClient.send as jest.Mock).mockResolvedValue(undefined);

    const res = await POST(buildReq({ booking_id: 1, price: "10" }));
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.message).toBe("Price attached successfully");
    expect(sesClient.send).toHaveBeenCalled();
  });

  test("Booking not found returns 404", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { user_id: 1, account_type: USER_ROLE.SUPER_ADMIN },
    });
    (prismaMock.booking.update as jest.Mock).mockResolvedValue({});
    (prismaMock.booking.findUnique as jest.Mock).mockResolvedValue(null);
    (prismaMock.user.findMany as jest.Mock).mockResolvedValue([]);
    const res = await POST(buildReq({ booking_id: 99, price: "10" }));
    expect(res.status).toBe(404);
  });

  test("DB error returns 500", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { user_id: 1, account_type: USER_ROLE.SUPER_ADMIN },
    });
    (prismaMock.booking.update as jest.Mock).mockRejectedValue(new Error("db"));
    const res = await POST(buildReq({ booking_id: 1, price: "10" }));
    expect(res.status).toBe(500);
  });
});
