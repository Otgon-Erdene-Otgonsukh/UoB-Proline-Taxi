/**
 * @jest-environment node
 */

import { POST } from "@/app/api/update_booking/route";
import { getUserListAccess, getUserCountAccess, updateUserAccess } from "@/backend/access/user_access";

// Mock the database, isAdmin, and getBookingDetails functions
jest.mock("@/backend/access/user_access", () => ({
  // ...jest.requireActual("@/backend/access/user_access"),
  getUserListAccess: jest.fn().mockResolvedValue([
    {
      user_id: 1,
      name: "John Doe",
      email: "john@test.com",
      phone_number: "12345678",
      department: { dep_name: "IT" },
      role: "normalUser",
      user_status: 0, // pending
    }
  ]),
  getUserCountAccess: jest.fn().mockResolvedValue(1),
  updateUserAccess: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../../auth", () => ({
  auth: jest.fn().mockResolvedValue({
    user: { user_id: 3 }
  })
}));
