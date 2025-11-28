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

export const updateUserTokenAccess = async (email: string, token: string): Promise<User | null> => {
  return prisma.user.update({
    where: {
      email
    },
    data: {
      token: token
    }
  })
}

export const getUserByTokenAccess = async (token: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      token
    }
  })
}
