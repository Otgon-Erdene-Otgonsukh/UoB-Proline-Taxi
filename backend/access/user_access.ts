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

export const searchUser = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      email
    }
  })
}

export const updateUserToken = async (email: string, token: string): Promise<User | null> => {
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
