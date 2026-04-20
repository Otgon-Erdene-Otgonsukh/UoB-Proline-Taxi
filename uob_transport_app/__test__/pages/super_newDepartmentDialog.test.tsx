import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddDepartmentDialog from "@/app/super/departmentManageComponents/newDepartmentDialog";
import { createDepartment } from "@/app/super/request";

jest.mock("@/app/super/request", () => ({
  createDepartment: jest.fn(),
}));

describe("Super-admin AddDepartmentDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not render when dialogOpen is false", () => {
    render(
      <AddDepartmentDialog
        dialogOpen={false}
        handleDialogClose={jest.fn()}
      />,
    );
    expect(screen.queryByText("+ Add New Department")).not.toBeInTheDocument();
  });

  test("renders title, input and action buttons", () => {
    render(
      <AddDepartmentDialog
        dialogOpen={true}
        handleDialogClose={jest.fn()}
      />,
    );

    expect(screen.getByText("+ Add New Department")).toBeInTheDocument();
    expect(screen.getByLabelText("Department Name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  test("typing updates the department name input", async () => {
    const user = userEvent.setup();
    render(
      <AddDepartmentDialog
        dialogOpen={true}
        handleDialogClose={jest.fn()}
      />,
    );

    const input = screen.getByLabelText("Department Name");
    await user.type(input, "History");
    expect(input).toHaveValue("History");
  });

  test("clicking Close invokes handleDialogClose", async () => {
    const user = userEvent.setup();
    const handleDialogClose = jest.fn();
    render(
      <AddDepartmentDialog
        dialogOpen={true}
        handleDialogClose={handleDialogClose}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(handleDialogClose).toHaveBeenCalledTimes(1);
  });

  test("clicking Create with empty name shows error snackbar and does not call API", async () => {
    const user = userEvent.setup();
    render(
      <AddDepartmentDialog
        dialogOpen={true}
        handleDialogClose={jest.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(
        screen.getByText("Name field cannot be empty!"),
      ).toBeInTheDocument();
    });
    expect(createDepartment).not.toHaveBeenCalled();
  });

  test("successful create shows success snackbar and closes dialog", async () => {
    const user = userEvent.setup();
    const handleDialogClose = jest.fn();
    (createDepartment as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({ ok: true }),
    });

    render(
      <AddDepartmentDialog
        dialogOpen={true}
        handleDialogClose={handleDialogClose}
      />,
    );

    await user.type(screen.getByLabelText("Department Name"), "History");
    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(createDepartment).toHaveBeenCalledWith("History");
    });
    await waitFor(() => {
      expect(
        screen.getByText("Create new department successfully!"),
      ).toBeInTheDocument();
    });
    expect(handleDialogClose).toHaveBeenCalledTimes(1);
  });

  test("empty-name snackbar can be closed via Alert close button", async () => {
    const user = userEvent.setup();
    render(
      <AddDepartmentDialog
        dialogOpen={true}
        handleDialogClose={jest.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Create" }));
    expect(
      await screen.findByText("Name field cannot be empty!"),
    ).toBeInTheDocument();

    const closeButtons = screen.getAllByRole("button", { name: /close/i });
    // The last close button is the snackbar Alert close
    await user.click(closeButtons[closeButtons.length - 1]);

    await waitFor(() =>
      expect(
        screen.queryByText("Name field cannot be empty!"),
      ).not.toBeInTheDocument(),
    );
  });

  test("failed create shows error snackbar and keeps dialog open", async () => {
    const user = userEvent.setup();
    const handleDialogClose = jest.fn();
    (createDepartment as jest.Mock).mockResolvedValue({ status: 500 });

    render(
      <AddDepartmentDialog
        dialogOpen={true}
        handleDialogClose={handleDialogClose}
      />,
    );

    await user.type(screen.getByLabelText("Department Name"), "History");
    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(
        screen.getByText("Some error occurs, try again later!"),
      ).toBeInTheDocument();
    });
    expect(handleDialogClose).not.toHaveBeenCalled();
  });
});
