import { department } from '@/generated/prisma/client'
import prisma from '@/utils/client'

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

export const createNewDepartment = async (depName: string, managerId: number): Promise<department> => {
  return prisma.department.create({
    data: {
      dep_name: depName,
      manager_id: managerId
    }
  })
}
