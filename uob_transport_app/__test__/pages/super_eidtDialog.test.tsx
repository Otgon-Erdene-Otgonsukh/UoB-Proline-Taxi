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

//validation test

    test("shows error helper when name is cleared", async () => {
    const user = userEvent.setup();
    render(
      <EditDialog
        editData={baseUser}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
        departmentList={departmentList}
      />,
    );

    await user.clear(screen.getByLabelText("Name"));
    expect(screen.getByText("Name cannot be empty")).toBeInTheDocument();
  });

  test("shows empty-email helper when email is cleared", async () => {
    const user = userEvent.setup();
    render(
      <EditDialog
        editData={baseUser}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
        departmentList={departmentList}
      />,
    );

    await user.clear(screen.getByLabelText("Email"));
    expect(
      screen.getByText("Enter email the code to be sent!"),
    ).toBeInTheDocument();
  });

  test("shows invalid-email helper when email has no @", async () => {
    const user = userEvent.setup();
    render(
      <EditDialog
        editData={baseUser}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
        departmentList={departmentList}
      />,
    );

    const emailInput = screen.getByLabelText("Email");
    await user.clear(emailInput);
    await user.type(emailInput, "not-an-email");
    expect(
      screen.getByText("Please enter a valid email address!"),
    ).toBeInTheDocument();
  });

  test("shows empty-phone helper when phone is cleared", async () => {
    const user = userEvent.setup();
    render(
      <EditDialog
        editData={baseUser}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
        departmentList={departmentList}
      />,
    );

    await user.clear(screen.getByLabelText("Phone Number"));
    expect(screen.getByText("Please enter phone number")).toBeInTheDocument();
  });
});
