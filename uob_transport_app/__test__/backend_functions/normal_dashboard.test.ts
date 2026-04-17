import { getNormalDashboardData } from "@/backend/normal_dashboard_data/normal_dash_data";
import { prismaMock } from "@/utils/singleton";

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

    (prismaMock.booking.findMany as jest.Mock).mockResolvedValue(mockBookings);
    (prismaMock.booking.count as jest.Mock).mockResolvedValue(5);

    (prismaMock.trip.aggregate as jest.Mock).mockResolvedValue({
      _sum: { price: 300 },
    });

    (prismaMock.trip.count as jest.Mock).mockResolvedValue(2);

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

    (prismaMock.booking.findMany as jest.Mock).mockResolvedValue([]);
    (prismaMock.booking.count as jest.Mock).mockResolvedValue(0);

    (prismaMock.trip.aggregate as jest.Mock).mockResolvedValue({
      _sum: { price: null },
    });

    (prismaMock.trip.count as jest.Mock).mockResolvedValue(0);

    const result = await getNormalDashboardData(userId);

    expect(result.totalPrice).toBe(0);
  });

  // ===== verify prisma queries =====
  test("calls prisma with correct query conditions", async () => {
    const userId = 42;

    (prismaMock.booking.findMany as jest.Mock).mockResolvedValue([]);
    (prismaMock.booking.count as jest.Mock).mockResolvedValue(0);
    (prismaMock.trip.aggregate as jest.Mock).mockResolvedValue({
      _sum: { price: 0 },
    });
    (prismaMock.trip.count as jest.Mock).mockResolvedValue(0);

    await getNormalDashboardData(userId);

    expect(prismaMock.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          user_id: userId,
        }),
        take: 5,
      })
    );

    expect(prismaMock.booking.count).toHaveBeenCalledWith({
      where: { user_id: userId },
    });

    expect(prismaMock.trip.aggregate).toHaveBeenCalled();

    expect(prismaMock.trip.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          booking: {
            is: {
              user_id: userId,
            },
          },
        }),
      })
    );
  });
});
