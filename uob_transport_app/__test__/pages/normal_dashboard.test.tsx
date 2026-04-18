import { render, screen, waitFor, fireEvent } from "@testing-library/react";
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

// mock fetch
global.fetch = jest.fn().mockResolvedValue({
  json: async () => ({
    routes: [
      {
        geometry: {
          coordinates: [
            [1, 1],
            [2, 2],
          ],
        },
      },
    ],
  }),
}) as unknown as typeof fetch;

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

  // ===== 3. recent bookings list =====
  test("renders recent bookings list correctly", async () => {
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
      expect(screen.getByText("Recent bookings")).toBeInTheDocument();
    });

    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("End")).toBeInTheDocument();

    // 日期来自页面逻辑：toDateString()
    expect(screen.getByText("Wed Jan 01 2025")).toBeInTheDocument();
  });

  // ===== 4. empty state =====
  test("renders empty state when no bookings", async () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: mockSession,
    });

    (easyGetRequest as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({
        ...baseResponse,
        recentBookings: [],
      }),
    });

    render(<NormalUserDashboard />);

    await waitFor(() => {
      expect(screen.getByText("No bookings to display")).toBeInTheDocument();
    });

    expect(
      screen.getByText("Create your first booking to see trip history here."),
    ).toBeInTheDocument();
  });

  // ===== 5. create booking button =====
  test("clicking create booking triggers redirect", async () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: mockSession,
    });

    (easyGetRequest as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({
        ...baseResponse,
        recentBookings: [],
      }),
    });

    render(<NormalUserDashboard />);

    const button = await screen.findByText("+ Create Your First Booking");
    fireEvent.click(button);

    expect(redirectMock).toHaveBeenCalledWith("/book");
  });

  // ===== 6. recent booking row interactions =====
  test("clicking the ✚ tile redirects to /book", async () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: mockSession,
    });

    (easyGetRequest as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => baseResponse,
    });

    render(<NormalUserDashboard />);

    const addButton = await screen.findByRole("button", { name: "✚" });
    fireEvent.click(addButton);

    expect(redirectMock).toHaveBeenCalledWith("/book");
  });

  test("clicking a recent booking row marks it as the active selection", async () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: mockSession,
    });

    (easyGetRequest as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => baseResponse,
    });

    render(<NormalUserDashboard />);

    const startLabel = await screen.findByText("Start");
    const row = startLabel.closest("div.cursor-pointer") as HTMLElement;
    expect(row).toBeTruthy();

    expect(row.className).toContain("bg-slate-50");
    fireEvent.click(row);
    expect(row.className).toContain("bg-slate-800");
  });

  // ===== 7. via path rendering =====
  test("renders via location when exists", async () => {
    const responseWithVia = {
      ...baseResponse,
      recentBookings: [
        {
          ...booking,
          trip: {
            ...booking.trip,
            via: JSON.stringify([{ lat: 1.5, lng: 1.5, short_name: "Mid" }]),
          },
        },
      ],
    };

    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: mockSession,
    });

    (easyGetRequest as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => responseWithVia,
    });

    render(<NormalUserDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Mid")).toBeInTheDocument();
    });
  });
});
