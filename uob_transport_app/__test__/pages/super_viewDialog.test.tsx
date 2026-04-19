import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ViewDialog from "@/app/super/userManageComponents/viewDialog";
import type { UserRecord } from "@/model/models";

//const

const baseUser: UserRecord = {
  time_created: "2025-06-01T12:00:00.000Z",
  user_id: 42,
  department: { dep_id: 1, dep_name: "Computer Science" } as UserRecord["department"],
  email: "bob.myers@example.com",
  full_name: "Bob Myers",
  phone_number: "+441234567890",
  role: "normal_user",
  user_status: 1,
};

//rendering test

describe("Super-admin ViewDialog (user detail)", () => {
  test("does not render when dialogOpen is false", () => {
    render(
      <ViewDialog
        viewData={baseUser}
        dialogOpen={false}
        handleDialogClose={jest.fn()}
      />,
    );
    expect(screen.queryByText("User Detail")).not.toBeInTheDocument();
  });

  test("renders user fields when open", () => {
    render(
      <ViewDialog
        viewData={baseUser}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
      />,
    );

    expect(screen.getByText("User Detail")).toBeInTheDocument();
    expect(screen.getByText("Bob Myers")).toBeInTheDocument();
    expect(screen.getByText("bob.myers@example.com")).toBeInTheDocument();
    expect(screen.getByText("+441234567890")).toBeInTheDocument();
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
  });

  test("renders readable role label from role map", () => {
    render(
      <ViewDialog
        viewData={{ ...baseUser, role: "finance_staff" }}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
      />,
    );
    expect(screen.getByText("Finance Staff")).toBeInTheDocument();
  });

  test("renders Approved status chip for user_status=1", () => {
    render(
      <ViewDialog
        viewData={{ ...baseUser, user_status: 1 }}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
      />,
    );
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });

  test("renders Pending status chip for user_status=0", () => {
    render(
      <ViewDialog
        viewData={{ ...baseUser, user_status: 0 }}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
      />,
    );
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  test("renders Rejected status chip for user_status=2", () => {
    render(
      <ViewDialog
        viewData={{ ...baseUser, user_status: 2 }}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
      />,
    );
    expect(screen.getByText("Rejected")).toBeInTheDocument();
  });

  test("clicking Close button invokes handleDialogClose", async () => {
    const handleDialogClose = jest.fn();
    const user = userEvent.setup();

    render(
      <ViewDialog
        viewData={baseUser}
        dialogOpen={true}
        handleDialogClose={handleDialogClose}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(handleDialogClose).toHaveBeenCalledTimes(1);
  });

  test("clicking the close icon (X) invokes handleDialogClose", async () => {
    const handleDialogClose = jest.fn();
    const user = userEvent.setup();

    render(
      <ViewDialog
        viewData={baseUser}
        dialogOpen={true}
        handleDialogClose={handleDialogClose}
      />,
    );

    await user.click(screen.getByRole("button", { name: "close" }));
    expect(handleDialogClose).toHaveBeenCalledTimes(1);
  });

  test("renders empty time string when time_created is missing", () => {
    render(
      <ViewDialog
        viewData={{ ...baseUser, time_created: "" }}
        dialogOpen={true}
        handleDialogClose={jest.fn()}
      />,
    );
    expect(screen.getByText("Time Created:")).toBeInTheDocument();
  });
});
