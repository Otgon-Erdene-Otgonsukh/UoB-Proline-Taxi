import { getNormalDashboardData } from "@/backend/normal_dashboard_data/normal_dash_data";
import prisma from "@/utils/client";

// ===== mock prisma =====
jest.mock("@/utils/client", () => ({
  booking: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
  trip: {
    aggregate: jest.fn(),
    count: jest.fn(),
  },
}));

describe("getNormalDashboardData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns correct dashboard data", async () => {
    const userId = 1;

    const mockBookings = [
      {
        booking_status: "Pending",
        trip: {
          pickup_location: "A",
          via: null,
          dropoff_location: "B",
          pickup_time: new Date(),
        },
      },
    ];

    (prisma.booking.findMany as jest.Mock).mockResolvedValue(mockBookings);
    (prisma.booking.count as jest.Mock).mockResolvedValue(5);

    (prisma.trip.aggregate as jest.Mock).mockResolvedValue({
      _sum: { price: 300 },
    });

    (prisma.trip.count as jest.Mock).mockResolvedValue(2);

    const result = await getNormalDashboardData(userId);

    expect(result).toEqual({
      recentBookings: mockBookings,
      totalBookings: 5,
      totalPrice: 300,
      upcomingBookings: 2,
    });
  });

  // ===== edge case: totalPrice = null =====
  test("handles null price correctly (defaults to 0)", async () => {
    const userId = 1;

    (prisma.booking.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.booking.count as jest.Mock).mockResolvedValue(0);

    (prisma.trip.aggregate as jest.Mock).mockResolvedValue({
      _sum: { price: null },
    });

    (prisma.trip.count as jest.Mock).mockResolvedValue(0);

    const result = await getNormalDashboardData(userId);

    expect(result.totalPrice).toBe(0);
  });

});
