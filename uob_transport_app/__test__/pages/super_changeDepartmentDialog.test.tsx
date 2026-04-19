import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChangeDepartmentDialog } from "@/app/super/departmentManageComponents/changeDepartmentDialog";
import { changeDepartmentForUsers } from "@/app/super/request";

jest.mock("@/app/super/request", () => ({
  changeDepartmentForUsers: jest.fn(),
}));

const departmentList = [
  { depId: 1, depName: "Computer Science" },
  { depId: 2, depName: "Mathematics" },
];

const selectedRows = [
  {
    user_id: 10,
    full_name: "Alice Smith",
    email: "alice@example.com",
    phone_number: "+44 7100000001",
  },
  {
    user_id: 11,
    full_name: "Bob Myers",
    email: "bob@example.com",
    phone_number: "+44 7100000002",
  },
];

describe("Super-admin ChangeDepartmentDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not render title when closed", () => {
    render(
      <ChangeDepartmentDialog
        departmentList={departmentList}
        dialogOpen={false}
        handleDialogClose={jest.fn()}
        selectedRows={selectedRows}
      />,
    );
    expect(
      screen.queryByText("Change department for 2 selected members"),
    ).not.toBeInTheDocument();
  });

  test("renders title with selected member count", () => {
    render(
      <ChangeDepartmentDialog
        departmentList={departmentList}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
        selectedRows={selectedRows}
      />,
    );

    expect(
      screen.getByText("Change department for 2 selected members"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Department")).toBeInTheDocument();
  });

  test("Cancel button calls handleDialogClose(false)", async () => {
    const user = userEvent.setup();
    const handleDialogClose = jest.fn();

    render(
      <ChangeDepartmentDialog
        departmentList={departmentList}
        dialogOpen={true}
        handleDialogClose={handleDialogClose}
        selectedRows={selectedRows}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(handleDialogClose).toHaveBeenCalledWith(false);
  });

  test("clicking Save without picking a department shows validation error", async () => {
    const user = userEvent.setup();
    render(
      <ChangeDepartmentDialog
        departmentList={departmentList}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
        selectedRows={selectedRows}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText("Select a department")).toBeInTheDocument();
    expect(changeDepartmentForUsers).not.toHaveBeenCalled();
  });

  test("successful save calls API and closes dialog with chosen dep id", async () => {
    const user = userEvent.setup();
    const handleDialogClose = jest.fn();
    (changeDepartmentForUsers as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({ ok: true }),
    });

    render(
      <ChangeDepartmentDialog
        departmentList={departmentList}
        dialogOpen={true}
        handleDialogClose={handleDialogClose}
        selectedRows={selectedRows}
      />,
    );

    const input = screen.getByLabelText("Department");
    await user.click(input);
    await user.type(input, "Math");
    const option = await screen.findByText("Mathematics");
    await user.click(option);

    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(changeDepartmentForUsers).toHaveBeenCalledWith([10, 11], 2);
    });
    await waitFor(() => {
      expect(handleDialogClose).toHaveBeenCalledWith(true, 2);
    });
  });

  test("error snackbar can be closed via its Alert close icon", async () => {
    const user = userEvent.setup();
    (changeDepartmentForUsers as jest.Mock).mockResolvedValue({ status: 500 });

    render(
      <ChangeDepartmentDialog
        departmentList={departmentList}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
        selectedRows={selectedRows}
      />,
    );

    const input = screen.getByLabelText("Department");
    await user.click(input);
    await user.type(input, "Math");
    const option = await screen.findByText("Mathematics");
    await user.click(option);

    await user.click(screen.getByRole("button", { name: "Save" }));

    const errorAlert = await screen.findByText(
      "Change department failed, try again later!",
    );
    expect(errorAlert).toBeInTheDocument();

    const alertCloseBtn = errorAlert
      .closest(".MuiAlert-root")!
      .querySelector("button")!;
    await user.click(alertCloseBtn);

    await waitFor(() =>
      expect(
        screen.queryByText("Change department failed, try again later!"),
      ).not.toBeInTheDocument(),
    );
  });

  test("failed save shows error snackbar", async () => {
    const user = userEvent.setup();
    (changeDepartmentForUsers as jest.Mock).mockResolvedValue({ status: 500 });

    render(
      <ChangeDepartmentDialog
        departmentList={departmentList}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
        selectedRows={selectedRows}
      />,
    );

    const input = screen.getByLabelText("Department");
    await user.click(input);
    await user.type(input, "Math");
    const option = await screen.findByText("Mathematics");
    await user.click(option);

    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(
        screen.getByText("Change department failed, try again later!"),
      ).toBeInTheDocument();
    });
  });
});
