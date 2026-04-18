/**
 * @jest-environment node
 */

import { POST } from "@/app/api/departments/add/route";
import { createNewDepartmentAccess } from "@/backend/access/departments_access";
import { NextRequest } from "next/server";

jest.mock("../../backend/access/departments_access");

const buildReq = (body: object) =>
  new NextRequest("http://localhost:3000/api/departments/add", {
    method: "POST",
    body: JSON.stringify(body),
  });

describe("Departments add api endpoint branch tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Empty name returns 201 error", async () => {
    const res = await POST(buildReq({ depName: "" }));
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.message).toBe("There was an error creating an department");
    expect(createNewDepartmentAccess).not.toHaveBeenCalled();
  });

  test("Successful creation returns 200", async () => {
    (createNewDepartmentAccess as jest.Mock).mockResolvedValue({ dep_id: 5 });
    const res = await POST(buildReq({ depName: "Arts" }));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.message).toBe("Department is created successfully.");
    expect(createNewDepartmentAccess).toHaveBeenCalledWith("Arts");
  });

  test("Failed creation returns 201", async () => {
    (createNewDepartmentAccess as jest.Mock).mockResolvedValue(null);
    const res = await POST(buildReq({ depName: "Arts" }));
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.message).toBe("There was an error creating an department");
  });
});
