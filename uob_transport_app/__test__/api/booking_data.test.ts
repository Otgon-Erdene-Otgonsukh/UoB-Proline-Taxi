/**
 * @jest-environment node
 */

import { GET } from "@/app/api/booking-data/route";
import { auth } from "@/auth";
import { getDepartmentIdfromUserId } from "@/backend/access/departments_access";
import { prismaMock } from "@/utils/singleton";

jest.mock("../../auth", () => ({
  auth: jest.fn(),
}));
jest.mock("../../backend/access/departments_access");

describe("Booking data api endpoint branch tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Returns counts for a logged in user with a department", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 3 } });
    (getDepartmentIdfromUserId as jest.Mock).mockResolvedValue({ dep_id: 7 });

    (prismaMock.booking.count as jest.Mock)
      .mockResolvedValueOnce(10) // total
      .mockResolvedValueOnce(3) // pending
      .mockResolvedValueOnce(4) // approved
      .mockResolvedValueOnce(3); // rejected
    (prismaMock.trip.count as jest.Mock).mockResolvedValueOnce(1);

    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual({
      total: 10,
      pending: 3,
      approved: 4,
      rejected: 3,
      overdue: 1,
    });
  });

  test("Falls back to -1 dep id when user not signed in", async () => {
    (auth as jest.Mock).mockResolvedValue(null);
    (prismaMock.booking.count as jest.Mock).mockResolvedValue(0);
    (prismaMock.trip.count as jest.Mock).mockResolvedValue(0);

    const res = await GET();
    expect(res.status).toBe(200);
    expect(getDepartmentIdfromUserId).not.toHaveBeenCalled();
  });

  test("Returns 500 when a DB call fails", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 3 } });
    (getDepartmentIdfromUserId as jest.Mock).mockResolvedValue({ dep_id: 7 });
    (prismaMock.booking.count as jest.Mock).mockRejectedValue(new Error("db"));

    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.message).toBe("Something went wrong.");
  });
});
