import { PrismaClient, User, department } from "@/generated/prisma/client";

const prisma = new PrismaClient();

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
      email,
    },
  });
};
