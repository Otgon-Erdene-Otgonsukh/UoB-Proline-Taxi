import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditDialog from "@/app/super/userManageComponents/eidtDialog";
import { updateUserAsAdmin } from "@/app/super/request";
import type { UserRecord } from "@/model/models";
import type { department } from "@/generated/prisma/client";

jest.mock("@/app/super/request", () => ({
  updateUserAsAdmin: jest.fn(),
}));

const departmentList: department[] = [
  { dep_id: 1, dep_name: "Computer Science" } as department,
  { dep_id: 2, dep_name: "Mathematics" } as department,
];

const baseUser: UserRecord = {
  time_created: "2025-06-01T12:00:00.000Z",
  user_id: 42,
  department: departmentList[0],
  email: "bob.myers@example.com",
  full_name: "Bob Myers",
  phone_number: "+44 7123456789",
  role: "normal_user",
  user_status: 1,
};

//rendering test

describe("Super-admin EditDialog (user edit)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not render when dialogOpen is false", () => {
    render(
      <EditDialog
        editData={baseUser}
        dialogOpen={false}
        handleDialogClose={jest.fn()}
        departmentList={departmentList}
      />,
    );
    expect(screen.queryByText("Edit User")).not.toBeInTheDocument();
  });

  test("renders form with user data pre-filled", () => {
    render(
      <EditDialog
        editData={baseUser}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
        departmentList={departmentList}
      />,
    );

    expect(screen.getByText("Edit User")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Bob Myers");
    expect(screen.getByLabelText("Email")).toHaveValue("bob.myers@example.com");
    expect(screen.getByLabelText("Phone Number")).toHaveValue("7123456789");
  });
});
