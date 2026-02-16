import prisma from '@/utils/client';
import {
  searchUserAccess,
  updateUserPassowrdAccess,
  getUserByEmailAccess,
  getUserListAccess,
  getUserCountAccess,
  updateUserAccess,
  isAdmin,
} from '@/backend/access/user_access';

jest.mock('@/utils/client', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe('user_access', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('searchUserAccess calls findUnique with include', async () => {
    const mockUser = { user_id: 1, email: 'a@test.com' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await searchUserAccess('a@test.com');

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'a@test.com' },
      include: { department: true },
    });

    expect(result).toEqual(mockUser);
  });

  test('updateUserPassowrdAccess updates password', async () => {
    const mockUser = { user_id: 2, password: 'newpass' };
    (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

    const result = await updateUserPassowrdAccess('b@test.com', 'newpass');

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email: 'b@test.com' },
      data: { password: 'newpass' },
    });

    expect(result).toEqual(mockUser);
  });

  test('getUserByEmailAccess calls findUnique', async () => {
    const mockUser = { user_id: 3, email: 'c@test.com' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await getUserByEmailAccess('c@test.com');

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'c@test.com' },
    });

    expect(result).toEqual(mockUser);
  });

  test('getUserListAccess builds query correctly', async () => {
    const mockUsers = [{ user_id: 1, name: 'Alice' }];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

    const result = await getUserListAccess(1, 10, 'Ali', 'admin', 1);

    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: {
        name: { contains: 'Ali', mode: 'insensitive' },
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
    (prisma.user.count as jest.Mock).mockResolvedValue(5);

    const result = await getUserCountAccess('Bob', 'staff', 0);

    expect(prisma.user.count).toHaveBeenCalledWith({
      where: {
        name: { contains: 'Bob', mode: 'insensitive' },
        role: 'staff',
        user_status: 0,
      },
    });

    expect(result).toBe(5);
  });

  test('updateUserAccess connects department when provided', async () => {
    const mockUser = { user_id: 9 };
    (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

    const result = await updateUserAccess(9, {
      name: 'NewName',
      department: { dep_id: 7 },
    });

    expect(prisma.user.update).toHaveBeenCalledWith({
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
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      user_id: 1,
      role: 'super_admin',
    });

    const result = await isAdmin(1);

    expect(result).toBe(true);
  });

  test('isAdmin returns false for non-admin', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      user_id: 2,
      role: 'student',
    });

    const result = await isAdmin(2);

    expect(result).toBe(false);
  });

});
