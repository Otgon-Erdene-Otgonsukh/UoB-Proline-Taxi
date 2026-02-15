import prisma from '@/utils/client';
import { getDepartmentsListAccess } from '@/backend/access/departments_access';

jest.mock('@/utils/client', () => ({
  __esModule: true,
  default: {
    department: {
      findMany: jest.fn(),
    },
  },
}));

describe('getDepartmentsListAccess', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns filtered departments', async () => {
    const mockResult = [
      { dep_id: 1, dep_name: 'Computer Science' },
      { dep_id: 2, dep_name: 'Computing' },
    ];

    (prisma.department.findMany as jest.Mock).mockResolvedValue(mockResult);

    const result = await getDepartmentsListAccess('Comp');

    expect(prisma.department.findMany).toHaveBeenCalledWith({
      select: {
        dep_id: true,
        dep_name: true,
      },
      where: {
        dep_name: {
          contains: 'Comp',
        },
      },
    });

    expect(result).toEqual(mockResult);
  });

  test('handles undefined depName', async () => {
    const mockResult: { dep_id: number; dep_name: string }[] = [];

    (prisma.department.findMany as jest.Mock).mockResolvedValue(mockResult);

    const result = await getDepartmentsListAccess(undefined);

    expect(prisma.department.findMany).toHaveBeenCalledWith({
      select: {
        dep_id: true,
        dep_name: true,
      },
      where: {
        dep_name: {
          contains: undefined,
        },
      },
    });

    expect(result).toEqual(mockResult);
  });

});
