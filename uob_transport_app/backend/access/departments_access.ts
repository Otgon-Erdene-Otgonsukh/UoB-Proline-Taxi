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

export const createNewDepartmentAccess = async (depName: string): Promise<department> => {
  return prisma.department.create({
    data: {
      dep_name: depName,
    }
  })
}

export const getDepartmentListIncludeManagerIdAccess = async (depName: string | undefined): Promise<{ dep_id: number, dep_name: string, manager_id: number|null }[]> => {
  return prisma.department.findMany({
    select: {
      dep_id: true,
      dep_name: true,
      manager_id: true,
    },
    where: {
      dep_name: {
        contains: depName
      }
    }
  })
}
