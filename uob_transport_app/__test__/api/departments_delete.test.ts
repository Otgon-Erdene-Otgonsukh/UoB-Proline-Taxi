/**
 * @jest-environment node
 */

import { POST } from "@/app/api/departments/delete/route";
import { deleteDepartmentAccess } from "@/backend/access/departments_access";
import { NextRequest } from "next/server";

jest.mock("../../backend/access/departments_access");

const buildReq = (body: object) =>
  new NextRequest("http://localhost:3000/api/departments/delete", {
    method: "POST",
    body: JSON.stringify(body),
  });

describe("Departments delete api endpoint branch tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Successful deletion returns 200", async () => {
    (deleteDepartmentAccess as jest.Mock).mockResolvedValue({ dep_id: 3 });
    const res = await POST(buildReq({ depId: 3 }));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.message).toBe("Department is deleted successfully.");
    expect(deleteDepartmentAccess).toHaveBeenCalledWith(3);
  });

  test("Failed deletion returns 201", async () => {
    (deleteDepartmentAccess as jest.Mock).mockResolvedValue(null);
    const res = await POST(buildReq({ depId: 3 }));
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.message).toBe("There was an error deleting the department");
  });
});
