/**
 * @jest-environment node
 */

import { GET } from "@/app/api/departments/user/route";
import { getUsersByDepIdAccess } from "@/backend/access/user_access";
import { NextRequest } from "next/server";

jest.mock("../../backend/access/user_access");

describe("Departments user api endpoint tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Missing depId returns 400", async () => {
    const req = new NextRequest("http://localhost:3000/api/departments/user");
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("Department ID is required");
    expect(getUsersByDepIdAccess).not.toHaveBeenCalled();
  });

  test("Returns users for a given depId", async () => {
    (getUsersByDepIdAccess as jest.Mock).mockResolvedValue([
      { user_id: 1, full_name: "A" },
    ]);
    const req = new NextRequest(
      "http://localhost:3000/api/departments/user?depId=5",
    );
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual([{ user_id: 1, full_name: "A" }]);
    expect(getUsersByDepIdAccess).toHaveBeenCalledWith(5);
  });
});
