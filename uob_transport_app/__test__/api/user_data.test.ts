/**
 * @jest-environment node
 */

import { GET } from "@/app/api/user-data/route";
import { auth } from "@/auth";
import { prismaMock } from "@/utils/singleton";

jest.mock("../../auth", () => ({
  auth: jest.fn(),
}));

describe("User data api endpoint branch tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Unauthenticated user request is rejected", async () => {
    (auth as jest.Mock).mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  test("Returns user with department", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 7 } });
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
      user_id: 7,
      email: "a@e.com",
      department: { dep_id: 1, dep_name: "Arts" },
    });
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.body.user_id).toBe(7);
    expect(data.body.department.dep_name).toBe("Arts");
  });

  test("DB error returns 500", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { user_id: 7 } });
    (prismaMock.user.findUnique as jest.Mock).mockRejectedValue(
      new Error("db"),
    );
    const res = await GET();
    expect(res.status).toBe(500);
  });
});
