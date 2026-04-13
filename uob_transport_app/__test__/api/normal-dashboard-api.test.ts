/**
 * @jest-environment node
 */

import { GET } from "@/app/api/normal-user-dashboard/route";
import { auth } from "@/auth";
import { getNormalDashboardData } from "@/backend/normal_dashboard_data/normal_dash_data";

const mockBookingData = {
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

jest.mock("../../auth", () => {
  return {
    auth: jest.fn(),
  };
})
jest.mock("@/backend/normal_dashboard_data/normal_dash_data");

jest.mock("@/backend/normal_dashboard_data/normal_dash_data", () => ({
  getNormalDashboardData: jest.fn(),
}));

describe("Admin API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("unauthenticated GET request", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const res = await GET();
    expect(res.status).toBe(401);
  });

  test("normal user dashboard get api works", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { user_id: 3 },
    });

    const mockData = {
      totalBookings: 3,
      totalPrice: 200,
      upcomingBookings: 1,
      recentBookings: [mockBookingData],
    };

    (getNormalDashboardData as jest.Mock).mockResolvedValue(mockData);

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual(mockData);
  });
});
