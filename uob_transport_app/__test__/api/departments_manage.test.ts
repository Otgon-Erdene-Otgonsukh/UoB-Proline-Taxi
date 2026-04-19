/**
 * @jest-environment node
 */

import { GET } from "@/app/api/departments/manage/route";
import { getDepartmentListIncludeManagerIdAccess } from "@/backend/access/departments_access";
import { getUsersByIdsAccess } from "@/backend/access/user_access";
import { NextRequest } from "next/server";

jest.mock("../../backend/access/departments_access");
jest.mock("../../backend/access/user_access");

describe("Departments manage api endpoint tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Returns departments with managers when managers exist", async () => {
    (getDepartmentListIncludeManagerIdAccess as jest.Mock).mockResolvedValue([
      {
        dep_id: 1,
        dep_name: "Arts",
        manager_id: 5,
        _count: { User: 10 },
      },
      {
        dep_id: 2,
        dep_name: "Eng",
        manager_id: null,
        _count: { User: 3 },
      },
    ]);
    (getUsersByIdsAccess as jest.Mock).mockResolvedValue([
      {
        user_id: 5,
        full_name: "Alice",
        email: "a@e.com",
        phone_number: "123",
        role: "admin",
        user_status: 1,
      },
    ]);

    const req = new NextRequest(
      "http://localhost:3000/api/departments/manage?depName=A",
    );
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data[0]).toEqual({
      depName: "Arts",
      depId: 1,
      userCount: 10,
      manager: expect.objectContaining({ user_id: 5 }),
    });
    expect(data[1].manager).toBeNull();
    expect(getDepartmentListIncludeManagerIdAccess).toHaveBeenCalledWith("A");
    expect(getUsersByIdsAccess).toHaveBeenCalledWith([5]);
  });

  test("Handles empty depName param as undefined", async () => {
    (getDepartmentListIncludeManagerIdAccess as jest.Mock).mockResolvedValue(
      [],
    );
    (getUsersByIdsAccess as jest.Mock).mockResolvedValue([]);
    const req = new NextRequest(
      "http://localhost:3000/api/departments/manage",
    );
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(getDepartmentListIncludeManagerIdAccess).toHaveBeenCalledWith(
      undefined,
    );
  });
});
