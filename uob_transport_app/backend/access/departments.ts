import { PrismaClient } from '@/generated/prisma/client'

const prisma = new PrismaClient()

export const getDepartmentsListAccess = async (depName: string | undefined): Promise<{ dep_id: number, dep_name: string }[]> => {
  return prisma.department.findMany({
    select: {
      dep_id: true,
      dep_name: true
    },
    where: {
      dep_name: {
        contains: depName
      }
    }
  })
}
