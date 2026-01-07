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

export const getUserListAccess = async (page: number, pageSize: number, name?: string, role?: string, userStatus?: number): Promise<User[] | null> => {
  const query: { [key: string]: string | number | object } = {}
  if (name) {
    query['name'] = {
      contains: name
    }
  }
  if (role) {
    query['role'] = role
  }
  if (userStatus) {
    query['user_status'] = userStatus
  }
  return prisma.user.findMany({
    where: query,
    include: {
      department: true
    },
    orderBy: {
      time_created: 'desc'
    },
    skip: page * pageSize,
    take: pageSize
  })
}

export const getUserCountAccess = async (name?: string, role?: string, userStatus?: number): Promise<number | null> => {
  const query: { [key: string]: string | number | object } = {}
  if (name) {
    query['name'] = {
      contains: name
    }
  }
  if (role) {
    query['role'] = role
  }
  if (userStatus) {
    query['user_status'] = userStatus
  }
  return prisma.user.count({
    where: query,
  })
}
