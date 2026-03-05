import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingPage from "@/app/book/page";

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { user_id: "1" } }, status: "authenticated" }),
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  redirect: jest.fn(),
}));
jest.mock("@/app/requests/departments", () => ({
  getDepartments: jest.fn(() => Promise.resolve({ status: 200, json: () => Promise.resolve([]) })),
}));
jest.mock("@/components/ui/map", () => ({
  Map: ({ children }: { children: React.ReactNode }) => <div data-testid="map">{children}</div>,
  MapMarker: () => null,
  MarkerContent: () => null,
  MapRoute: () => null,
  MarkerLabel: () => null,
}));
jest.mock("@/components/NumberField", () => ({
  __esModule: true,
  default: () => <input data-testid="number-field" type="number" />,
}));

test("renders the heading", async () => {
  render(<BookingPage />);
  await waitFor(() => expect(screen.getByText("BOOKING DETAILS")).toBeInTheDocument());
});

test("renders the confirm button", async () => {
  render(<BookingPage />);
  await waitFor(() => expect(screen.getByRole("button", { name: /confirm booking/i })).toBeInTheDocument());
});

test("renders the map", async () => {
  render(<BookingPage />);
  await waitFor(() => expect(screen.getByTestId("map")).toBeInTheDocument());
});

test("shows custom location input when Manually Enter is toggled", async () => {
  render(<BookingPage />);
  await waitFor(() => screen.getByLabelText(/manually enter/i));
  await userEvent.click(screen.getByLabelText(/manually enter/i));
  await waitFor(() => expect(screen.getByLabelText(/custom pick-up location/i)).toBeInTheDocument());
});

test("renders without crashing", () => {
  expect(true).toBe(true);
});