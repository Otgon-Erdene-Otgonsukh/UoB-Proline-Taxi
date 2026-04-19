/**
 * @jest-environment node
 */

import { GET } from "@/app/api/departments/route";
import { getDepartmentsListAccess } from "@/backend/access/departments_access";
import { NextRequest } from "next/server";

jest.mock("../../backend/access/departments_access");

describe("Departments list api endpoint tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Returns full list when no depName filter is given", async () => {
    (getDepartmentsListAccess as jest.Mock).mockResolvedValue([
      { dep_id: 1, dep_name: "Arts" },
    ]);
    const req = new NextRequest("http://localhost:3000/api/departments");
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual([{ dep_id: 1, dep_name: "Arts" }]);
    expect(getDepartmentsListAccess).toHaveBeenCalledWith(undefined);
  });

  test("Passes depName filter through to access layer", async () => {
    (getDepartmentsListAccess as jest.Mock).mockResolvedValue([]);
    const req = new NextRequest(
      "http://localhost:3000/api/departments?depName=Arts",
    );
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(getDepartmentsListAccess).toHaveBeenCalledWith("Arts");
  });
});
