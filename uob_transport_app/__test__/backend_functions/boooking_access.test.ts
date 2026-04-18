import { prismaMock } from "@/utils/singleton";
import {
  getUserBookingsAccess,
  getBookingDetails,
  cancelBookingsAccess,
  getUserBookingsCountAccess,

  getTripDetails,
  getBookingTrip,
  getBookingIDsByDepartment,
} from '@/backend/access/booking_access'


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
  })

  // ===== additional coverage tests =====

test('getUserBookingsAccess handles "from" filter', async () => {
  (prismaMock.booking.findMany as jest.Mock).mockResolvedValue([]);

  await getUserBookingsAccess(1, 0, 10, {
    from: 'ABC',
  });

  expect(prismaMock.booking.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        trip: {
          pickup_location: {
            contains: 'abc',
            mode: 'insensitive',
          },
        },
      }),
    })
  );
});

test('getUserBookingsAccess handles "to" filter', async () => {
  (prismaMock.booking.findMany as jest.Mock).mockResolvedValue([]);

  await getUserBookingsAccess(1, 0, 10, {
    to: 'XYZ',
  });

  expect(prismaMock.booking.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        trip: {
          dropoff_location: {
            contains: 'xyz',
            mode: 'insensitive',
          },
        },
      }),
    })
  );
});

test('getUserBookingsAccess handles time range (from + to)', async () => {
  (prismaMock.booking.findMany as jest.Mock).mockResolvedValue([]);

  await getUserBookingsAccess(1, 0, 10, {
    pickUpTimeFrom: '2025-01-01',
    pickUpTimeTo: '2025-01-02',
  });

  expect(prismaMock.booking.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        trip: expect.objectContaining({
          pickup_time: expect.objectContaining({
            gte: new Date('2025-01-01'),
            lte: expect.any(Date),
          }),
        }),
      }),
    })
  );
});

test('getUserBookingsAccess handles only pickUpTimeFrom', async () => {
  (prismaMock.booking.findMany as jest.Mock).mockResolvedValue([]);

  await getUserBookingsAccess(1, 0, 10, {
    pickUpTimeFrom: '2025-01-01',
  });

  expect(prismaMock.booking.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        trip: {
          pickup_time: {
            gte: new Date('2025-01-01'),
          },
        },
      }),
    })
  );
});

test('getUserBookingsAccess handles only pickUpTimeTo', async () => {
  (prismaMock.booking.findMany as jest.Mock).mockResolvedValue([]);

  await getUserBookingsAccess(1, 0, 10, {
    pickUpTimeTo: '2025-01-02',
  });

  expect(prismaMock.booking.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        trip: expect.objectContaining({
          pickup_time: expect.objectContaining({
            lte: expect.any(Date),
          }),
        }),
      }),
    })
  );
});

test('getUserBookingsAccess includes User when userId = -1', async () => {
  (prismaMock.booking.findMany as jest.Mock).mockResolvedValue([]);

  await getUserBookingsAccess(-1, 0, 10, {});

  expect(prismaMock.booking.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      include: expect.objectContaining({
        User: { select: { full_name: true } },
      }),
    })
  );
});

test('getUserBookingsAccess handles pagination correctly', async () => {
  (prismaMock.booking.findMany as jest.Mock).mockResolvedValue([]);

  await getUserBookingsAccess(1, 2, 10, {});

  expect(prismaMock.booking.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      skip: 20,
      take: 10,
    })
  );
});

test('getUserBookingsCountAccess handles time filters', async () => {
  (prismaMock.booking.count as jest.Mock).mockResolvedValue(5);

  await getUserBookingsCountAccess(1, {
    pickUpTimeFrom: '2025-01-01',
  });

  expect(prismaMock.booking.count).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        trip: {
          pickup_time: {
            gte: new Date('2025-01-01'),
          },
        },
      }),
    })
  );
});

test('getUserBookingsCountAccess userId = -1 removes user filter', async () => {
  (prismaMock.booking.count as jest.Mock).mockResolvedValue(5);

  await getUserBookingsCountAccess(-1, {});

  expect(prismaMock.booking.count).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        user_id: undefined,
      }),
    })
  );
});

test('getUserBookingsAccess handles from + to together', async () => {
  (prismaMock.booking.findMany as jest.Mock).mockResolvedValue([]);

  await getUserBookingsAccess(1, 0, 10, {
    from: 'AAA',
    to: 'BBB',
  });

  expect(prismaMock.booking.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        trip: {
          pickup_location: {
            contains: 'aaa',
            mode: 'insensitive',
          },
          dropoff_location: {
            contains: 'bbb',
            mode: 'insensitive',
          },
        },
      }),
    })
  );
});

