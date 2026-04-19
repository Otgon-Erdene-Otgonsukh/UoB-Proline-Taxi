/**
 * @jest-environment node
 */

import { GET } from "@/app/api/dep_booking_count/route";
import { auth } from "@/auth";
import { isAdmin } from "@/backend/access/user_access";
import { prismaMock } from "@/utils/singleton";

jest.mock("../../auth", () => ({
  auth: jest.fn(),
}));
jest.mock("../../backend/access/user_access");

describe("dep_booking_count api endpoint branch tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Unauthenticated user request is rejected", async () => {
    (auth as jest.Mock).mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  test("Non-admin user request is forbidden", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (isAdmin as jest.Mock).mockResolvedValue(false);
    const res = await GET();
    expect(res.status).toBe(403);
  });

  test("Admin user gets cleaned department booking counts", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (prismaMock.department.findMany as jest.Mock).mockResolvedValue([
      { dep_id: 1, dep_name: "Arts", _count: { booking: 5 } },
      { dep_id: 2, dep_name: "Eng", _count: { booking: 2 } },
    ]);
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual([
      { dep_id: 1, dep_name: "Arts", count: 5 },
      { dep_id: 2, dep_name: "Eng", count: 2 },
    ]);
  });

  test("DB error returns 500", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 1 } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (prismaMock.department.findMany as jest.Mock).mockRejectedValue(
      new Error("db"),
    );
    const res = await GET();
    expect(res.status).toBe(500);
  });
});
