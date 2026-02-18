import { prismaMock } from "@/utils/singleton";
import updateUserInfo from "@/backend/update_user_info/update_user";
import prisma from "@/utils/client";

describe("Update user info of the profile page works as intended on conditions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Department update links the user correctly when department exists in the DB", async () => {
    const data = {
      user_id: 2,
      newName: "Bob",
      newEmail: "bob@gmail.com",
      newPhoneNumber: "213498173",
      newDepartment: "Arts",
    };
    prismaMock.department.findFirst.mockResolvedValue({
      dep_id: 1,
    });
    await updateUserInfo(
      data.user_id,
      data.newName,
      data.newEmail,
      data.newPhoneNumber,
      data.newDepartment,
    );
    expect(prisma.department.findFirst).toHaveBeenCalledTimes(1);
    expect(prisma.department.findFirst).toHaveBeenCalledWith({
      where: {
        dep_name: "Arts",
      },
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: {
        user_id: 2,
      },
      data: {
        full_name: "Bob",
        email: "bob@gmail.com",
        phone_number: "213498173",
        dep_id: 1,
      },
    });
  });

  test("Department update links the user to new department entry if it is not in DB", async () => {
    const data = {
      user_id: 2,
      newName: "Bob",
      newEmail: "bob@gmail.com",
      newPhoneNumber: "213498173",
      newDepartment: "Arts",
    };
    prismaMock.department.findFirst.mockResolvedValue(null);
    prismaMock.department.create.mockResolvedValue({
      dep_id: 4,
    });
    await updateUserInfo(
      data.user_id,
      data.newName,
      data.newEmail,
      data.newPhoneNumber,
      data.newDepartment,
    );

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: {
        user_id: 2,
      },
      data: {
        full_name: "Bob",
        email: "bob@gmail.com",
        phone_number: "213498173",
        dep_id: 4,
      },
    });
  });

  test("Changes without deparment is processed normally", async () => {
    const data = {
      user_id: 2,
      newName: "Bob",
      newEmail: "bob@gmail.com",
      newPhoneNumber: "213498173",
      newDepartment: undefined,
    };

    await updateUserInfo(
      data.user_id,
      data.newName,
      data.newEmail,
      data.newPhoneNumber,
      data.newDepartment,
    );
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: {
        user_id: 2,
      },
      data: {
        full_name: "Bob",
        email: "bob@gmail.com",
        phone_number: "213498173",
      },
    });
    expect(prisma.department.findFirst).not.toHaveBeenCalled();
  });

  test("When only one update argument is passed, conditional query is built correctly", async () => {
    const data = {
      user_id: 2,
      newName: undefined,
      newEmail: undefined,
      newPhoneNumber: "213498173",
      newDepartment: undefined,
    };

    await updateUserInfo(
      data.user_id,
      data.newName,
      data.newEmail,
      data.newPhoneNumber,
      data.newDepartment,
    );
    expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: {
            user_id: 2
        },
        data: {
            phone_number: "213498173"
        }
    })
  });
});
