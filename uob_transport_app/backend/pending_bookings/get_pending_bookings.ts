import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export async function getPendingBookings(
  page: number,
  pageSize: number,
  searchParams: {
    from?: string;
    to?: string;
    passengerName?: string;
    pickUpTimeFrom?: string;
    pickUpTimeTo?: string;
    isFlight: boolean;
  },
) {
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
      dropoff_location: {
        contains: searchParams.to,
        mode: "insensitive"
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
    query["trip"] = {
      flight_num: {
        not: null,
        notIn: [""],
      },
    };
  }

  return prisma.booking.findMany({
    where: {
      booking_status: "Pending",
      ...(searchParams.passengerName && {
        passenger_name: {
          contains: searchParams.passengerName,
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

export async function getPendingBookingsCount(searchParams: {
  from?: string;
  to?: string;
  passengerName?: string;
  pickUpTimeFrom?: string;
  pickUpTimeTo?: string;
  isFlight: boolean;
}) {
  const query: { [key: string]: string | object } = {};
  if (searchParams.from !== undefined) {
    query["trip"] = {
      pickup_location: {
        contains: searchParams.from,
      },
    };
  }
  if (searchParams.to !== undefined) {
    query["trip"] = {
      dropoff_location: {
        contains: searchParams.to,
      },
    };
  }
  if (searchParams.passengerName !== undefined) {
    // Here we assume passengerName refers to the name of the user, ignore the last name for simplicity
    query['passenger_name'] = {
      name: {
        contains: searchParams.passengerName,
        mode: "insensitive",
      }
    }
  }
  if (searchParams.isFlight) {
    query["trip"] = {
      flight_num: {
        not: null,
        notIn: [""],
      },
    };
  }
  return prisma.booking.count({
    where: {
      booking_status: "Pending",
      ...(searchParams.passengerName && {
        passenger_name: {
          contains: searchParams.passengerName,
          mode: "insensitive",
        },
      }),
      ...query,
    },
  });
}
