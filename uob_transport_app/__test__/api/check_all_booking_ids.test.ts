/**
 * @jest-environment node
 */

import { POST } from "@/app/api/check_all_booking_ids/route";
import { auth } from "@/auth";
import { isAdmin } from "@/backend/access/user_access";
import { prismaMock } from "@/utils/singleton";

jest.mock("../../auth", () => ({
  auth: jest.fn(),
}));
jest.mock("../../backend/access/user_access");

const buildReq = (body: object) =>
  new Request("http://localhost:3000/api/check_all_booking_ids", {
    method: "POST",
    body: JSON.stringify(body),
  });

describe("check_all_booking_ids api endpoint branch tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Unauthenticated user request is rejected", async () => {
    (auth as jest.Mock).mockResolvedValue(null);
    const res = await POST(buildReq({}));
    expect(res.status).toBe(401);
  });

  test("Non-admin user request is forbidden", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (isAdmin as jest.Mock).mockResolvedValue(false);
    const res = await POST(buildReq({}));
    expect(res.status).toBe(403);
  });

  test("Admin with all filters returns booking ids", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (prismaMock.booking.findMany as jest.Mock).mockResolvedValue([
      { booking_id: 1 },
      { booking_id: 2 },
    ]);
    const body = {
      from: "A ",
      to: " B",
      pickUpTimeFrom: "2025-01-01",
      pickUpTimeTo: "2025-02-01",
      bookingStatus: "Approved",
    };
    const res = await POST(buildReq(body));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual([1, 2]);
  });

  test("Admin with only pickUpTimeFrom still succeeds", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (prismaMock.booking.findMany as jest.Mock).mockResolvedValue([]);
    const res = await POST(buildReq({ pickUpTimeFrom: "2025-01-01" }));
    expect(res.status).toBe(200);
  });

  test("Admin with only pickUpTimeTo still succeeds", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (prismaMock.booking.findMany as jest.Mock).mockResolvedValue([]);
    const res = await POST(buildReq({ pickUpTimeTo: "2025-02-01" }));
    expect(res.status).toBe(200);
  });

  test("DB error returns 500", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (prismaMock.booking.findMany as jest.Mock).mockRejectedValue(new Error("db"));
    const res = await POST(buildReq({}));
    expect(res.status).toBe(500);
  });
});
