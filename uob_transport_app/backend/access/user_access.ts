import prisma from '@/utils/client';
import { department, User } from '@/generated/prisma/client'
import { BatchPayload } from '@/generated/prisma/internal/prismaNamespace';
type noPasswordUser = Omit<User, "password">

export const searchUserAccess = async (
  email: string
): Promise<(User & { department: department | null }) | null> => {
  return prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      department: true,
    },
  });
};

export const getUserFromID = (
  user_id: number
) => {
  return prisma.user.findUnique({
    where: {
      user_id,
    },
    include: {
      department: true,
    },
  });
};

export const getUsersByIdsAccess = (userIds: number[]) => {
  return prisma.user.findMany({
    where: {
      user_id: {
        in: userIds
      }
    },
    select: {
      time_created: true,
      user_id: true,
      full_name: true,
      email: true,
      phone_number: true,
      role: true,
      user_status: true
    }
  })
}

export const updateUserPassowrdAccess = async (
  email: string,
  password: string
): Promise<User | null> => {
  return prisma.user.update({
    where: {
      email,
    },
    data: {
      password,
    },
  });
};

export const getUserByEmailAccess = async (
  email: string
): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      email
    }
  })
}

export const getUserListAccess = async (page: number, pageSize: number, name?: string, role?: string, userStatus?: number): Promise<noPasswordUser[] | null> => {
  const query: { [key: string]: string | number | object } = {}
  if (name !== undefined) {
    query['full_name'] = {
      contains: name,
      mode: "insensitive"
    }
  }
  if (role !== undefined) {
    query['role'] = role
  }
  if (userStatus !== undefined) {
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
    omit: {
      password: true
    },
    skip: page * pageSize,
    take: pageSize
  })
}

export const getUserCountAccess = async (name?: string, role?: string, userStatus?: number): Promise<number | null> => {
  const query: { [key: string]: string | number | object } = {}
  if (name) {
    query['full_name'] = {
      contains: name,
      mode: "insensitive"
    }
  }
  if (role) {
    query['role'] = role
  }
  if (userStatus !== undefined) {
    query['user_status'] = userStatus
  }
  return prisma.user.count({
    where: query,
  })
}

export const updateUserAccess = async (userId: number, updateData: { [key: string]: string | number | object }): Promise<User | null> => {
  return prisma.user.update({
    where: {
      user_id: userId
    },
    data: {
      ...updateData,
      department: updateData['department'] ? {
        connect: {
          dep_id: (updateData['department'] as department).dep_id
        }
      } : undefined
    }
  })
}

// Check if a user has admin privileges by their ID.
export const isAdmin = async (userId: number): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      user_id: userId
    }
  })

  if (user !== null && (user.role === 'proline_staff' || user.role === 'super_admin')) {
    return true
  } else {
    return false
  }
}

 // Check if a user has finance staff privileges by their ID.
export const isFinanceStaff = async (userId: number): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      user_id: userId
    }
  })

  if (user !== null && user.role === 'finance_staff') {
    return true
  } else {
    return false
  }
}

export const getUsersByDepIdAccess = async (depId: number) => {
  return prisma.user.findMany({
    where: {
      dep_id: depId
    },
    select: {
      time_created: true,
      user_id: true,
      full_name: true,
      email: true,
      phone_number: true,
      role: true,
      user_status: true
    }
  })
}

export const changeDepartmentForUsersAccess = async (userIds: number[], depId: number): Promise<BatchPayload> => {
  return prisma.user.updateMany({
    where: {
      user_id: {
        in: userIds
      }
    },
    data: {
      dep_id: depId
    }
  })
}
