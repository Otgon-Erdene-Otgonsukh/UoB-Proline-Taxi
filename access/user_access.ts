import { PrismaClient } from '../generated/prisma/client'

const prisma = new PrismaClient()

const createUser = async () => {
  return prisma.user.create({
    data: {
      username: 'Alice',
      email: 'alice@prisma.io',
      password: 'xxx',
    },
  })
}

const searchUser = async (email: string) => {
  return prisma.user.findUnique({
    select: {},
    where: {
      email
    }
  })
}

// createUser()
searchUser('alice@prisma.io').then(res => {
  console.log(res);
})
