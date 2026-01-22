import { PrismaClient, booking } from '@/generated/prisma/client'

const prisma = new PrismaClient()

export const getUserBookingsAccess = async (userId: number, page: number, pageSize: number, searchParams: { from?: string, to?: string, bookingStatus?: string, pickUpTimeFrom?: string, pickUpTimeTo?: string }): Promise<booking[]> => {
  const query: { [key: string]: string | number | object } = {}
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
  if (searchParams.bookingStatus !== undefined) {
    query['booking_status'] = searchParams.bookingStatus
  }
  if (searchParams.pickUpTimeFrom !== undefined && searchParams.pickUpTimeTo !== undefined) {
    query['pick_up_time'] = {
      gte: new Date(searchParams.pickUpTimeFrom),
      lte: new Date(searchParams.pickUpTimeTo),
    }
  } else if (searchParams.pickUpTimeFrom !== undefined) {
    query['pick_up_time'] = {
      gte: new Date(searchParams.pickUpTimeFrom),
    }
  } else if (searchParams.pickUpTimeTo !== undefined) {
    query['pick_up_time'] = {
      lte: new Date(searchParams.pickUpTimeTo),
    }
  }
  return prisma.booking.findMany({
    where: {
      user_id: userId,
      ...query
    },
    include: {
      trip: true,
    },
    orderBy: {
      time_created: 'desc'
    },
    skip: page * pageSize,
    take: pageSize
  })
}

export const cancelBookingsAccess = async (bookingId: number): Promise<booking | null> => {
  return prisma.booking.update({
    where: {
      booking_id: bookingId
    },
    data: {
      booking_status: 'Cancelled'
    }
  })
}

export const getUserBookingsCountAccess = async (userId: number, searchParams: { from?: string, to?: string, bookingStatus?: string, pickUpTimeFrom?: string, pickUpTimeTo?: string }): Promise<number> => {
  const query: { [key: string]: string | number | object } = {}
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
  if (searchParams.bookingStatus !== undefined) {
    query['booking_status'] = searchParams.bookingStatus
  }
  if (searchParams.pickUpTimeFrom !== undefined && searchParams.pickUpTimeTo !== undefined) {
    query['pick_up_time'] = {
      gte: new Date(searchParams.pickUpTimeFrom),
      lte: new Date(searchParams.pickUpTimeTo),
    }
  } else if (searchParams.pickUpTimeFrom !== undefined) {
    query['pick_up_time'] = {
      gte: new Date(searchParams.pickUpTimeFrom),
    }
  } else if (searchParams.pickUpTimeTo !== undefined) {
    query['pick_up_time'] = {
      lte: new Date(searchParams.pickUpTimeTo),
    }
  }

  return prisma.booking.count({
    where: {
      user_id: userId,
      ...query
    },
  })
}
