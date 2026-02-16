import { prismaMock } from "@/utils/singleton";
import {
  createUserResetAccess,
  getUserResetAccess,
  getUserResetByUuidAccess,
  deleteUserResetAccess,
} from '@/backend/access/user_reset_access';

jest.mock('@/utils/client', () => ({
  __esModule: true,
  default: {
    user_reset: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('user_reset_access', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createUserResetAccess creates reset record', async () => {
    const mockResult = { id: 1, email: 'a@test.com', uuid: 'u1' };
    (prismaMock.user_reset.create as jest.Mock).mockResolvedValue(mockResult);

    const result = await createUserResetAccess('a@test.com', 'u1');

    expect(prismaMock.user_reset.create).toHaveBeenCalledTimes(1);

    const callArgs = (prismaMock.user_reset.create as jest.Mock).mock.calls[0][0];

    expect(callArgs.data.email).toBe('a@test.com');
    expect(callArgs.data.uuid).toBe('u1');
    expect(callArgs.data.expired_at).toBeInstanceOf(Date);

    expect(result).toEqual(mockResult);
  });

  test('getUserResetAccess queries by email', async () => {
    const mockResult = { id: 2, email: 'b@test.com', uuid: 'u2' };
    (prismaMock.user_reset.findUnique as jest.Mock).mockResolvedValue(mockResult);

    const result = await getUserResetAccess('b@test.com');

    expect(prismaMock.user_reset.findUnique).toHaveBeenCalledWith({
      where: { email: 'b@test.com' },
    });

    expect(result).toEqual(mockResult);
  });

  test('getUserResetByUuidAccess queries by uuid', async () => {
    const mockResult = { id: 3, email: 'c@test.com', uuid: 'uuid-123' };
    (prismaMock.user_reset.findUnique as jest.Mock).mockResolvedValue(mockResult);

    const result = await getUserResetByUuidAccess('uuid-123');

    expect(prismaMock.user_reset.findUnique).toHaveBeenCalledWith({
      where: { uuid: 'uuid-123' },
    });

    expect(result).toEqual(mockResult);
  });

  test('deleteUserResetAccess deletes by id', async () => {
    const mockResult = { id: 4, email: 'd@test.com', uuid: 'u4' };
    (prismaMock.user_reset.delete as jest.Mock).mockResolvedValue(mockResult);

    const result = await deleteUserResetAccess(4);

    expect(prismaMock.user_reset.delete).toHaveBeenCalledWith({
      where: { id: 4 },
    });

    expect(result).toEqual(mockResult);
  });

});
