/**
 * @jest-environment node
 */

import { GET } from "@/app/api/super-data/route";
import { prismaMock } from "@/utils/singleton";

describe("Super data api endpoint tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Returns aggregated super dashboard data", async () => {
    (prismaMock.$queryRaw as unknown as jest.Mock)
      .mockResolvedValueOnce([
        { month: new Date("2025-01-01"), count: 3 },
        { month: new Date("2025-02-01"), count: 5 },
      ])
      .mockResolvedValueOnce([
        { depName: "Arts", bookingCount: 5, totalPrice: 100 },
      ]);

    (prismaMock.user.count as jest.Mock)
      .mockResolvedValueOnce(20) // user count
      .mockResolvedValueOnce(2); // pending user count
    (prismaMock.booking.count as jest.Mock).mockResolvedValueOnce(15);
    (prismaMock.trip.count as jest.Mock).mockResolvedValueOnce(1);

    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.cardData).toEqual({
      totalUser: 20,
      totalBooking: 15,
      pendingUser: 2,
      priceRequired: 1,
    });
    expect(data.lineGraph).toEqual([
      { month: "2025-01", count: 3 },
      { month: "2025-02", count: 5 },
    ]);
    expect(data.barGraph).toEqual([
      { department: "Arts", bookingCount: 5, priceTotal: 100 },
    ]);
  });

  test("DB failure returns 500", async () => {
    (prismaMock.$queryRaw as unknown as jest.Mock).mockRejectedValue(
      new Error("db"),
    );
    const res = await GET();
    expect(res.status).toBe(500);
  });
});
