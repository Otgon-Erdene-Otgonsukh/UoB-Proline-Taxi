import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ViewDepartmentDialog from "@/app/super/departmentManageComponents/viewDepartmentDialog";
import { getUsersByDepId, updateDepartmentName } from "@/app/super/request";
import type { DepartmentRecord } from "@/model/models";

jest.mock("@/app/super/request", () => ({
  getUsersByDepId: jest.fn(),
  updateDepartmentName: jest.fn(),
}));

jest.mock("@/app/super/departmentManageComponents/changeDepartmentDialog", () => ({
  ChangeDepartmentDialog: ({
    dialogOpen,
    handleDialogClose,
  }: {
    dialogOpen: boolean;
    handleDialogClose: (isSucceed: boolean, chosenDepId?: number) => void;
  }) =>
    dialogOpen ? (
      <div data-testid="change-dep-dialog">
        <button onClick={() => handleDialogClose(true, 2)}>
          close-dep-success
        </button>
        <button onClick={() => handleDialogClose(false)}>
          close-dep-cancel
        </button>
      </div>
    ) : null,
}));

const departmentList = [
  { depId: 1, depName: "Computer Science" },
  { depId: 2, depName: "Mathematics" },
];

const viewData: DepartmentRecord = {
  depId: 1,
  depName: "Computer Science",
  userCount: 2,
};

const members = [
  {
    user_id: 10,
    full_name: "Alice Smith",
    email: "alice@example.com",
    phone_number: "+44 7100000001",
    role: "normal_user",
  },
  {
    user_id: 11,
    full_name: "Bob Myers",
    email: "bob@example.com",
    phone_number: "+44 7100000002",
    role: "finance_staff",
  },
];

type ViewDepartmentDialogTestProps = Omit<
  React.ComponentProps<typeof ViewDepartmentDialog>,
  "normalClose"
> & {
  normalClose?: () => void;
};

const TestViewDepartmentDialog =
  ViewDepartmentDialog as React.ComponentType<ViewDepartmentDialogTestProps>;

function renderDialog(overrides: Partial<ViewDepartmentDialogTestProps> = {}) {
  const handleDialogClose = overrides.handleDialogClose ?? jest.fn();
  const normalClose = overrides.normalClose ?? handleDialogClose;
  const notifyUserCountChange = overrides.notifyUserCountChange ?? jest.fn();
  const notifyDepartmentNameChange =
    overrides.notifyDepartmentNameChange ?? jest.fn();

  render(
    <TestViewDepartmentDialog
      departmentList={departmentList}
      viewData={viewData}
      dialogOpen={overrides.dialogOpen ?? true}
      handleDialogClose={handleDialogClose}
      normalClose={normalClose}
      notifyUserCountChange={notifyUserCountChange}
      notifyDepartmentNameChange={notifyDepartmentNameChange}
    />,
  );

  return {
    handleDialogClose,
    normalClose,
    notifyUserCountChange,
    notifyDepartmentNameChange,
  };
}

