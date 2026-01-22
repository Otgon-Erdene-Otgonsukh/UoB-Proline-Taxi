import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export async function getPendingBookings(page: number, pageSize: number, searchParams: { from?: string, to?: string, passengerName?: string, pickUpTimeFrom?: string, pickUpTimeTo?: string }) {
  const query: { [key: string]: string | object } = {};
  if (searchParams.from !== undefined) {
    query['trip'] = {
      pickup_location: {
        contains: searchParams.from
      }
    }
  }
  if (searchParams.to !== undefined) {
    query['trip'] = {
      dropoff_location: {
        contains: searchParams.to
      }
    }
  }
  if (searchParams.passengerName !== undefined) {
    // Here we assume passengerName refers to the first name of the user, ignore the last name for simplicity
    query['firstName'] = {
      name: {
        contains: searchParams.passengerName
      }
    }
  }
  return prisma.booking.findMany({
    where: {
      booking_status: "Pending",
      ...query
    },
    orderBy: {
      time_created: 'desc' // latest one shows up at the top
    },
    include: {   // fetching the connected trip and User and department tables to fill out the dep-dashboard table and view 
      trip: true,
      User: {
        include: {
          department: true,
        },
      },
    },
    skip: page * pageSize,
    take: pageSize
  });
}

export async function getPendingBookingsCount(searchParams: { from?: string, to?: string, passengerName?: string, pickUpTimeFrom?: string, pickUpTimeTo?: string }) {
  const query: { [key: string]: string | object } = {};
  if (searchParams.from !== undefined) {
    query['trip'] = {
      pickup_location: {
        contains: searchParams.from
      }
    }
  }
  if (searchParams.to !== undefined) {
    query['trip'] = {
      dropoff_location: {
        contains: searchParams.to
      }
    }
  }
  if (searchParams.passengerName !== undefined) {
    // Here we assume passengerName refers to the first name of the user, ignore the last name for simplicity
    query['firstName'] = {
      name: {
        contains: searchParams.passengerName
      }
    }
  }
  return prisma.booking.count({
    where: {
      booking_status: "Pending",
      ...query
    },
  });
}
