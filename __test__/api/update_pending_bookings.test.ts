/**
 * @jest-environment node
 */

import { POST } from "@/src/app/api/update_booking/route";
import updateStatus from "@/backend/update_booking_status/update_status";

// Mock the database function
jest.mock("../../backend/update_booking_status/update_status.ts");

test("approve and reject work", async () => {
  // Setup mock to resolve successfully
  (updateStatus as jest.Mock).mockResolvedValue(undefined);

  const body = { bookingId: 11, newStatus: "Rejected" };
  const req = new Request("http://localhost:3000/api/update_booking", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const res = await POST(req);

  expect(res.status).toBe(200);

  // Verify the function was called with correct arguments
  expect(updateStatus).toHaveBeenCalledWith(11, "Rejected");
  expect(updateStatus).toHaveBeenCalledTimes(1);
});

test("handles errors correctly", async () => {
  // Setup mock to reject
  (updateStatus as jest.Mock).mockRejectedValue(new Error("Database error"));

  const body = { bookingId: -1, newStatus: "Approved" };
  const req = new Request("http://localhost:3000/api/update_booking", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const res = await POST(req);

  expect(res.status).toBe(500);
  const data = await res.json();
  expect(data.success).toBe(false);
});
