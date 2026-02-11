import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export async function getPendingBookings(page: number, pageSize: number, searchParams: { from?: string, to?: string, passengerName?: string, pickUpTimeFrom?: string, pickUpTimeTo?: string, isFlight: boolean, total: boolean, status: boolean, overdue: boolean }) {
  const query: { [key: string]: string | object } = {};
  if (searchParams.from !== undefined) {
    query["trip"] = {
      ...query.trip as object,
      pickup_location: {
        contains: searchParams.from,
        mode: "insensitive"
      },
    };
  }
  if (searchParams.to !== undefined) {
    query["trip"] = {
      ...query.trip as object,
      dropoff_location: {
        contains: searchParams.to,
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
    // Here we assume passengerName refers to the name of the user, ignore the last name for simplicity
    query['passenger_name'] = {
      name: {
        contains: searchParams.passengerName,
        mode: "insensitive"
      }
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
    const allBookings = await prisma.booking.findMany({
      where: {
        ...query,
        booking_status: {
          not: "Cancelled"
        }
      },
      include: {
        trip: true,
        User: {
          include: {
            department: true,
          },
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
        User: {
          include: {
            department: true,
          },
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
<<<<<<< HEAD
        ...(searchParams.passengerName && {
          passenger_name: {
            contains: searchParams.passengerName,
            mode: "insensitive",
          },
        }),
=======
>>>>>>> dev
        ...query,
      },
      orderBy: {
        time_created: "desc", // latest one shows up at the top
      },
      include: {
        // fetching the connected trip and User and department tables to fill out the dep-dashboard table and view
        trip: true,
        User: {
          include: {
            department: true,
          },
          omit: {
            password: true,
          },
        },
      },
      skip: page * pageSize,
      take: pageSize,
    });
}

export async function getPendingBookingsCount(searchParams: { from?: string, to?: string, passengerName?: string, pickUpTimeFrom?: string, pickUpTimeTo?: string, isFlight: boolean, total: boolean, status: boolean, overdue: boolean }) {
  const query: { [key: string]: string | object } = {};
  if (searchParams.from !== undefined) {
    query["trip"] = {
      pickup_location: {
        contains: searchParams.from,
        mode: "insensitive"
      },
    };
  }
  if (searchParams.to !== undefined) {
    query["trip"] = {
      ...query.trip as object,
      dropoff_location: {
        contains: searchParams.to,
        mode: "insensitive"
      },
    };
  }
  if (searchParams.passengerName !== undefined) {
<<<<<<< HEAD
    // Here we assume passengerName refers to the name of the user, ignore the last name for simplicity
    query['passenger_name'] = {
      name: {
        contains: searchParams.passengerName,
        mode: "insensitive",
=======
    // Here we assume passengerName refers to the first name of the user, ignore the last name for simplicity
    query['first_name'] = {
        contains: searchParams.passengerName,
        mode: "insensitive"
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
   if (searchParams.overdue) {
    query['trip'] = {
      ...query.trip as object,
      pickup_time: {
        lt: new Date()
>>>>>>> dev
      }
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
<<<<<<< HEAD
        ...(searchParams.passengerName && {
          passenger_name: {
            contains: searchParams.passengerName,
            mode: "insensitive",
          },
        }),
=======
>>>>>>> dev
        ...query,
      },
    });
}
