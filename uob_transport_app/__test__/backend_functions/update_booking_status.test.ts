import { prismaMock } from "@/utils/singleton";
import updateBookingStatus from "@/backend/update_booking_status/update_status";

describe("Update booking status backend test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Approved bookings need a PO number attached", async () => {
    const argument = {
      bookingId: 3,
      newStatus: "Approved",
      poNumber: "23521",
    };
    prismaMock.booking.update.mockResolvedValue(undefined);
    await updateBookingStatus(
      argument.bookingId,
      argument.newStatus,
      argument.poNumber,
    );
    expect(prismaMock.booking.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.booking.update).toHaveBeenCalledWith({
      where: {
        booking_id: 3,
      },
      data: {
        booking_status: "Approved",
        trip: {
          update: {
            PO: "23521",
          },
        },
      },
    });
  });

  test("Rejected bookings does not need PO number attached", async () => {
    const argument = {
      bookingId: 3,
      newStatus: "Rejected",
      poNumber: "23521",
    };
    prismaMock.booking.update.mockResolvedValue(undefined);
    await updateBookingStatus(
      argument.bookingId,
      argument.newStatus,
      argument.poNumber,
    );
    expect(prismaMock.booking.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.booking.update).toHaveBeenCalledWith({
      where: {
        booking_id: 3,
      },
      data: {
        booking_status: "Rejected",
      },
    });
  });
});
