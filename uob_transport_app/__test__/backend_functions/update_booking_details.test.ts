import { prismaMock } from "@/utils/singleton";
import updateBooking from "@/backend/update_booking_details/update_booking_details";

const pickupLocation = {
  short_name: "Queens Building",
  address: "Queens Building, Bristol",
  lat: 51.45689,
  lng: -2.601892,
};

const dropoffLocation = {
  short_name: "Heathrow Airport",
  address: "Heathrow Airport, London",
  lat: 51.467739,
  lng: -0.4587801,
};

const airport = {
  short_name: "Heathrow Airport",
  address: "Heathrow Airport, London",
  lat: 51.467739,
  lng: -0.4587801,
};

const existingBooking = {
  booking_id: 99,
  trip_id: 11,
  user_id: 5,
  time_created: new Date("2026-01-01"),
  booking_status: "Approved",
  passenger_name: "Existing Name",
  email: "existing@example.com",
  tel_number: "+44 123",
  additional_info: "Existing info",
  dep_id: 8,
};

describe("updateBooking", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("updates trip and booking with new values when provided", async () => {
    prismaMock.booking.findUnique.mockResolvedValue(existingBooking);

    await updateBooking(
      99,
      pickupLocation,
      dropoffLocation,
      new Date("2026-05-10T08:00:00Z"),
      new Date("2026-05-12T18:00:00Z"),
      "Bob Wilson",
      "bob@example.com",
      "+44 7700 900000",
      "Notes",
      [pickupLocation],
      dropoffLocation,
      3,
      airport,
      "BA101",
      4,
    );

    expect(prismaMock.trip.update).toHaveBeenCalledWith({
      where: { trip_id: 11 },
      data: {
        pickup_location: JSON.stringify(pickupLocation),
        dropoff_location: JSON.stringify(dropoffLocation),
        pickup_time: new Date("2026-05-10T08:00:00Z"),
        return_pickup_time: new Date("2026-05-12T18:00:00Z"),
        via: JSON.stringify([pickupLocation]),
        passenger_num: 3,
        return_drop_loc: JSON.stringify(dropoffLocation),
        airport: JSON.stringify(airport),
        flight_num: "BA101",
      },
    });

    expect(prismaMock.booking.update).toHaveBeenCalledWith({
      where: { booking_id: 99 },
      data: {
        booking_status: "Pending",
        passenger_name: "Bob Wilson",
        email: "bob@example.com",
        tel_number: "+44 7700 900000",
        additional_info: "Notes",
        dep_id: 4,
      },
    });
  });

  test("falls back to existing booking values when new values are empty", async () => {
    prismaMock.booking.findUnique.mockResolvedValue(existingBooking);

    await updateBooking(
      99,
      pickupLocation,
      dropoffLocation,
      new Date("2026-05-10T08:00:00Z"),
      undefined,
      "",
      "",
      "",
      "",
      [],
      undefined,
      1,
      airport,
      "",
      0,
    );

    expect(prismaMock.trip.update).toHaveBeenCalledWith({
      where: { trip_id: 11 },
      data: expect.objectContaining({
        return_pickup_time: null,
        return_drop_loc: JSON.stringify(undefined),
      }),
    });

    expect(prismaMock.booking.update).toHaveBeenCalledWith({
      where: { booking_id: 99 },
      data: {
        booking_status: "Pending",
        passenger_name: existingBooking.passenger_name,
        email: existingBooking.email,
        tel_number: existingBooking.tel_number,
        additional_info: existingBooking.additional_info,
        dep_id: existingBooking.dep_id,
      },
    });
  });

  test("throws an error when booking is not found", async () => {
    prismaMock.booking.findUnique.mockResolvedValue(null);

    await expect(
      updateBooking(
        404,
        pickupLocation,
        dropoffLocation,
        new Date("2026-05-10T08:00:00Z"),
        undefined,
        "Bob",
        "bob@example.com",
        "+44 123",
        "",
        [],
        undefined,
        1,
        airport,
        "BA101",
        2,
      ),
    ).rejects.toThrow("Booking not found");

    expect(prismaMock.trip.update).not.toHaveBeenCalled();
    expect(prismaMock.booking.update).not.toHaveBeenCalled();
  });
});
