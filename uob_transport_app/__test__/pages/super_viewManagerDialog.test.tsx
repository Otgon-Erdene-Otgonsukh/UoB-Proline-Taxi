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

type ViewManagerDialogTestProps = Omit<
  React.ComponentProps<typeof ViewManagerDialog>,
  "unassignSnackOpen" | "normalClose"
> & {
  unassignSnackOpen?: () => void;
  normalClose?: () => void;
};

const TestViewManagerDialog =
  ViewManagerDialog as React.ComponentType<ViewManagerDialogTestProps>;

const renderManagerDialog = (
  props: Partial<ViewManagerDialogTestProps> = {},
) => {
  const handleDialogClose = props.handleDialogClose ?? jest.fn();
  const unassignSnackOpen = props.unassignSnackOpen ?? jest.fn();
  const normalClose = props.normalClose ?? jest.fn();

  render(
    <TestViewManagerDialog
      viewData={props.viewData ?? baseManager}
      dialogOpen={props.dialogOpen ?? true}
      handleDialogClose={handleDialogClose}
      unassignSnackOpen={unassignSnackOpen}
      normalClose={normalClose}
    />,
  );

  return { handleDialogClose, unassignSnackOpen, normalClose };
};

describe("Super-admin ViewManagerDialog", () => {
  test("does not render when closed", () => {
    renderManagerDialog({ dialogOpen: false });
    expect(screen.queryByText("Manager Detail")).not.toBeInTheDocument();
  });

  test("renders manager fields when open", () => {
    renderManagerDialog();

    expect(screen.getByText("Manager Detail")).toBeInTheDocument();
    expect(screen.getByText("Carol Manager")).toBeInTheDocument();
    expect(screen.getByText("manager@example.com")).toBeInTheDocument();
    expect(screen.getByText("+44 7100000099")).toBeInTheDocument();
    expect(screen.getByText("Finance Staff")).toBeInTheDocument();
  });

  test("renders Approved status for user_status=1", () => {
    renderManagerDialog({ viewData: { ...baseManager, user_status: 1 } });
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });

  test("renders Pending status for user_status=0", () => {
    renderManagerDialog({ viewData: { ...baseManager, user_status: 0 } });
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  test("clicking Close button invokes handleDialogClose", async () => {
    const user = userEvent.setup();
    const handleDialogClose = jest.fn();

    renderManagerDialog({ handleDialogClose });

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(handleDialogClose).toHaveBeenCalledTimes(1);
  });

  test("renders Rejected status for user_status=2", () => {
    renderManagerDialog({ viewData: { ...baseManager, user_status: 2 } });
    expect(screen.getByText("Rejected")).toBeInTheDocument();
  });

  test("renders default chip colour when user_status is unknown", () => {
    renderManagerDialog({ viewData: { ...baseManager, user_status: 99 } });
    expect(screen.getByText("User Status:")).toBeInTheDocument();
  });

  test("renders blank time when time_created is missing", () => {
    renderManagerDialog({ viewData: { ...baseManager, time_created: "" } });
    expect(screen.getByText("Time Created:")).toBeInTheDocument();
  });

  test("clicking close icon invokes handleDialogClose", async () => {
    const user = userEvent.setup();
    const handleDialogClose = jest.fn();

    renderManagerDialog({ handleDialogClose });

    await user.click(screen.getByRole("button", { name: "close" }));
    expect(handleDialogClose).toHaveBeenCalledTimes(1);
  });
});
