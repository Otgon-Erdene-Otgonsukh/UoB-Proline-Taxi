import { PrismaClient, User } from '@/generated/prisma/client'

const prisma = new PrismaClient()

export const createUserAccess = async () => {
  return prisma.user.create({
    data: {
      username: 'Alice',
      email: 'alice@prisma.io',
      password: 'xxx',
    },
  })
}

export const searchUserAccess = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      email
    }
  })
}

export const updateUserPassowrdAccess = async (email: string, password: string): Promise<User | null> => {
  return prisma.user.update({
    where: {
      email
    },
    data: {
      password
    }
  })
}

export const getUserByEmailAccess = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      email
    }
  })
}
