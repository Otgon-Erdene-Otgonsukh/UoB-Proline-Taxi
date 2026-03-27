/**
 * @jest-environment node
 */

import { POST } from "@/app/api/approve_booking/route";
import updateStatus from "@/backend/update_booking_status/update_status";
import { getBookingDetails } from "@/backend/access/booking_access";
import { isAdmin } from "@/backend/access/user_access";
import { auth } from "@/auth";

jest.mock("../../backend/update_booking_status/update_status.ts");
jest.mock("../../backend/access/booking_access.ts");
jest.mock("../../backend/access/user_access.ts");
jest.mock("../../auth", () => ({
  auth: jest.fn(),
}));

describe("Update booking API endpoint branch tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Unauthenticated user request is rejected", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const body = { bookingId: 11, newStatus: "Approved", po: "PO-111" };
    const req = new Request("http://localhost:3000/api/approve_booking", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await POST(req);

    expect(res.status).toBe(401);
    expect(updateStatus).not.toHaveBeenCalled();
  });

  test("Admin user can update any booking", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { user_id: 1 },
    });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (getBookingDetails as jest.Mock).mockResolvedValue({
      booking_id: 11,
      status: "Pending",
    });
    (updateStatus as jest.Mock).mockResolvedValue(undefined);

    const body = { bookingId: 11, newStatus: "Approved", po: "PO-111" };
    const req = new Request("http://localhost:3000/api/update_booking", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(getBookingDetails).toHaveBeenCalledWith(-1, 11);
    expect(updateStatus).toHaveBeenCalledWith(11, "Approved", "PO-111");
  });

  test("Returns 404 when booking not found", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { user_id: 5 },
    });
    (isAdmin as jest.Mock).mockResolvedValue(false);
    (getBookingDetails as jest.Mock).mockResolvedValue(null);

    const body = { bookingId: 999, newStatus: "Approved", po: "PO-333" };
    const req = new Request("http://localhost:3000/api/approve_booking", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.success).toBe(false);
    expect(updateStatus).not.toHaveBeenCalled();
  });

  test("Handles errors correctly", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { user_id: 1 },
    });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (getBookingDetails as jest.Mock).mockResolvedValue({
      booking_id: 11,
      status: "Pending",
    });
    (updateStatus as jest.Mock).mockRejectedValue(new Error("Database error"));

    const body = { bookingId: 11, newStatus: "Approved", po: "PO-444" };
    const req = new Request("http://localhost:3000/api/approve_booking", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
  });
});
