import { prismaMock } from "@/utils/singleton";
import {
  getUserBookingsAccess,
  getBookingDetails,
  cancelBookingsAccess,
  getUserBookingsCountAccess,
} from "@/backend/access/booking_access";

describe("booking_access", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getUserBookingsAccess calls prisma.booking.findMany correctly", async () => {
    const mockResult = [{ booking_id: 1 }];
    (prismaMock.booking.findMany as jest.Mock).mockResolvedValue(mockResult);

    const result = await getUserBookingsAccess(10, 1, 5, {
      bookingStatus: "Confirmed",
      isExport: false,
    });

    expect(prismaMock.booking.findMany).toHaveBeenCalledWith({
      where: {
        booking_status: "Confirmed",
        user_id: 10,
      },
      include: { trip: true, department: true },
      orderBy: { time_created: "desc" },
      skip: 5,
      take: 5,
    });

    expect(result).toBe(mockResult);
  });

  test("getBookingDetails uses findUnique when userId = -1", async () => {
    const mockBooking = { booking_id: 99 };
    (prismaMock.booking.findUnique as jest.Mock).mockResolvedValue(mockBooking);

    const result = await getBookingDetails(-1, 99);

    expect(prismaMock.booking.findUnique).toHaveBeenCalledWith({
      where: { booking_id: 99 },
    });

    expect(result).toBe(mockBooking);
  });

  test("getBookingDetails uses findFirst when userId != -1", async () => {
    const mockBooking = { booking_id: 50 };
    (prismaMock.booking.findFirst as jest.Mock).mockResolvedValue(mockBooking);

    const result = await getBookingDetails(7, 50);

    expect(prismaMock.booking.findFirst).toHaveBeenCalledWith({
      where: {
        booking_id: 50,
        user_id: 7,
      },
    });

    expect(result).toBe(mockBooking);
  });

  test("cancelBookingsAccess updates booking status", async () => {
    const mockUpdated = { booking_status: "Cancelled" };
    (prismaMock.booking.update as jest.Mock).mockResolvedValue(mockUpdated);

    const result = await cancelBookingsAccess(123);

    expect(prismaMock.booking.update).toHaveBeenCalledWith({
      where: { booking_id: 123 },
      data: { booking_status: "Cancelled" },
    });

    expect(result).toBe(mockUpdated);
  });

  test("getUserBookingsCountAccess calls prisma.booking.count", async () => {
    (prismaMock.booking.count as jest.Mock).mockResolvedValue(42);

    const result = await getUserBookingsCountAccess(3, {
      bookingStatus: "Pending",
      isExport: false,
    });

    expect(prismaMock.booking.count).toHaveBeenCalledWith({
      where: {
        booking_status: "Pending",
        user_id: 3,
      },
    });

    expect(result).toBe(42);
  });
});
