/**
 * @jest-environment node
 */

import { POST } from "@/app/api/departments/edit/route";
import { updateDepartmentNameAccess } from "@/backend/access/departments_access";
import { NextRequest } from "next/server";

jest.mock("../../backend/access/departments_access");

const buildReq = (body: object) =>
  new NextRequest("http://localhost:3000/api/departments/edit", {
    method: "POST",
    body: JSON.stringify(body),
  });

describe("Departments edit api endpoint branch tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Missing depId returns 201", async () => {
    const res = await POST(buildReq({ depName: "Arts" }));
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.message).toBe("Department id is required.");
    expect(updateDepartmentNameAccess).not.toHaveBeenCalled();
  });

  test("Empty name returns 201", async () => {
    const res = await POST(buildReq({ depId: 2, depName: "" }));
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.message).toBe("Department name is required.");
    expect(updateDepartmentNameAccess).not.toHaveBeenCalled();
  });

  test("Successful edit returns 200", async () => {
    (updateDepartmentNameAccess as jest.Mock).mockResolvedValue({ dep_id: 2 });
    const res = await POST(buildReq({ depId: 2, depName: "Arts" }));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.message).toBe("Department name is updated successfully.");
    expect(updateDepartmentNameAccess).toHaveBeenCalledWith(2, "Arts");
  });

  test("Failed edit returns 201", async () => {
    (updateDepartmentNameAccess as jest.Mock).mockResolvedValue(null);
    const res = await POST(buildReq({ depId: 2, depName: "Arts" }));
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.message).toBe(
      "There was an error updating the department name",
    );
  });
});
