import { PrismaClient, booking } from '@/generated/prisma/client'

const prisma = new PrismaClient()

export const getUserBookings = async (userId: number, page: number, pageSize: number): Promise<booking[]> => {
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
