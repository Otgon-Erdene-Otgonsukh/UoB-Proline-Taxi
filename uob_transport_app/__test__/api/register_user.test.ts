/**
 * @jest-environment node
 */

import { POST } from "@/app/api/create_user/route";
import bcrypt from "bcryptjs";

jest.mock("../../generated/prisma/client", () => {
  const mockPrisma = {
    department: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    user: {
      create: jest.fn(),
    },
  };

  return {
    PrismaClient: jest.fn(() => mockPrisma),
    __mockPrisma: mockPrisma, // Export for test access
  };
});

jest.mock("bcryptjs");

const jsonBody = { // test data
  mail: "john@example.com",
  password: "password123",
  username: "johndoe",
  department: "Psychology",
  firstName: "John",
  lastName: "Doe",
  role: "user",
  phoneNumber: "1234567890",
};

describe("User creation api end point test.", () => {
  // Get access to the mock through the module
  const { __mockPrisma: mockPrisma } = jest.requireMock(
    "../../generated/prisma/client"
  );

  beforeEach(() => {
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
  });

  test("The new user is assigned to existing department if it exists.", async () => {
    const mockDepartment = { dep_id: 1, dep_name: "Chemistry" };
    mockPrisma.department.findFirst.mockResolvedValue(mockDepartment);

    const req = new Request("http://localhost:3000/api/create_user", {
      method: "POST",
      body: JSON.stringify(jsonBody),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe("User is created successfully.");

    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        dep_id: 1,
        username: jsonBody.username,
        name: jsonBody.firstName,
        surname: jsonBody.lastName,
        phone_number: jsonBody.phoneNumber,
        role: jsonBody.role,
        email: jsonBody.mail,
        password: "hashed_password",
      },
    });
  });

  test("New department entry is created when user without existing department registers.", async () => {
    mockPrisma.department.findFirst.mockResolvedValue(null);
    mockPrisma.department.create.mockResolvedValue({
      dep_id: 2,
      dep_name: "Psychology",
    });

    const req = new Request("http://localhost:300/api/create_user", {
      method: "POST",
      body: JSON.stringify(jsonBody),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe("User is created successfully.");
    expect(mockPrisma.department.create).toHaveBeenCalledWith({
      data: {
        dep_name: jsonBody.department,
      },
    });
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        dep_id: 2,
        username: "johndoe",
        name: "John",
        surname: "Doe",
        phone_number: "1234567890",
        role: "user",
        email: "john@example.com",
        password: "hashed_password",
      },
    });
  });

  test("Error is handled gracefully.", async () => {
    mockPrisma.department.findFirst.mockRejectedValue(
      new Error("Database error.")
    );

    const req = new Request("http://localhost:3000/api/create_user", {
      method: "POST",
      body: JSON.stringify(jsonBody)
    })

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.message).toBe("User was not created.");
  });
});
