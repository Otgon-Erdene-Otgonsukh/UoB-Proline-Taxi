/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { USER_ROLE } from "@/model/models";

const mock_normal_user = {
  user_id: 1,
  name: "John Doe",
  role: USER_ROLE.NORMAL_USER
}

jest.mock("../../auth", () => ({
  auth: jest.fn().mockResolvedValue({
    user: mock_normal_user
  })
}));

describe("Permission checks for API routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    test("Unauthenticated requests to protected API routes", async () => {
        // Try to approve a booking without authentication.
        const req = new NextRequest(
            "http://localhost:3000/api/approve_booking",
            { method: "POST", body: JSON.stringify({ bookingId: 1, newStatus: "approved", po: "PO0001" }) }
        );

        (auth as jest.Mock).mockResolvedValue(null);

        const res = await fetch(req);
        expect(res.status).toBeCloseTo(450, 50); // Any 4xx status code that indicates client error is fine.
    });
});