test('getUserBookingsAccess merges from + to + time filters correctly', async () => {
  (prismaMock.booking.findMany as jest.Mock).mockResolvedValue([]);

  await getUserBookingsAccess(1, 0, 10, {
    from: 'AAA',
    to: 'BBB',
    pickUpTimeFrom: '2025-01-01',
    pickUpTimeTo: '2025-01-02',
  });

  expect(prismaMock.booking.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        trip: expect.objectContaining({
          pickup_location: expect.any(Object),
          dropoff_location: expect.any(Object),
          pickup_time: expect.objectContaining({
            gte: new Date('2025-01-01'),
            lte: expect.any(Date),
          }),
        }),
      }),
    })
  );
});

test('getUserBookingsAccess handles bookingStatus with trip filters', async () => {
  (prismaMock.booking.findMany as jest.Mock).mockResolvedValue([]);

  await getUserBookingsAccess(1, 0, 10, {
    bookingStatus: 'Pending',
    from: 'ABC',
  });

  expect(prismaMock.booking.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        booking_status: 'Pending',
        trip: expect.objectContaining({
          pickup_location: expect.any(Object),
        }),
      }),
    })
  );
});

test('getUserBookingsAccess userId = -1 with filters removes user_id', async () => {
  (prismaMock.booking.findMany as jest.Mock).mockResolvedValue([]);

  await getUserBookingsAccess(-1, 0, 10, {
    bookingStatus: 'Confirmed',
  });

  expect(prismaMock.booking.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        booking_status: 'Confirmed',
        user_id: undefined,
      }),
    })
  );
});

test('getUserBookingsCountAccess handles from + to together', async () => {
  (prismaMock.booking.count as jest.Mock).mockResolvedValue(1);

  await getUserBookingsCountAccess(1, {
    from: 'AAA',
    to: 'BBB',
  });

  expect(prismaMock.booking.count).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        trip: {
          pickup_location: expect.any(Object),
          dropoff_location: expect.any(Object),
        },
      }),
    })
  );
});

test('getUserBookingsCountAccess handles bookingStatus + time', async () => {
  (prismaMock.booking.count as jest.Mock).mockResolvedValue(1);

  await getUserBookingsCountAccess(1, {
    bookingStatus: 'Pending',
    pickUpTimeFrom: '2025-01-01',
  });

  expect(prismaMock.booking.count).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        booking_status: 'Pending',
        trip: expect.objectContaining({
          pickup_time: {
            gte: new Date('2025-01-01'),
          },
        }),
      }),
    })
  );
});

test('getTripDetails calls prisma.trip.findUnique correctly', async () => {
  const mockTrip = { trip_id: 5 };

  (prismaMock.trip.findUnique as jest.Mock).mockResolvedValue(mockTrip);

  const result = await getTripDetails(5);

  expect(prismaMock.trip.findUnique).toHaveBeenCalledWith({
    where: { trip_id: 5 },
  });

  expect(result).toBe(mockTrip);
});

test('getBookingTrip returns booking with trip relation', async () => {
  const mockBooking = { booking_id: 7, trip: { trip_id: 70 } };

  (prismaMock.booking.findUnique as jest.Mock).mockResolvedValue(mockBooking);

  const result = await getBookingTrip(7);

  expect(prismaMock.booking.findUnique).toHaveBeenCalledWith({
    where: { booking_id: 7 },
    include: { trip: true },
  });

  expect(result).toBe(mockBooking);
});

test('getBookingIDsByDepartment returns array of booking ids', async () => {
  (prismaMock.booking.findMany as jest.Mock).mockResolvedValue([
    { booking_id: 11 },
    { booking_id: 22 },
    { booking_id: 33 },
  ]);

  const result = await getBookingIDsByDepartment(4);

  expect(prismaMock.booking.findMany).toHaveBeenCalledWith({
    select: { booking_id: true },
    where: { dep_id: 4 },
  });

  expect(result).toEqual([11, 22, 33]);
});

test('getBookingIDsByDepartment returns empty array when nothing found', async () => {
  (prismaMock.booking.findMany as jest.Mock).mockResolvedValue([]);

  const result = await getBookingIDsByDepartment(99);

  expect(result).toEqual([]);
});

})