describe("Super-admin ViewDepartmentDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getUsersByDepId as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => members,
    });
  });

  test("does not render when dialogOpen is false", () => {
    renderDialog({ dialogOpen: false });
    expect(screen.queryByText("Department Detail")).not.toBeInTheDocument();
  });

  test("renders department name and member table after fetch", async () => {
    renderDialog();

    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );
    expect(screen.getByText("Bob Myers")).toBeInTheDocument();
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    expect(screen.getByText("Members (Total 2):")).toBeInTheDocument();
  });

  test("renders empty state when no users in department", async () => {
    (getUsersByDepId as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => [],
    });
    renderDialog();

    await waitFor(() =>
      expect(screen.getByText("No users to show.")).toBeInTheDocument(),
    );
  });

  test("shows loading message before fetch resolves", () => {
    let resolveFn: (v: unknown) => void;
    (getUsersByDepId as jest.Mock).mockReturnValue(
      new Promise((r) => {
        resolveFn = r;
      }),
    );
    renderDialog();

    expect(screen.getByText("Loading members...")).toBeInTheDocument();

    // resolve to avoid an unhandled promise warning
    resolveFn!({ status: 200, json: async () => [] });
  });

  test("clicking Close button invokes handleDialogClose", async () => {
    const user = userEvent.setup();
    const { handleDialogClose } = renderDialog();

    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(handleDialogClose).toHaveBeenCalledTimes(1);
  });

  test("selecting rows toggles the change-department toolbar button", async () => {
    const user = userEvent.setup();
    renderDialog();

    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    expect(screen.queryByText("Change Department")).not.toBeInTheDocument();

    const aliceRow = screen.getByText("Alice Smith").closest("tr")!;
    await user.click(aliceRow);

    expect(screen.getByText("Change Department")).toBeInTheDocument();
    expect(screen.getByText("Selected 1 out of 2:")).toBeInTheDocument();
  });

  test("select-all checkbox selects every member", async () => {
    const user = userEvent.setup();
    renderDialog();

    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    const selectAll = screen.getByRole("checkbox", {
      name: "select all desserts",
    });
    await user.click(selectAll);
    expect(screen.getByText("Selected 2 out of 2:")).toBeInTheDocument();
  });

  test("clicking a selected row de-selects it", async () => {
    const user = userEvent.setup();
    renderDialog();

    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    const aliceRow = screen.getByText("Alice Smith").closest("tr")!;
    await user.click(aliceRow);
    expect(screen.getByText("Selected 1 out of 2:")).toBeInTheDocument();

    await user.click(aliceRow);
    expect(screen.queryByText("Selected 1 out of 2:")).not.toBeInTheDocument();
    expect(screen.getByText("Members (Total 2):")).toBeInTheDocument();
  });

  test("successful department name update shows success snackbar", async () => {
    const user = userEvent.setup();
    (updateDepartmentName as jest.Mock).mockResolvedValue({ status: 200 });

    const { notifyDepartmentNameChange } = renderDialog();

    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    // Click the edit icon next to the department name
    const depNameBlock = screen.getByText("Computer Science").closest("p")!;
    const editIcon = depNameBlock.querySelector("svg")!;
    await user.click(editIcon);

    // SingleInputDialog opens — change text and confirm
    const input = await screen.findByLabelText("Department Name");
    await user.clear(input);
    await user.type(input, "New CS Dept");

    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(updateDepartmentName).toHaveBeenCalledWith(1, "New CS Dept");
    });
    await waitFor(() => {
      expect(
        screen.getByText("Department name updated successfully!"),
      ).toBeInTheDocument();
    });
    expect(notifyDepartmentNameChange).toHaveBeenCalledWith(1, "New CS Dept");
  });

  test("department name update network error shows generic error snackbar", async () => {
    const user = userEvent.setup();
    (updateDepartmentName as jest.Mock).mockRejectedValue(new Error("boom"));

    renderDialog();

    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    const depNameBlock = screen.getByText("Computer Science").closest("p")!;
    const editIcon = depNameBlock.querySelector("svg")!;
    await user.click(editIcon);

    const input = await screen.findByLabelText("Department Name");
    await user.clear(input);
    await user.type(input, "Other");

    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(
        screen.getByText(
          "An error occurred while updating the department name.",
        ),
      ).toBeInTheDocument();
    });
  });

  test("select-all then deselect via checkbox clears selection", async () => {
    const user = userEvent.setup();
    renderDialog();

    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    const selectAll = screen.getByRole("checkbox", {
      name: "select all desserts",
    });
    await user.click(selectAll);
    expect(screen.getByText("Selected 2 out of 2:")).toBeInTheDocument();

    await user.click(selectAll);
    expect(screen.getByText("Members (Total 2):")).toBeInTheDocument();
  });

  test("clicking middle row deselects it while keeping others", async () => {
    const extendedMembers = [
      ...members,
      {
        user_id: 12,
        full_name: "Carol Dee",
        email: "carol@example.com",
        phone_number: "+44 7100000003",
        role: "normal_user",
      },
    ];
    (getUsersByDepId as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => extendedMembers,
    });

    const user = userEvent.setup();
    renderDialog();

    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    // Select all 3 then click middle row to deselect
    const selectAll = screen.getByRole("checkbox", {
      name: "select all desserts",
    });
    await user.click(selectAll);
    expect(screen.getByText(/Selected 3 out of/)).toBeInTheDocument();

    const bobRow = screen.getByText("Bob Myers").closest("tr")!;
    await user.click(bobRow);
    expect(screen.getByText(/Selected 2 out of/)).toBeInTheDocument();
  });

  test("change-department dialog success updates user count and shows snackbar", async () => {
    const user = userEvent.setup();
    const { notifyUserCountChange } = renderDialog();

    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    const aliceRow = screen.getByText("Alice Smith").closest("tr")!;
    await user.click(aliceRow);
    await user.click(
      screen.getByRole("button", { name: /Change Department/ }),
    );

    expect(screen.getByTestId("change-dep-dialog")).toBeInTheDocument();
    await user.click(screen.getByText("close-dep-success"));

    await waitFor(() =>
      expect(
        screen.getByText("Department changed successfully!"),
      ).toBeInTheDocument(),
    );
    expect(notifyUserCountChange).toHaveBeenCalledWith(1, 2, 1);
  });

  test("change-department cancel just closes the dialog", async () => {
    const user = userEvent.setup();
    const { notifyUserCountChange } = renderDialog();

    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    const aliceRow = screen.getByText("Alice Smith").closest("tr")!;
    await user.click(aliceRow);
    await user.click(
      screen.getByRole("button", { name: /Change Department/ }),
    );
    await user.click(screen.getByText("close-dep-cancel"));

    await waitFor(() =>
      expect(
        screen.queryByTestId("change-dep-dialog"),
      ).not.toBeInTheDocument(),
    );
    expect(notifyUserCountChange).not.toHaveBeenCalled();
  });

  test("deselecting the last-selected row keeps earlier selections", async () => {
    const user = userEvent.setup();
    renderDialog();

    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    const aliceRow = screen.getByText("Alice Smith").closest("tr")!;
    const bobRow = screen.getByText("Bob Myers").closest("tr")!;

    await user.click(aliceRow);
    await user.click(bobRow);
    expect(screen.getByText("Selected 2 out of 2:")).toBeInTheDocument();

    await user.click(bobRow);
    expect(screen.getByText("Selected 1 out of 2:")).toBeInTheDocument();
  });

  test("failed department name update shows server error message", async () => {
    const user = userEvent.setup();
    (updateDepartmentName as jest.Mock).mockResolvedValue({
      status: 400,
      json: async () => ({ message: "Name already taken" }),
    });

    renderDialog();

    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    const depNameBlock = screen.getByText("Computer Science").closest("p")!;
    const editIcon = depNameBlock.querySelector("svg")!;
    await user.click(editIcon);

    const input = await screen.findByLabelText("Department Name");
    await user.clear(input);
    await user.type(input, "Dup");

    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(screen.getByText("Name already taken")).toBeInTheDocument();
    });
  });
});
