import prisma from '@/utils/client';

export default async function updateUserInfo(
  user_id: number,
  newName: string | undefined,
  newEmail: string | undefined,
  newPhoneNumber: string | undefined,
  newDepartment: string | undefined
) {
  if (newDepartment) {
    // Linking the user to the new department if it already exists in the DB
    const department = await prisma.department.findFirst({
      where: {
        dep_name: newDepartment,
      },
    });

    if (department) {
      await prisma.user.update({
        where: {
          user_id: user_id,
        },
        data: {
          ...(newName !== undefined && { name: newName }),
          ...(newEmail !== undefined && { email: newEmail }),
          ...(newPhoneNumber !== undefined && { phone_number: newPhoneNumber }),
          dep_id: department.dep_id
        },
      });
    } else {
      // If the new department is not in the DB, create an entry and link the user
      const createdDepartment = await prisma.department.create({
        data: {
          dep_name: newDepartment,
        },
      });
      await prisma.user.update({
        where: {
          user_id: user_id,
        },
        data: {
          ...(newName !== undefined && { name: newName }),
          ...(newEmail !== undefined && { email: newEmail }),
          ...(newPhoneNumber !== undefined && { phone_number: newPhoneNumber }),
          dep_id: createdDepartment.dep_id
        },
      });
    }
  } else {
    await prisma.user.update({
      where: {
        user_id: user_id,
      },
      data: {
        ...(newName !== undefined && { name: newName }),
        ...(newEmail !== undefined && { email: newEmail }),
        ...(newPhoneNumber !== undefined && { phone_number: newPhoneNumber }),
      },
    });
  }
}
