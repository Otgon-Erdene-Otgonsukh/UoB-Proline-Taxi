/**
 * @jest-environment node
 */

import { POST } from "@/app/api/departments/multi-user-change/route";
import { changeDepartmentForUsersAccess } from "@/backend/access/user_access";
import { NextRequest } from "next/server";

jest.mock("../../backend/access/user_access");

const buildReq = (body: object) =>
  new NextRequest("http://localhost:3000/api/departments/multi-user-change", {
    method: "POST",
    body: JSON.stringify(body),
  });

describe("Departments multi-user-change api endpoint branch tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Negative depId returns 201 error", async () => {
    const res = await POST(buildReq({ depId: -1, userIds: [1, 2] }));
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.message).toBe("There was an error with the payload");
    expect(changeDepartmentForUsersAccess).not.toHaveBeenCalled();
  });

  test("Empty user id list returns 201 error", async () => {
    const res = await POST(buildReq({ depId: 3, userIds: [] }));
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.message).toBe("There was an error with the payload");
    expect(changeDepartmentForUsersAccess).not.toHaveBeenCalled();
  });

  test("Successful update returns 200", async () => {
    (changeDepartmentForUsersAccess as jest.Mock).mockResolvedValue(true);
    const res = await POST(buildReq({ depId: 3, userIds: [1, 2] }));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.message).toBe("Update successfully.");
    expect(changeDepartmentForUsersAccess).toHaveBeenCalledWith([1, 2], 3);
  });

  test("Failed update returns 201", async () => {
    (changeDepartmentForUsersAccess as jest.Mock).mockResolvedValue(false);
    const res = await POST(buildReq({ depId: 3, userIds: [1, 2] }));
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.message).toBe("There was an error, try again later");
  });
});
