import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingPage from "@/app/book/page";

// ─── Mocks ───

// next-auth session
jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { user_id: "test-user-123" } },
    status: "authenticated",
  }),
}));

// next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  redirect: jest.fn(),
}));

// Department API
jest.mock("@/app/requests/departments", () => ({
  getDepartments: jest.fn(() =>
    Promise.resolve({
      status: 200,
      json: () =>
        Promise.resolve([
          { dep_id: 1, dep_name: "Engineering" },
          { dep_id: 2, dep_name: "HR" },
        ]),
    })
  ),
}));

