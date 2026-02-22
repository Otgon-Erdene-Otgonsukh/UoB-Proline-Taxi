/**
 * @jest-environment node
 */

import { auth } from "@/auth";
import { POST } from "@/app/api/update-user-info/route";
import update_user from "@/backend/update_user_info/update_user";

jest.mock("../../auth", () => ({
    auth: jest.fn()
}));

jest.mock("../../backend/update_user_info/update_user");

describe("Update user info api route correctly calls the backend function related to it", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    test("IDOR check correctly denies unauthorized request", async () => {
        (auth as jest.Mock).mockResolvedValue(null);

        const data = {
            user_id: 2,
            name: "Test",
            surname: "test",
            email: "sdasdasd",
            phone_number: "12341312",
            department: "Damn"
        }

        const body = JSON.stringify(data);
        const req = new Request("http://localhost:3000/api/update-user-info", {
            method: "POST",
            body: body
        })
        const res = await POST(req);
        // Status code is unauthorized and the update user function is not called
        expect(res.status).toBe(401);
        expect(update_user as jest.Mock).not.toHaveBeenCalled();
    })

    test("IDOR check correctly denies unmatched user id request", async () => {
        (auth as jest.Mock).mockResolvedValue({
            user: {
                user_id: 4
            }
        });

        const data = {
            user_id: 2,
            name: "Test",
            email: "sdasdasd",
            phone_number: "12341312",
            department: "Damn"
        }

        const body = JSON.stringify(data);
        const req = new Request("http://localhost:3000/api/update-user-info", {
            method: "POST",
            body: body
        })
        const res = await POST(req);
        // Status code is unauthorized and the update user function is not called
        expect(res.status).toBe(403);
        expect(update_user as jest.Mock).not.toHaveBeenCalled();
    })

    test("Correct request calls the update user function", async () => {
        (auth as jest.Mock).mockResolvedValue({
            user: {
                user_id: 2
            }
        });

        const data = {
            user_id: 2,
            name: "Test",
            email: "sdasdasd",
            phone_number: "12341312",
            department: "Damn"
        }

        const body = JSON.stringify(data);
        const req = new Request("http://localhost:3000/api/update-user-info", {
            method: "POST",
            body: body
        })
        const res = await POST(req);
        // Status code is unauthorized and the update user function is not called
        expect(res.status).toBe(200);
        expect(update_user as jest.Mock).toHaveBeenCalledTimes(1);
        expect(update_user as jest.Mock).toHaveBeenCalledWith(2, "Test", "sdasdasd", "12341312", "Damn")
    })
})