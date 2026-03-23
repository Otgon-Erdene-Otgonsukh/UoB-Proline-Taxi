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

export const getDepartmentListIncludeManagerIdAccess = async (depName: string | undefined): Promise<{ dep_id: number, dep_name: string, manager_id: number | null, _count: { User: number } }[]> => {
  return prisma.department.findMany({
    select: {
      dep_id: true,
      dep_name: true,
      manager_id: true,
      _count: {
        select: {
          User: true
        }
      }
    },
    where: {
      dep_name: {
        contains: depName
      }
    },
    orderBy: {
      dep_name: 'asc'
    }
  })
}

export const updateDepartmentNameAccess = async (depId: number, newName: string): Promise<department> => {
  return prisma.department.update({
    where: {
      dep_id: depId
    },
    data: {
      dep_name: newName
    }
  })
}

export const deleteDepartmentAccess = async (depId: number): Promise<department> => {
  return prisma.department.delete({
    where: {
      dep_id: depId
    }
  })
}

export const getDepartmentByIdAccess = async (depId: number): Promise<{ dep_id: number, dep_name: string, _count: { User: number } } | null> => {
  return prisma.department.findUnique({
    select: {
      dep_id: true,
      dep_name: true,
      _count: {
        select: {
          User: true
        }
      }
    },
    where: {
      dep_id: depId
    }
  })
}

export const getDepartmentIdfromUserId = async (userId: number): Promise<{dep_id: number | null} | null> => {
  return prisma.user.findUnique({
    where: {
      user_id: userId
    },
    select: {
      dep_id: true
    }
  })
}
