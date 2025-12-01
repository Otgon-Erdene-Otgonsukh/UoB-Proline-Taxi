import { PrismaClient, user_reset } from '@/generated/prisma/client'

const prisma = new PrismaClient()

export const createUserResetAccess = async (email: string, uuid: string): Promise<user_reset | null> => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return prisma.user_reset.create({
    data: {
      email,
      uuid,
      expired_at: tomorrow
    },
  })
}

export const getUserResetAccess = async (email: string): Promise<user_reset | null> => {
  return prisma.user_reset.findFirst({
    where: {
      email,
    },
  })
}
