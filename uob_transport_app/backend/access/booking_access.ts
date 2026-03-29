import { booking } from '@/generated/prisma/client'
import prisma from '@/utils/client'

export const getUserBookingsAccess = async (userId: number, page: number, pageSize: number, searchParams: { from?: string, to?: string, bookingStatus?: string, pickUpTimeFrom?: string, pickUpTimeTo?: string }): Promise<booking[]> => {
  const query: { [key: string]: string | number | object } = {}
  if (searchParams.from !== undefined) {
    query['trip'] = {
      pickup_location: {
        // case insensitive
        contains: searchParams.from.toLowerCase().trim(),
        mode: 'insensitive'
      }
    }
  }
  if (searchParams.to !== undefined) {
    query['trip'] = {
      ...query['trip'] as object,
      dropoff_location: {
        // case insensitive
        contains: searchParams.to.toLowerCase().trim(),
        mode: 'insensitive'
      }
    }
  }
  if (searchParams.bookingStatus !== undefined) {
    query['booking_status'] = searchParams.bookingStatus
  }
  if (searchParams.pickUpTimeFrom !== undefined && searchParams.pickUpTimeTo !== undefined) {
    const toDate = new Date(searchParams.pickUpTimeTo);
    toDate.setUTCHours(23, 59, 59, 999);
    
    query['trip'] = {
      ...query['trip'] as object,
      pickup_time: {
        gte: new Date(searchParams.pickUpTimeFrom),
        lte: toDate,
      }
    }
  } else if (searchParams.pickUpTimeFrom !== undefined) {
    query['trip'] = {
      ...query['trip'] as object,
      pickup_time: {
        gte: new Date(searchParams.pickUpTimeFrom),
      }
    }
  } else if (searchParams.pickUpTimeTo !== undefined) {
    const toDate = new Date(searchParams.pickUpTimeTo);
    toDate.setUTCHours(23, 59, 59, 999);
    
    query['trip'] = {
      ...query['trip'] as object,
      pickup_time: {
        lte: toDate,
      }
    }
  }
  return prisma.booking.findMany({
    where: {
      ...query,
      user_id: userId === -1 ? undefined : userId,
    },
    include: {
      trip: true,
      department: true,
      ...(userId === -1 ? { User: { select: { full_name: true } } } : {})
    },
    orderBy: {
      time_created: 'desc'
    },
    skip: page * pageSize,
    take: pageSize
  })
}

// Get all details about a specific booking by both User ID and Booking ID.
// Allows us to match bookings to the creator of it / verify ownership.
export const getBookingDetails = async (userId: number, bookingId: number): Promise<booking | null> => {
  // If userId is -1, it bypasses the user check.
  if (userId === -1) {
    return prisma.booking.findUnique({
      where: {
        booking_id: bookingId,
      }
    })
  } else {
    return prisma.booking.findFirst({
      where: {
        booking_id: bookingId,
        user_id: userId
      }
    })
  }
}

export const getTripDetails = async (tripId: number) => {
  return prisma.trip.findUnique({
    where: {
      trip_id: tripId
    }
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
        // case insensitive
        contains: searchParams.from.toLowerCase().trim(),
        mode: 'insensitive'
      }
    }
  }
  if (searchParams.to !== undefined) {
    query['trip'] = {
      ...query['trip'] as object,
      dropoff_location: {
        // case insensitive
        contains: searchParams.to.toLowerCase().trim(),
        mode: 'insensitive'
      }
    }
  }
  if (searchParams.bookingStatus !== undefined) {
    query['booking_status'] = searchParams.bookingStatus
  }
  if (searchParams.pickUpTimeFrom !== undefined && searchParams.pickUpTimeTo !== undefined) {
    const toDate = new Date(searchParams.pickUpTimeTo);
    toDate.setUTCHours(23, 59, 59, 999);
    
    query['trip'] = {
      ...query['trip'] as object,
      pickup_time: {
        gte: new Date(searchParams.pickUpTimeFrom),
        lte: toDate,
      }
    }
  } else if (searchParams.pickUpTimeFrom !== undefined) {
    query['trip'] = {
      ...query['trip'] as object,
      pickup_time: {
        gte: new Date(searchParams.pickUpTimeFrom),
      }
    }
  } else if (searchParams.pickUpTimeTo !== undefined) {
    const toDate = new Date(searchParams.pickUpTimeTo);
    toDate.setUTCHours(23, 59, 59, 999);
    
    query['trip'] = {
      ...query['trip'] as object,
      pickup_time: {
        lte: toDate,
      }
    }
  }

  return prisma.booking.count({
    where: {
      ...query,
      user_id: userId === -1 ? undefined : userId,
    },
  })
}
