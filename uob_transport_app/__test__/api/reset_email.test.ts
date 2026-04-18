/**
 * @jest-environment node
 */

import { GET, POST } from "@/app/api/reset-email/route";
import { getUserByEmailAccess } from "@/backend/access/user_access";
import {
  createUserResetAccess,
  deleteUserResetAccess,
  getUserResetAccess,
  getUserResetByUuidAccess,
} from "@/backend/access/user_reset_access";
import { generateUuid } from "@/backend/utils/uuid";
import { sesClient } from "@/utils/ses_client";
import { NextRequest } from "next/server";

jest.mock("../../backend/access/user_access");
jest.mock("../../backend/access/user_reset_access");
jest.mock("../../backend/utils/uuid");
jest.mock("../../utils/ses_client", () => ({
  sesClient: { send: jest.fn() },
}));
jest.mock("@react-email/components", () => ({
  render: jest.fn().mockResolvedValue("<html></html>"),
}));
jest.mock("../../components/emails/reset_password_mail", () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));
jest.mock("../../lib/rateLimit", () => ({
  withRateLimit: (config: { getIdentifier: (req: NextRequest) => string }) =>
    (handler: (req: NextRequest) => Promise<Response>) =>
      (req: NextRequest) => {
        // exercise the supplied getIdentifier so it gets covered
        config.getIdentifier(req);
        return handler(req);
      },
}));

const buildPost = (body: object) =>
  new NextRequest("http://localhost:3000/api/reset-email", {
    method: "POST",
    body: JSON.stringify(body),
  });

describe("Reset email api endpoint branch tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (generateUuid as jest.Mock).mockReturnValue("uuid-1");
  });

  test("GET with no uuid returns 201", async () => {
    const req = new NextRequest("http://localhost:3000/api/reset-email");
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.message).toBe("Invalid params");
  });

  test("GET returns 200 when reset record found and not expired", async () => {
    (getUserResetByUuidAccess as jest.Mock).mockResolvedValue({
      id: 1,
      expired_at: new Date("2100-01-01"),
    });
    const req = new NextRequest(
      "http://localhost:3000/api/reset-email?uuid=abc",
    );
    const res = await GET(req);
    expect(res.status).toBe(200);
  });

  test("GET deletes expired record and returns 201", async () => {
    (getUserResetByUuidAccess as jest.Mock).mockResolvedValue({
      id: 5,
      expired_at: new Date("2000-01-01"),
    });
    (deleteUserResetAccess as jest.Mock).mockResolvedValue(undefined);
    const req = new NextRequest(
      "http://localhost:3000/api/reset-email?uuid=abc",
    );
    const res = await GET(req);
    expect(res.status).toBe(201);
    expect(deleteUserResetAccess).toHaveBeenCalledWith(5);
  });

  test("POST with unknown email returns 200 (generic message)", async () => {
    (getUserByEmailAccess as jest.Mock).mockResolvedValue(null);
    const res = await POST(buildPost({ email: "x@e.com" }));
    expect(res.status).toBe(200);
    expect(createUserResetAccess).not.toHaveBeenCalled();
  });

  test("POST creates reset record when none exists and sends email", async () => {
    (getUserByEmailAccess as jest.Mock).mockResolvedValue({ user_id: 1 });
    (getUserResetAccess as jest.Mock).mockResolvedValue(null);
    (createUserResetAccess as jest.Mock).mockResolvedValue({
      uuid: "uuid-1",
      expired_at: new Date("2100-01-01"),
    });
    (sesClient.send as jest.Mock).mockResolvedValue(undefined);
    const res = await POST(buildPost({ email: "x@e.com" }));
    expect(res.status).toBe(200);
    expect(createUserResetAccess).toHaveBeenCalled();
    expect(sesClient.send).toHaveBeenCalled();
  });

  test("POST reuses an unexpired record", async () => {
    (getUserByEmailAccess as jest.Mock).mockResolvedValue({ user_id: 1 });
    (getUserResetAccess as jest.Mock).mockResolvedValue({
      id: 3,
      uuid: "existing",
      expired_at: new Date("2100-01-01"),
    });
    (sesClient.send as jest.Mock).mockResolvedValue(undefined);
    const res = await POST(buildPost({ email: "x@e.com" }));
    expect(res.status).toBe(200);
    expect(createUserResetAccess).not.toHaveBeenCalled();
  });

  test("POST replaces an expired record with a new one", async () => {
    (getUserByEmailAccess as jest.Mock).mockResolvedValue({ user_id: 1 });
    (getUserResetAccess as jest.Mock).mockResolvedValue({
      id: 3,
      expired_at: new Date("2000-01-01"),
    });
    (deleteUserResetAccess as jest.Mock).mockResolvedValue(undefined);
    (createUserResetAccess as jest.Mock).mockResolvedValue({
      uuid: "uuid-1",
      expired_at: new Date("2100-01-01"),
    });
    (sesClient.send as jest.Mock).mockResolvedValue(undefined);
    const res = await POST(buildPost({ email: "x@e.com" }));
    expect(res.status).toBe(200);
    expect(deleteUserResetAccess).toHaveBeenCalledWith(3);
    expect(createUserResetAccess).toHaveBeenCalled();
  });

  test("POST returns 201 when ses send fails", async () => {
    (getUserByEmailAccess as jest.Mock).mockResolvedValue({ user_id: 1 });
    (getUserResetAccess as jest.Mock).mockResolvedValue(null);
    (createUserResetAccess as jest.Mock).mockResolvedValue({
      uuid: "uuid-1",
      expired_at: new Date("2100-01-01"),
    });
    (sesClient.send as jest.Mock).mockRejectedValue(new Error("ses"));
    const res = await POST(buildPost({ email: "x@e.com" }));
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.message).toBe("send email failed, try again later");
  });
});
