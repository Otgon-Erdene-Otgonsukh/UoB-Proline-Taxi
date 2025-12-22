import { PrismaClient, User } from '@/generated/prisma/client'

const prisma = new PrismaClient()

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

export const getUserByTokenAccess = async (token: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      token
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
