import { PrismaClient } from '@/generated/prisma/client'
import { user_reset } from "@/generated/prisma/client"

const prisma = new PrismaClient()

export const createUserReset = async (userId: number, uuid: string): Promise<user_reset | null> => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return prisma.user_reset.create({
    data: {
      user_id: userId,
      uuid,
      expired_at: tomorrow
    },
  })
}