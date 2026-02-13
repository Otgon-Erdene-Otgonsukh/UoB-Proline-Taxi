/**
 * @jest-environment node
 */

import { updateUserPassowrdAccess } from "@/backend/access/user_access";
import {
  getUserResetByUuidAccess,
  deleteUserResetAccess,
} from "@/backend/access/user_reset_access";
import { POST } from "@/app/api/reset-password/route";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

jest.mock("../../backend/access/user_access");
jest.mock("../../backend/access/user_reset_access");
jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

describe("Password reset api endpoint branch tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Password length server side validation rejects requests", async () => {
    const short = {
      uuid: "12341123",
      password: "abc",
    };

    const long = {
      uuid: "123121",
      password: "d".repeat(65),
    };

    const req = new NextRequest("http://localhost:3000/api/reset-password", {
      method: "POST",
      body: JSON.stringify(short),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.message).toBe("Password too short.");

    const req2 = new NextRequest("http://localhost:3000/api/reset-password", {
      method: "POST",
      body: JSON.stringify(long),
    });
    const res2 = await POST(req2);
    const data2 = await res2.json();
    expect(res2.status).toBe(400);
    expect(data2.message).toBe("Password too long.");
  });

  test("Valid expiry timed request is processed correctly", async () => {
    const data = {
        uuid: "2313",
        password: "newPass"
    };

    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
    (getUserResetByUuidAccess as jest.Mock).mockResolvedValue({
      expired_at: new Date("2100-12-31"),
      email: "reset@gmail.com",
      id: 2
    });
    (updateUserPassowrdAccess as jest.Mock).mockResolvedValue(undefined);
    (deleteUserResetAccess as jest.Mock).mockResolvedValue(undefined);
    const req = new NextRequest("http://localhost:3000/api/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  test("Expired link only deletes the reset access entry and returns 201", async () => {
    const data = {
        uuid: "2313",
        password: "newPass"
    };
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
    (getUserResetByUuidAccess as jest.Mock).mockResolvedValue({
      expired_at: new Date("2020-12-31"),
    });
    (deleteUserResetAccess as jest.Mock).mockResolvedValue(undefined);
    const req = new NextRequest("http://localhost:3000/api/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const res = await POST(req);
    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json.message).toBe("This link has been expired!")
  })
});
