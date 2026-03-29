import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import NormalUserDashboard from "@/components/NormalUserDashboard";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { easyGetRequest } from "@/utils/easyRequest";

// ================= mocks =================

// next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

// next/navigation
const redirectMock = jest.fn();
jest.mock("next/navigation", () => ({
  redirect: (url: string) => redirectMock(url),
}));

// request
jest.mock("@/utils/easyRequest", () => ({
  easyGetRequest: jest.fn(),
}));

// map
jest.mock("@/components/ui/map", () => ({
  Map: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map">{children}</div>
  ),
  MapMarker: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  MapRoute: () => <div>route</div>,
  MarkerContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  MarkerLabel: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// ================= mock data =================

const mockSession: Session = {
  user: {
    name: "User",
    user_id: 1,
    account_type: "normal",
  },
  expires: "2099-01-01",
};

const booking = {
  booking_status: "Pending",
  trip: {
    pickup_location: JSON.stringify({
      lat: 1,
      lng: 1,
      short_name: "Start",
    }),
    dropoff_location: JSON.stringify({
      lat: 2,
      lng: 2,
      short_name: "End",
    }),
    via: null,
    pickup_time: new Date("2025-01-01").toISOString(),
  },
};

const baseResponse = {
  totalBookings: 3,
  totalPrice: 200,
  upcomingBookings: 1,
  recentBookings: [booking],
};

// ================= tests =================

describe("NormalUserDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== 1. loading state =====
  test("shows loading indicators before data is loaded", async () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: mockSession,
    });

    (easyGetRequest as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => baseResponse,
    });

    render(<NormalUserDashboard />);

    // 来自页面：CircularProgress（3个卡片）
    expect(screen.getAllByRole("progressbar").length).toBeGreaterThan(0);
  });

  // ===== 2. cards values =====
    test("renders card values after fetch", async () => {
      (useSession as jest.Mock).mockReturnValue({
        status: "authenticated",
        data: mockSession,
      });
  
      (easyGetRequest as jest.Mock).mockResolvedValue({
        status: 200,
        json: async () => baseResponse,
      });
  
      render(<NormalUserDashboard />);
  
      await waitFor(() => {
        expect(screen.getByText("Total Bookings")).toBeInTheDocument();
      });
  
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("£200")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });
});