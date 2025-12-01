import { PrismaClient, booking } from '@/generated/prisma/client'

const prisma = new PrismaClient()

export const getUserBookingsAccess = async (userId: number, page: number, pageSize: number): Promise<booking[]> => {
  return prisma.booking.findMany({
    where: {
      user_id: userId,
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

export const getUserBookingsCountAccess = async (userId: number): Promise<number> => {
  return prisma.booking.count({
    where: {
      user_id: userId,
    },
  })
}
