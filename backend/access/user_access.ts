import { PrismaClient, User } from '@/generated/prisma/client'

const prisma = new PrismaClient()

export const createUser = async () => {
  return prisma.user.create({
    data: {
      username: 'Alice',
      email: 'alice@prisma.io',
      password: 'xxx',
    },
  })
}

export const searchUser = async (email: string): Promise<User> => {
  return prisma.user.findUnique({
    select: {
      email: true,
      password: true
    },
    where: {
      email
    }
  })
}
