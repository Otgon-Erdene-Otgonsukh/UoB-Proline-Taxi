/**
 * @jest-environment node
 */
import { POST } from "@/app/api/create_user/route";
import { prismaMock } from "@/utils/singleton";
import bcrypt from "bcryptjs";
import sendReq from "@/backend/register/send_req";

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

jest.mock("@/backend/register/send_req", () => jest.fn())

describe("Registration tests with ensuring behaviour", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Server side validation correctly denies invalid data", async () => {
    const data = {
      mail: "sdasd@gmail.com",
      password: "something",
      username: "dog",
      departmentName: "Arts",
      firstName: "Alvin",
      lastName: "Magy",
      role: "proline_staff",
      phoneNumber: "+44 2134123131",
    };
    const body = JSON.stringify(data);
    const req = new Request("http://localhost:3000/api/create_user", {
      method: "POST",
      body: body,
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  test("When department exists, appointment is made to the user", async () => {
    (sendReq as jest.Mock).mockResolvedValue(undefined);
    prismaMock.department.findFirst.mockResolvedValue({
      dep_id: 1,
      dep_name: "Arts",
    });
    prismaMock.user.create.mockResolvedValue({
      user_id: 1,
    });
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");

    const data = {
      mail: "test@gmail.com",
      password: "something",
      department: "Arts",
      firstName: "John",
      lastName: "Doe",
      role: "normal_user",
      phoneNumber: "+44 2134123131",
    };

    const body = JSON.stringify(data);
    const req = new Request("http://localhost:3000/api/create_user", {
      method: "POST",
      body: body,
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(prismaMock.department.create).not.toHaveBeenCalled();
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        dep_id: 1,
        full_name: "John Doe",
        phone_number: data.phoneNumber,
        role: data.role,
        user_status: 1,
        email: data.mail,
        password: "hashedpassword",
      }
    })
  });

  test("When a new department input comes in, new department is created and user appointed", async () => {
    prismaMock.department.findFirst.mockResolvedValue(null);
    prismaMock.department.create.mockResolvedValue({
      dep_id: 3,
    });
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");

    const data = {
      mail: "test@gmail.com",
      password: "something",
      department: "Chemistry",
      firstName: "John",
      lastName: "Doe",
      role: "normal_user",
      phoneNumber: "+44 2134123131",
    };

    const body = JSON.stringify(data);
    const req = new Request("http://localhost:3000/api/create_user", {
      method: "POST",
      body: body,
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(prismaMock.department.create).toHaveBeenCalledWith({
      data: {
        dep_name: "Chemistry"
      }
    });
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        dep_id: 3,
        full_name: "John Doe",
        phone_number: data.phoneNumber,
        role: data.role,
        user_status: 1,
        email: data.mail,
        password: "hashedpassword",
      }
    })
  });
  
  test("Proline staff registration does not create a new department entry", async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");
    prismaMock.user.create.mockResolvedValue({
      user_id: 11
    });

    const data = {
      mail: "test@prolinetaxi.com",
      password: "something",
      firstName: "John",
      department: "",
      lastName: "Doe",
      role: "proline_staff",
      phoneNumber: "+44 2134123131",
    };

    const body = JSON.stringify(data);
    const req = new Request("http://localhost:3000/api/create_user", {
      method: "POST",
      body: body,
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.department.create).not.toHaveBeenCalled();
  })
});
