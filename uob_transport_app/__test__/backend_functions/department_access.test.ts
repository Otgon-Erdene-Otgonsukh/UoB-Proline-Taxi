import { prismaMock } from "@/utils/singleton";
import { getDepartmentsListAccess, createNewDepartmentAccess } from '@/backend/access/departments_access';

describe('getDepartmentsListAccess', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns filtered departments', async () => {
    const mockResult = [
      { dep_id: 1, dep_name: 'Computer Science' },
      { dep_id: 2, dep_name: 'Computing' },
    ];

    (prismaMock.department.findMany as jest.Mock).mockResolvedValue(mockResult);

    const result = await getDepartmentsListAccess('Comp');

    expect(prismaMock.department.findMany).toHaveBeenCalledWith({
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

    (prismaMock.department.findMany as jest.Mock).mockResolvedValue(mockResult);

    const result = await getDepartmentsListAccess(undefined);

    expect(prismaMock.department.findMany).toHaveBeenCalledWith({
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


  test('createNewDepartmentAccess creates department correctly', async () => {
    const mockDep = { dep_id: 1, dep_name: 'Math' };

    (prismaMock.department.create as jest.Mock).mockResolvedValue(mockDep);

    const result = await createNewDepartmentAccess('Math');

    expect(prismaMock.department.create).toHaveBeenCalledWith({
      data: {
        dep_name: 'Math',
      },
    });

    expect(result).toBe(mockDep);
  });

});
