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
  test("clicking Cancel invokes handleDialogClose(false)", async () => {
    const user = userEvent.setup();
    const handleDialogClose = jest.fn();

    render(
      <EditDialog
        editData={baseUser}
        dialogOpen={true}
        handleDialogClose={handleDialogClose}
        departmentList={departmentList}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(handleDialogClose).toHaveBeenCalledWith(false);
  });

  test("clicking close icon invokes handleDialogClose(false)", async () => {
    const user = userEvent.setup();
    const handleDialogClose = jest.fn();

    render(
      <EditDialog
        editData={baseUser}
        dialogOpen={true}
        handleDialogClose={handleDialogClose}
        departmentList={departmentList}
      />,
    );

    await user.click(screen.getByRole("button", { name: "close" }));
    expect(handleDialogClose).toHaveBeenCalledWith(false);
  });

  test("Save submits updated data and closes on success", async () => {
    const user = userEvent.setup();
    const handleDialogClose = jest.fn();
    (updateUserAsAdmin as jest.Mock).mockResolvedValue({ status: 200 });

    render(
      <EditDialog
        editData={baseUser}
        dialogOpen={true}
        handleDialogClose={handleDialogClose}
        departmentList={departmentList}
      />,
    );

    const nameInput = screen.getByLabelText("Name");
    await user.clear(nameInput);
    await user.type(nameInput, "Alice");

    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(updateUserAsAdmin).toHaveBeenCalledTimes(1);
    });

    const payload = (updateUserAsAdmin as jest.Mock).mock.calls[0][0];
    expect(payload.full_name).toBe("Alice");
    expect(payload.user_id).toBe(42);
    expect(payload.phone_number).toBe("+44 7123456789");

    await waitFor(() => {
      expect(handleDialogClose).toHaveBeenCalledWith(true);
    });
  });

  test("shows error snackbar when update fails", async () => {
    const user = userEvent.setup();
    (updateUserAsAdmin as jest.Mock).mockResolvedValue({ status: 500 });

    render(
      <EditDialog
        editData={baseUser}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
        departmentList={departmentList}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(
        screen.getByText("Update Failed! Try again"),
      ).toBeInTheDocument();
    });
  });

  test("shows success snackbar after successful save", async () => {
    const user = userEvent.setup();
    (updateUserAsAdmin as jest.Mock).mockResolvedValue({ status: 200 });

    render(
      <EditDialog
        editData={baseUser}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
        departmentList={departmentList}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(screen.getByText("Update success!")).toBeInTheDocument();
    });
  });
  test("does not submit when name is empty", async () => {
    const user = userEvent.setup();
    (updateUserAsAdmin as jest.Mock).mockResolvedValue({ status: 200 });

    render(
      <EditDialog
        editData={baseUser}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
        departmentList={departmentList}
      />,
    );

    await user.clear(screen.getByLabelText("Name"));
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(updateUserAsAdmin).not.toHaveBeenCalled();
  });

  test("does not submit when email is invalid", async () => {
    const user = userEvent.setup();
    (updateUserAsAdmin as jest.Mock).mockResolvedValue({ status: 200 });

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
    await user.type(emailInput, "invalid");

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(updateUserAsAdmin).not.toHaveBeenCalled();
  });

  test("does not submit when phone is empty", async () => {
    const user = userEvent.setup();
    (updateUserAsAdmin as jest.Mock).mockResolvedValue({ status: 200 });

    render(
      <EditDialog
        editData={baseUser}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
        departmentList={departmentList}
      />,
    );

    await user.clear(screen.getByLabelText("Phone Number"));
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(updateUserAsAdmin).not.toHaveBeenCalled();
  });

  test("email cleared then re-typed without @ then with @ hits all email branches", async () => {
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
    // empty branch
    await user.clear(emailInput);
    // invalid (no @)
    await user.type(emailInput, "bad");
    // valid again
    await user.type(emailInput, "@example.com");
    expect(emailInput).toHaveValue("bad@example.com");
  });

  test("save failure opens snackbar which can be closed", async () => {
    const user = userEvent.setup();
    (updateUserAsAdmin as jest.Mock).mockResolvedValue({ status: 500 });

    render(
      <EditDialog
        editData={baseUser}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
        departmentList={departmentList}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Save" }));

    const errorMsg = await screen.findByText(
      /error|fail|try again/i,
    );
    expect(errorMsg).toBeInTheDocument();

    // Close snackbar via its Alert close icon
    const closeIcons = screen.getAllByRole("button", { name: /close/i });
    await user.click(closeIcons[closeIcons.length - 1]);

    await waitFor(() =>
      expect(
        screen.queryByText(/error|fail|try again/i),
      ).not.toBeInTheDocument(),
    );
  });

  test("initialises with empty country code and phone when phone_number is blank", () => {
    render(
      <EditDialog
        editData={{ ...baseUser, phone_number: "" }}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
        departmentList={departmentList}
      />,
    );

    expect(screen.getByLabelText("Phone Number")).toHaveValue("");
  });

  test("changing role, user status and department updates form and saves", async () => {
    const user = userEvent.setup();
    const handleDialogClose = jest.fn();
    (updateUserAsAdmin as jest.Mock).mockResolvedValue({ status: 200 });

    render(
      <EditDialog
        editData={baseUser}
        dialogOpen={true}
        handleDialogClose={handleDialogClose}
        departmentList={departmentList}
      />,
    );

    const roleSelect = screen.getByRole("combobox", { name: /Role/i });
    await user.click(roleSelect);
    await user.click(await screen.findByRole("option", { name: "Finance Staff" }));

    const statusSelect = screen.getByRole("combobox", {
      name: /User Status/i,
    });
    await user.click(statusSelect);
    await user.click(await screen.findByRole("option", { name: "Pending" }));

    const deptInput = screen.getByLabelText("Departments");
    await user.click(deptInput);
    await user.clear(deptInput);
    await user.type(deptInput, "Math");
    const mathOption = await screen.findByRole("option", {
      name: "Mathematics",
    });
    await user.click(mathOption);

    await user.click(screen.getByRole("button", { name: /Save/i }));

    await waitFor(() => {
      expect(updateUserAsAdmin).toHaveBeenCalledWith(
        expect.objectContaining({
          role: "finance_staff",
          user_status: 0,
          department: expect.objectContaining({ dep_id: 2 }),
        }),
      );
    });
  });

  test("changing country code updates phone prefix on save", async () => {
    const user = userEvent.setup();
    (updateUserAsAdmin as jest.Mock).mockResolvedValue({ status: 200 });

    render(
      <EditDialog
        editData={baseUser}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
        departmentList={departmentList}
      />,
    );

    const countrySelects = screen.getAllByRole("combobox");
    await user.click(countrySelects[0]);
    await user.click(await screen.findByRole("option", { name: /US\/CA/ }));

    await user.click(screen.getByRole("button", { name: /Save/i }));

    await waitFor(() => {
      expect(updateUserAsAdmin).toHaveBeenCalledWith(
        expect.objectContaining({ phone_number: "+1 7123456789" }),
      );
    });
  });

  test("pressing Escape triggers Dialog onClose with false", async () => {
    const user = userEvent.setup();
    const handleDialogClose = jest.fn();

    render(
      <EditDialog
        editData={baseUser}
        dialogOpen={true}
        handleDialogClose={handleDialogClose}
        departmentList={departmentList}
      />,
    );

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(handleDialogClose).toHaveBeenCalledWith(false);
    });
  });
});
