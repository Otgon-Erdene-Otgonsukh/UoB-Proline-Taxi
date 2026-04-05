import { prismaMock } from "@/utils/singleton";
import updateBookingStatus from "@/backend/update_booking_status/update_status";
import { sesClient } from "@/utils/ses_client";


jest.mock("@/utils/ses_client", () => ({
  sesClient: {
    send: jest.fn(),
  },
}));

jest.mock("@react-email/components", () => ({
  render: jest.fn().mockResolvedValue("<html></html>"),
}));

jest.mock("@aws-sdk/client-sesv2", () => ({
  SendEmailCommand: jest.fn().mockImplementation((input) => input),
}));

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

  test("Approved branch sends emails correctly", async () => {
    prismaMock.booking.update.mockResolvedValue({});
    prismaMock.booking.findUnique.mockResolvedValue({
      booking_id: 1,
      user_id: 2,
      email: "booking@test.com",
      passenger_name: "A",
      tel_number: "123",
      department: { dep_name: "CS" },
      trip: {
        pickup_location: JSON.stringify({ 
          short_name: "A",
          address: "B Street",
        }),
        dropoff_location: JSON.stringify({
          short_name: "B",
          address: "A Street",
        }),
        via: null,
        airport: null,
        return_drop_loc: null,
        flight_num: null,
        pickup_time: new Date(),
        return_pickup_time: null,
        price: 10,
      },
    });

    prismaMock.user.findUnique.mockResolvedValue({
      email: "user@test.com",
    });

    prismaMock.user.findFirst.mockResolvedValue({
      email: "admin@test.com",
    });

    await updateBookingStatus(1, "Approved", "PO123");

    expect(sesClient.send).toHaveBeenCalledTimes(2);
  });

  test("returns error when booking not found", async () => {
    prismaMock.booking.update.mockResolvedValue({});
    prismaMock.booking.findUnique.mockResolvedValue(null);

    const result = await updateBookingStatus(1, "Approved", "PO");

    expect(result).toBeInstanceOf(Error);
  });

  test("returns error when super admin not found", async () => {
    prismaMock.booking.update.mockResolvedValue({});
    prismaMock.booking.findUnique.mockResolvedValue({
      user_id: 1,
      email: "a",
      passenger_name: "x",
      tel_number: "1",
      department: { dep_name: "CS" },
      trip: {
        pickup_location: JSON.stringify({}),
        dropoff_location: JSON.stringify({}),
        via: null,
        airport: null,
        return_drop_loc: null,
        flight_num: null,
        pickup_time: new Date(),
        return_pickup_time: null,
        price: 1,
      },
    });

    prismaMock.user.findUnique.mockResolvedValue({ email: "user@test.com" });
    prismaMock.user.findFirst.mockResolvedValue(null);

    const result = await updateBookingStatus(1, "Approved", "PO");

    expect(result).toBeInstanceOf(Error);
  });

  test("returns error when user not found", async () => {
    prismaMock.booking.update.mockResolvedValue({});
    prismaMock.booking.findUnique.mockResolvedValue({
      user_id: 1,
      email: "a",
      passenger_name: "x",
      tel_number: "1",
      department: { dep_name: "CS" },
      trip: {
        pickup_location: JSON.stringify({}),
        dropoff_location: JSON.stringify({}),
        via: null,
        airport: null,
        return_drop_loc: null,
        flight_num: null,
        pickup_time: new Date(),
        return_pickup_time: null,
        price: 1,
      },
    });

    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.findFirst.mockResolvedValue({ email: "admin@test.com" });

    const result = await updateBookingStatus(1, "Approved", "PO");

    expect(result).toBeInstanceOf(Error);
  });

  test("email recipient logic when booking.email === user.email", async () => {
    prismaMock.booking.update.mockResolvedValue({});
    prismaMock.booking.findUnique.mockResolvedValue({
      user_id: 1,
      email: "same@test.com",
      passenger_name: "x",
      tel_number: "1",
      department: { dep_name: "CS" },
      trip: {
        pickup_location: JSON.stringify({ 
          short_name: "A",
          address: "B Street",
        }),
        dropoff_location: JSON.stringify({
          short_name: "B",
          address: "A Street",
        }),
        via: null,
        airport: null,
        return_drop_loc: null,
        flight_num: null,
        pickup_time: new Date(),
        return_pickup_time: null,
        price: 1,
      },
    });

    prismaMock.user.findUnique.mockResolvedValue({
      email: "same@test.com",
    });

    prismaMock.user.findFirst.mockResolvedValue({
      email: "admin@test.com",
    });

    await updateBookingStatus(1, "Approved", "PO");

    const call = (sesClient.send as jest.Mock).mock.calls[1][0];

    expect(call.Destination.ToAddresses.length).toBe(1);
  });
});
