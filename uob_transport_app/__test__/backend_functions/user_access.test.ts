import { prismaMock } from "@/utils/singleton";
import {
  searchUserAccess,
  updateUserPassowrdAccess,
  getUserByEmailAccess,
  getUserListAccess,
  getUserCountAccess,
  updateUserAccess,
  isAdmin,
  getUserFromID,
  getUsersByIdsAccess,
  getUsersByDepIdAccess,
  changeDepartmentForUsersAccess
} from '@/backend/access/user_access';

describe('user_access', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('searchUserAccess calls findUnique with include', async () => {
    const mockUser = { user_id: 1, email: 'a@test.com' };
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await searchUserAccess('a@test.com');

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'a@test.com' },
      include: { department: true },
    });

    expect(result).toEqual(mockUser);
  });

  test('updateUserPassowrdAccess updates password', async () => {
    const mockUser = { user_id: 2, password: 'newpass' };
    (prismaMock.user.update as jest.Mock).mockResolvedValue(mockUser);

    const result = await updateUserPassowrdAccess('b@test.com', 'newpass');

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { email: 'b@test.com' },
      data: { password: 'newpass' },
    });

    expect(result).toEqual(mockUser);
  });

  test('getUserByEmailAccess calls findUnique', async () => {
    const mockUser = { user_id: 3, email: 'c@test.com' };
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await getUserByEmailAccess('c@test.com');

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'c@test.com' },
    });

    expect(result).toEqual(mockUser);
  });

  test('getUserListAccess builds query correctly', async () => {
    const mockUsers = [{ user_id: 1, name: 'Alice' }];
    (prismaMock.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

    const result = await getUserListAccess(1, 10, 'Ali', 'admin', 1);

    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {
        full_name: { contains: 'Ali', mode: 'insensitive' },
        role: 'admin',
        user_status: 1,
      },
      include: { department: true },
      orderBy: { time_created: 'desc' },
      omit: { password: true },
      skip: 10,
      take: 10,
    });

    expect(result).toEqual(mockUsers);
  });

  test('getUserCountAccess calls count', async () => {
    (prismaMock.user.count as jest.Mock).mockResolvedValue(5);

    const result = await getUserCountAccess('Bob', 'staff', 0);

    expect(prismaMock.user.count).toHaveBeenCalledWith({
      where: {
        full_name: { contains: 'Bob', mode: 'insensitive' },
        role: 'staff',
        user_status: 0,
      },
    });

    expect(result).toBe(5);
  });

  test('updateUserAccess connects department when provided', async () => {
    const mockUser = { user_id: 9 };
    (prismaMock.user.update as jest.Mock).mockResolvedValue(mockUser);

    const result = await updateUserAccess(9, {
      name: 'NewName',
      department: { dep_id: 7 },
    });

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { user_id: 9 },
      data: {
        name: 'NewName',
        department: {
          connect: { dep_id: 7 },
        },
      },
    });

    expect(result).toEqual(mockUser);
  });

  test('isAdmin returns true for admin roles', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
      user_id: 1,
      role: 'super_admin',
    });

    const result = await isAdmin(1);

    expect(result).toBe(true);
  });

  test('isAdmin returns false for non-admin', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
      user_id: 2,
      role: 'student',
    });

    const result = await isAdmin(2);

    expect(result).toBe(false);
  });

  test('getUserFromID calls findUnique correctly', async () => {
    const mockUser = { user_id: 1 };
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await getUserFromID(1);

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { user_id: 1 },
      include: { department: true },
    });

    expect(result).toBe(mockUser);
  });

  test('getUsersByIdsAccess queries by id array', async () => {
    const mockUsers = [{ user_id: 1 }];
    (prismaMock.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

    const result = await getUsersByIdsAccess([1, 2]);

    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {
        user_id: {
          in: [1, 2],
        },
      },
      select: {
        time_created: true,
        user_id: true,
        full_name: true,
        email: true,
        phone_number: true,
        role: true,
        user_status: true,
      },
    });

    expect(result).toEqual(mockUsers);
  });

  test('getUsersByDepIdAccess queries correctly', async () => {
    const mockUsers = [{ user_id: 1 }];
    (prismaMock.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

    const result = await getUsersByDepIdAccess(5);

    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: { dep_id: 5 },
      select: {
        time_created: true,
        user_id: true,
        full_name: true,
        email: true,
        phone_number: true,
        role: true,
        user_status: true,
      },
    });

    expect(result).toEqual(mockUsers);
  });

});
