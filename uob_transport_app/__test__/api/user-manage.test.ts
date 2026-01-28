/**
 * @jest-environment node
 */

import { GET, POST } from "@/app/api/user-manage/route";
import { getUserListAccess, getUserCountAccess, updateUserAccess, isAdmin } from "@/backend/access/user_access";
import { NextRequest } from "next/server";

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

test("user manage get api works", async () => {

  // Mock the database, isAdmin, and getBookingDetails functions

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


