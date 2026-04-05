import {
  getPendingBookings,
  getPendingBookingsCount,
} from "@/backend/pending_bookings/get_pending_bookings";
import { prismaMock } from "@/utils/singleton";
import { auth } from "@/auth";

jest.mock("../../auth", () => ({
  auth: jest.fn().mockResolvedValue({
    user: {
      user_id: 1,
    },
  }),
}));

jest.mock("../../backend/access/departments_access", () => ({
  getDepartmentIdfromUserId: jest.fn().mockResolvedValue({
    dep_id: 1
  })
}))

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
      price: false,
      withoutPrice: false,
    };
    await getPendingBookings(4, 10, mockSearchParams);
    await getPendingBookingsCount(mockSearchParams);
    expect(prismaMock.booking.findMany).toHaveBeenCalledWith({
      where: {
        booking_status: "Pending",
        dep_id: 1
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
        dep_id: 1
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
      price: false,
      withoutPrice: false,
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
        dep_id: 1
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
        dep_id: 1
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
      price: false,
      withoutPrice: false,
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
        dep_id: 1
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
        dep_id: 1
      },
    });
    expect(prismaMock.booking.count).toHaveBeenCalledTimes(1);
  });

  test("total branch sorts and paginates correctly", async () => {
    prismaMock.booking.findMany.mockResolvedValue([
      { booking_status: "Approved" },
      { booking_status: "Pending" },
      { booking_status: "Rejected" },
    ]);

    const params = {
      from: undefined,
      to: undefined,
      passengerName: undefined,
      pickUpTimeFrom: undefined,
      pickUpTimeTo: undefined,
      isFlight: false,
      total: true, // 🔥 核心
      status: false,
      overdue: false,
      price: false,
      withoutPrice: false,
    };

    const result = await getPendingBookings(0, 2, params);

    // 排序后：Pending → Approved → Rejected
    expect(result).toEqual([
      { booking_status: "Pending" },
      { booking_status: "Approved" },
    ]);
  });

  test("status branch triggers same logic as total", async () => {
    prismaMock.booking.findMany.mockResolvedValue([
      { booking_status: "Rejected" },
      { booking_status: "Pending" },
    ]);

    const params = {
      from: undefined,
      to: undefined,
      passengerName: undefined,
      pickUpTimeFrom: undefined,
      pickUpTimeTo: undefined,
      isFlight: false,
      total: false,
      status: true, // 🔥
      overdue: false,
      price: false,
      withoutPrice: false,
    };

    const result = await getPendingBookings(0, 10, params);

    expect(result[0].booking_status).toBe("Pending");
  });

  test("price filter builds query correctly", async () => {
    await getPendingBookings(0, 10, {
      from: undefined,
      to: undefined,
      passengerName: undefined,
      pickUpTimeFrom: undefined,
      pickUpTimeTo: undefined,
      isFlight: false,
      total: false,
      status: false,
      overdue: false,
      price: true,
      withoutPrice: false,
    });

    expect(prismaMock.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          trip: expect.objectContaining({
            price: { not: null },
          }),
        }),
      })
    );
  });

});
