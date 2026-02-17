import {
  getPendingBookings,
  getPendingBookingsCount,
} from "@/backend/pending_bookings/get_pending_bookings";
import { prismaMock } from "@/utils/singleton";

describe("The tests for the 2 functions for fetching bookings/count for dep-dashboard page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Both functions passes the correct query to prisma when no filter is applied", async () => {
    const mockSearchParams = {
      from: undefined,
      to: undefined,
      passengerName: undefined,
      pickUpTimeFrom: undefined,
      pickUpTimeTo: undefined,
      isFlight: false,
      total: false,
      status: false,
      overdue: false,
    };
    await getPendingBookings(4, 10, mockSearchParams);
    await getPendingBookingsCount(mockSearchParams);
    expect(prismaMock.booking.findMany).toHaveBeenCalledWith({
      where: {
        booking_status: "Pending",
      },
      orderBy: {
        time_created: "desc",
      },
      include: {
        trip: true,
        department: true,
        User: {
          omit: {
            password: true,
          },
        },
      },
      skip: 40,
      take: 10,
    });
    expect(prismaMock.booking.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.booking.count).toHaveBeenCalledWith({
      where: {
        booking_status: "Pending",
      },
    });
  });

  test("When search params are defined, the prisma query is built correctly", async () => {
    const mockSearchParams = {
      from: "fogs",
      to: "tri",
      passengerName: "Geo",
      pickUpTimeFrom: "",
      pickUpTimeTo: "",
      isFlight: true,
      total: true,
      status: false,
      overdue: false,
    };
    prismaMock.booking.findMany.mockResolvedValue([{}]); //returning an empty object array to make the sort call work
    await getPendingBookings(2, 5, mockSearchParams);
    await getPendingBookingsCount(mockSearchParams);
    expect(prismaMock.booking.findMany).toHaveBeenCalledWith({
      where: {
        trip: {
          pickup_location: {
            contains: "fogs",
            mode: "insensitive",
          },
          dropoff_location: {
            contains: "tri",
            mode: "insensitive",
          },
          flight_num: {
            not: null,
            notIn: [""],
          },
        },
        passenger_name: {
          contains: "Geo",
          mode: "insensitive",
        },
        booking_status: {
          not: "Cancelled",
        },
      },
      include: {
        trip: true,
        department: true,
        User: {
          omit: {
            password: true,
          },
        },
      },
    });

    expect(prismaMock.booking.count).toHaveBeenCalledWith({
      where: {
        trip: {
          pickup_location: {
            contains: "fogs",
            mode: "insensitive",
          },
          dropoff_location: {
            contains: "tri",
            mode: "insensitive",
          },
          flight_num: {
            not: null,
            notIn: [""],
          },
        },
        passenger_name: {
          contains: "Geo",
          mode: "insensitive",
        },
        booking_status: {
          not: "Cancelled",
        },
      },
    });
  });

  test("Overdue filter with other filter params work as intended", async () => {
    const mockSearchParams = {
      from: "fogs",
      to: "tri",
      passengerName: "Geo",
      pickUpTimeFrom: "",
      pickUpTimeTo: "",
      isFlight: true,
      total: false,
      status: false,
      overdue: true,
    };

    await getPendingBookings(1, 10, mockSearchParams);
    await getPendingBookingsCount(mockSearchParams);

    expect(prismaMock.booking.findMany).toHaveBeenCalledWith({
      where: {
        booking_status: "Pending",
        trip: {
          pickup_location: {
            contains: "fogs",
            mode: "insensitive",
          },
          dropoff_location: {
            contains: "tri",
            mode: "insensitive",
          },
          flight_num: {
            not: null,
            notIn: [""],
          },
          pickup_time: {
            lt: expect.any(Date), // the actual function calls new Date() which the test have a delay so we can expect any date value
          },
        },
        passenger_name: {
          contains: "Geo",
          mode: "insensitive",
        },
      },
      include: {
        trip: true,
        department: true,
        User: {
          omit: {
            password: true,
          },
        },
      },
      skip: 10,
      take: 10,
    });
    expect(prismaMock.booking.findMany).toHaveBeenCalledTimes(1);

    expect(prismaMock.booking.count).toHaveBeenCalledWith({
      where: {
        booking_status: "Pending",
        trip: {
          pickup_location: {
            contains: "fogs",
            mode: "insensitive",
          },
          dropoff_location: {
            contains: "tri",
            mode: "insensitive",
          },
          flight_num: {
            not: null,
            notIn: [""],
          },
          pickup_time: {
            lt: expect.any(Date), // the actual function calls new Date() which the test have a delay so we can expect any date value
          },
        },
        passenger_name: {
          contains: "Geo",
          mode: "insensitive",
        },
      },
    });
    expect(prismaMock.booking.count).toHaveBeenCalledTimes(1);
  });
});
