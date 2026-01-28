/**
 * @jest-environment node
 */

import { GET, POST } from "@/app/api/user-manage/route";
import { getUserListAccess, getUserCountAccess, updateUserAccess, isAdmin } from "@/backend/access/user_access";
import { NextRequest } from "next/server";
import { auth } from "@/auth";

const mockUserData = {
  user_id: 1,
  name: "John Doe",
  email: "john@test.com",
  phone_number: "12345678",
  department: { dep_name: "IT" },
  role: "normalUser",
  user_status: 0, // pending
}

jest.mock("../../auth", () => ({
  auth: jest.fn().mockResolvedValue({
    user: { user_id: 3 }
  })
}));
jest.mock("@/backend/access/user_access");

describe("Admin API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("unauthenticated GET request", async () => {
    // Mock the database, isAdmin, and getBookingDetails functions

    (isAdmin as jest.Mock).mockResolvedValue(true);

    const req = new NextRequest(
      "http://localhost:3000/api/user-manage?page=1&pageSize=10",
      { method: "GET" }
    );

    (auth as jest.Mock).mockResolvedValue(null);

    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  test("admin permission check fails", async () => {
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest(
      "http://localhost:3000/api/user-manage?page=1&pageSize=10",
      { method: "GET" }
    );

    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  test("user manage get api works", async () => {

    // Mock auth to return null (unauthenticated)
    (auth as jest.Mock).mockResolvedValue({
      user: { user_id: 3 }
    });

    (getUserListAccess as jest.Mock).mockResolvedValue([mockUserData]);
    (getUserCountAccess as jest.Mock).mockResolvedValue(1);
    (isAdmin as jest.Mock).mockResolvedValue(true);

    const req = new NextRequest("http://localhost:3000/api/user-manage?page=1&pageSize=10", {
      method: "GET",
    });

    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.userList).toHaveLength(1);
    expect(data.userCount).toBe(1);
  });

  test("user manage post api works", async () => {

    // Mock auth to return null (unauthenticated)
    (auth as jest.Mock).mockResolvedValue({
      user: { user_id: 3 }
    });

    const body = {
      user_id: 1,
      name: "John Doe Updated",
      email: "john.updated@test.com",
      phone_number: "87654321",
      department: "IT",
      role: "normalUser",
      user_status: 1
    };

    (updateUserAccess as jest.Mock).mockResolvedValue(body);
    (isAdmin as jest.Mock).mockResolvedValue(true);

    const req = new NextRequest("http://localhost:3000/api/user-manage", {
      method: "POST",
      body: JSON.stringify({
        userData: body
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  test("user manage post api fails when not admin", async () => {

    // Mock auth to return null (unauthenticated)
    (auth as jest.Mock).mockResolvedValue({
      user: { user_id: 3 }
    });

    const body = {
      user_id: 1,
      name: "John Doe Updated",
      email: "john.updated@test.com",
      phone_number: "87654321",
      department: "IT",
      role: "normalUser",
      user_status: 1
    };
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest("http://localhost:3000/api/user-manage", {
      method: "POST",
      body: JSON.stringify({
        userData: body
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  test("user manage post api fails to update user", async () => {

    // Mock auth to return null (unauthenticated)
    (auth as jest.Mock).mockResolvedValue({
      user: { user_id: 3 }
    });

    const body = {
      user_id: 1,
      name: "John Doe Updated",
      email: "john.updated@test.com",
      phone_number: "87654321",
      department: "IT",
      role: "normalUser",
      user_status: 1
    };
    (updateUserAccess as jest.Mock).mockResolvedValue(null); // return null means update failed in db
    (isAdmin as jest.Mock).mockResolvedValue(true);

    const req = new NextRequest("http://localhost:3000/api/user-manage", {
      method: "POST",
      body: JSON.stringify({
        userData: body
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  test("user manage post api fails when unauthenticated", async () => {

    // Mock auth to return null (unauthenticated)
    (auth as jest.Mock).mockResolvedValue(null);

    const body = {
      user_id: 1,
      name: "John Doe Updated",
      email: "john.updated@test.com",
      phone_number: "87654321",
      department: "IT",
      role: "normalUser",
      user_status: 1
    };
    const req = new NextRequest("http://localhost:3000/api/user-manage", {
      method: "POST",
      body: JSON.stringify({
        userData: body
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });
});