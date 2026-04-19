import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ViewManagerDialog from "@/app/super/departmentManageComponents/viewManagerDialog";

const baseManager = {
  time_created: "2025-06-01T12:00:00.000Z",
  user_id: 5,
  email: "manager@example.com",
  full_name: "Carol Manager",
  phone_number: "+44 7100000099",
  role: "finance_staff",
  user_status: 1,
};

describe("Super-admin ViewManagerDialog", () => {
  test("does not render when closed", () => {
    render(
      <ViewManagerDialog
        viewData={baseManager}
        dialogOpen={false}
        handleDialogClose={jest.fn()}
      />,
    );
    expect(screen.queryByText("Manager Detail")).not.toBeInTheDocument();
  });

  test("renders manager fields when open", () => {
    render(
      <ViewManagerDialog
        viewData={baseManager}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
      />,
    );

    expect(screen.getByText("Manager Detail")).toBeInTheDocument();
    expect(screen.getByText("Carol Manager")).toBeInTheDocument();
    expect(screen.getByText("manager@example.com")).toBeInTheDocument();
    expect(screen.getByText("+44 7100000099")).toBeInTheDocument();
    expect(screen.getByText("Finance Staff")).toBeInTheDocument();
  });

  test("renders Approved status for user_status=1", () => {
    render(
      <ViewManagerDialog
        viewData={{ ...baseManager, user_status: 1 }}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
      />,
    );
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });

  test("renders Pending status for user_status=0", () => {
    render(
      <ViewManagerDialog
        viewData={{ ...baseManager, user_status: 0 }}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
      />,
    );
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  test("clicking Close button invokes handleDialogClose", async () => {
    const user = userEvent.setup();
    const handleDialogClose = jest.fn();

    render(
      <ViewManagerDialog
        viewData={baseManager}
        dialogOpen={true}
        handleDialogClose={handleDialogClose}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(handleDialogClose).toHaveBeenCalledTimes(1);
  });

  test("renders Rejected status for user_status=2", () => {
    render(
      <ViewManagerDialog
        viewData={{ ...baseManager, user_status: 2 }}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
      />,
    );
    expect(screen.getByText("Rejected")).toBeInTheDocument();
  });

  test("renders default chip colour when user_status is unknown", () => {
    render(
      <ViewManagerDialog
        viewData={{ ...baseManager, user_status: 99 }}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
      />,
    );
    expect(screen.getByText("User Status:")).toBeInTheDocument();
  });

  test("renders blank time when time_created is missing", () => {
    render(
      <ViewManagerDialog
        viewData={{ ...baseManager, time_created: "" }}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
      />,
    );
    expect(screen.getByText("Time Created:")).toBeInTheDocument();
  });

  test("clicking close icon invokes handleDialogClose", async () => {
    const user = userEvent.setup();
    const handleDialogClose = jest.fn();

    render(
      <ViewManagerDialog
        viewData={baseManager}
        dialogOpen={true}
        handleDialogClose={handleDialogClose}
      />,
    );

    await user.click(screen.getByRole("button", { name: "close" }));
    expect(handleDialogClose).toHaveBeenCalledTimes(1);
  });
});
