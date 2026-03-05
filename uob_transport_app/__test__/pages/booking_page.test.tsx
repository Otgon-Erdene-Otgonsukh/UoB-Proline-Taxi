import React from "react";
import { render, screen } from "@testing-library/react";
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

describe("BookingPage", () => {
  it("renders the heading", () => {
    render(<BookingPage />);
    expect(screen.getByText("BOOKING DETAILS")).toBeInTheDocument();
  });

  it("renders the confirm button", () => {
    render(<BookingPage />);
    expect(screen.getByRole("button", { name: /confirm booking/i })).toBeInTheDocument();
  });

  it("renders the map", () => {
    render(<BookingPage />);
    expect(screen.getByTestId("map")).toBeInTheDocument();
  });

  it("shows custom location input when Manually Enter is toggled", async () => {
    render(<BookingPage />);
    await userEvent.click(screen.getByLabelText(/manually enter/i));
    expect(screen.getByLabelText(/custom pick-up location/i)).toBeInTheDocument();
  });
});