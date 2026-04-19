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
  ChangeDepartmentDialog: ({ dialogOpen }: { dialogOpen: boolean }) =>
    dialogOpen ? <div data-testid="change-dep-dialog" /> : null,
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

function renderDialog(overrides: Partial<{
  dialogOpen: boolean;
  handleDialogClose: () => void;
  notifyUserCountChange: jest.Mock;
  notifyDepartmentNameChange: jest.Mock;
}> = {}) {
  const handleDialogClose = overrides.handleDialogClose ?? jest.fn();
  const notifyUserCountChange = overrides.notifyUserCountChange ?? jest.fn();
  const notifyDepartmentNameChange =
    overrides.notifyDepartmentNameChange ?? jest.fn();

  render(
    <ViewDepartmentDialog
      departmentList={departmentList}
      viewData={viewData}
      dialogOpen={overrides.dialogOpen ?? true}
      handleDialogClose={handleDialogClose}
      notifyUserCountChange={notifyUserCountChange}
      notifyDepartmentNameChange={notifyDepartmentNameChange}
    />,
  );

  return { handleDialogClose, notifyUserCountChange, notifyDepartmentNameChange };
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
});
