import prisma from '@/utils/client';

export async function getPendingBookings(page: number, pageSize: number, searchParams: { from?: string, to?: string, passengerName?: string, pickUpTimeFrom?: string, pickUpTimeTo?: string, isFlight: boolean, total: boolean, status: boolean, overdue: boolean, price: boolean, withoutPrice: boolean }) {
  const query: { [key: string]: string | object } = {};
  if (searchParams.from !== undefined) {
    query["trip"] = {
      ...query.trip as object,
      pickup_location: {
        contains: searchParams.from.trim(),
        mode: "insensitive"
      },
    };
  }
  if (searchParams.to !== undefined) {
    query["trip"] = {
      ...query.trip as object,
      dropoff_location: {
        contains: searchParams.to.trim(),
        mode: "insensitive"
      }
    }
  }
  if (searchParams.overdue) {
    query['trip'] = {
      ...query.trip as object,
      pickup_time: {
        lt: new Date()
      }
    }
  }
  if (searchParams.passengerName !== undefined) {
    query['passenger_name'] = {
        contains: searchParams.passengerName.trim(),
        mode: "insensitive"
    }
  }
  if (searchParams.isFlight) {
    query['trip'] = {
      ...query.trip as object,
      flight_num: {
        not: null,
        notIn: [""],
      }
    }
  }

  if (searchParams.price) {
    query['trip'] = {
      ...query.trip as object,
      price: {
        not: null
      }
    }
  }

  if (searchParams.withoutPrice) {
    query['trip'] = {
      ...query.trip as object,
      price: null,
    }
  }

  if (searchParams.total || searchParams.status) {
    const allBookings = await prisma.booking.findMany({
      where: {
        ...query,
        booking_status: {
          not: "Cancelled"
        }
      },
      include: {
        trip: true,
        department: true,
        User: {
          omit: {
            password: true,
          }
        },
      },
    });

    // Taking Pending first and the others after
    const statusOrder: Record<string, number> = { 'Pending': 1, 'Approved': 2, 'Rejected': 3 };
    allBookings.sort((a, b) => statusOrder[a.booking_status!] - statusOrder[b.booking_status!]);

    // Return paginated results
    return allBookings.slice(page * pageSize, page * pageSize + pageSize);
  } else if (searchParams.overdue) {
    return prisma.booking.findMany({
      where: {
        ...query,
        booking_status: "Pending",
      },
      include: {
        trip: true,
        department: true,
        User: {
          omit: {
            password: true,
          }
        },
      },
      skip: page * pageSize,
      take: pageSize
    })
  } else
    return prisma.booking.findMany({
      where: {
        booking_status: "Pending",
        ...(searchParams.passengerName && {
          passenger_name: {
            contains: searchParams.passengerName.trim(),
            mode: "insensitive",
          },
        }),
        ...query,
      },
      orderBy: {
        time_created: "desc", // latest one shows up at the top
      },
      include: {
        // fetching the connected trip and User and department tables to fill out the dep-dashboard table and view
        trip: true,
        department: true,
        User: {
          omit: {
            password: true,
          },
        },
      },
      skip: page * pageSize,
      take: pageSize,
    });
}

export async function getPendingBookingsCount(searchParams: { from?: string, to?: string, passengerName?: string, pickUpTimeFrom?: string, pickUpTimeTo?: string, isFlight: boolean, total: boolean, status: boolean, overdue: boolean, price: boolean, withoutPrice: boolean }) {
  const query: { [key: string]: string | object } = {};
  if (searchParams.from !== undefined) {
    query["trip"] = {
      pickup_location: {
        contains: searchParams.from.trim(),
        mode: "insensitive"
      },
    };
  }

  if (searchParams.price) {
    query['trip'] = {
      ...query.trip as object,
      price: {
        not: null
      }
    }
  }

  if (searchParams.withoutPrice) {
    query['trip'] = {
      ...query.trip as object,
      price: null,
    }
  }
  
  if (searchParams.to !== undefined) {
    query["trip"] = {
      ...query.trip as object,
      dropoff_location: {
        contains: searchParams.to.trim(),
        mode: "insensitive"
      },
    };
  }
  if (searchParams.overdue) {
    query['trip'] = {
      ...query.trip as object,
      pickup_time: {
        lt: new Date()
      }
    }
  }
  if (searchParams.passengerName !== undefined) {
    query['passenger_name'] = {
        contains: searchParams.passengerName.trim(),
        mode: "insensitive",
    }
  }
  if (searchParams.isFlight) {
    query['trip'] = {
      ...query.trip as object,
      flight_num: {
        not: null,
        notIn: [""],
      }
    }
  }

  if (searchParams.total || searchParams.status) {
    return prisma.booking.count({
      where: {
        ...query,
        booking_status: {
          not: "Cancelled"
        }
      },
    });
  } else if (searchParams.overdue) {
    return prisma.booking.count({
      where: {
        ...query,
        booking_status: "Pending",
      },
    })
  } else
    return prisma.booking.count({
      where: {
        booking_status: "Pending",
        ...(searchParams.passengerName && {
          passenger_name: {
            contains: searchParams.passengerName.trim(),
            mode: "insensitive",
          },
        }),
        ...query,
      },
    });
}
