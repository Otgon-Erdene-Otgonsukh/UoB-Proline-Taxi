import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Page from "@/app/super/page";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { getUsersAsAdmin } from "@/app/super/request";
import { getDepartmentsList } from "@/app/super/requests";

// ========== mocks ==========

// next/navigation
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

// request layer
jest.mock("@/app/super/request", () => ({
  getUsersAsAdmin: jest.fn(),
  updateUserAsAdmin: jest.fn(),
}));

jest.mock("@/app/super/requests", () => ({
  getDepartmentsList: jest.fn(),
}));

// dialogs (only cares about if opened or not rather than the inner implementation)
jest.mock("@/app/super/userManageComponents/viewDialog", () => {
  return function MockViewDialog({ dialogOpen }: { dialogOpen: boolean }) {
    return dialogOpen ? <div>View Dialog</div> : null;
  };
});

jest.mock("@/app/super/userManageComponents/eidtDialog", () => {
  return function MockEditDialog({ dialogOpen }: { dialogOpen: boolean }) {
    return dialogOpen ? <div>Edit Dialog</div> : null;
  };
});

jest.mock("@/components/confirmDIalog", () => {
  return function MockConfirmDialog({
    open,
    dialogTitle,
  }: {
    open: boolean;
    dialogTitle: string;
  }) {
    return open ? <div>{dialogTitle}</div> : null;
  };
});

// ========== mock data ==========

const mockSession: Session = {
  user: {
    name: "Admin",
    email: "admin@test.com",
    surname: "User",
    username: "adminuser",
    user_id: 6,
    phone_number: "0123456789",
    department: null,
    account_type: "superUser",
  },
  expires: "2099-01-01",
};

const mockUsers = [
  {
    user_id: 1,
    time_created: new Date().toISOString(),
    name: "John",
    surname: "Doe",
    email: "john@test.com",
    phone_number: "12345678",
    department: { dep_name: "IT" },
    role: "normalUser",
    user_status: 0, // pending
  },
];

// ========== tests ==========

describe("User Management Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("redirects to login when unauthenticated", async () => {
    (useSession as jest.Mock).mockReturnValue({ status: "unauthenticated" });

    render(<Page />);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/login");
    });
  });

  test("renders loading state initially", async () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: mockSession,
    });

    (getUsersAsAdmin as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({ userList: [], userCount: 0 }),
    });

    (getDepartmentsList as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => [],
    });

    render(<Page />);

    expect(
      screen.getByText("Getting user data...")
    ).toBeInTheDocument();
  });

  test("renders user table when pending user data is returned", async () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: mockSession,
    });

    (getUsersAsAdmin as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({
        userList: mockUsers,
        userCount: 1,
      }),
    });

    (getDepartmentsList as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => [],
    });

    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText("User Management")).toBeInTheDocument();
    });

    // table content
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@test.com")).toBeInTheDocument();
    expect(screen.getByText("IT")).toBeInTheDocument();

    // operation buttons
    expect(screen.getByText("View")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Accept")).toBeInTheDocument();
    expect(screen.getByText("Reject")).toBeInTheDocument();
  });

  test("renders user table when normal user data is returned", async () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: mockSession,
    });

    (getUsersAsAdmin as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({
        userList: mockUsers.map((user) => { user.user_status = 1; return user; }), // approved
        userCount: 1,
      }),
    });

    (getDepartmentsList as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => [],
    });

    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText("User Management")).toBeInTheDocument();
    });

    // table content
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@test.com")).toBeInTheDocument();
    expect(screen.getByText("IT")).toBeInTheDocument();

    // operation buttons
    expect(screen.getByText("View")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.queryByText("Accept")).toBeNull();
    expect(screen.queryByText("Reject")).toBeNull();
  });

  test("opens view dialog when clicking View", async () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: mockSession,
    });

    (getUsersAsAdmin as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({
        userList: mockUsers,
        userCount: 1,
      }),
    });

    (getDepartmentsList as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => [],
    });

    render(<Page />);

    const viewButton = await screen.findByText("View");
    fireEvent.click(viewButton);

    expect(screen.getByText("View Dialog")).toBeInTheDocument();
  });

  test("opens edit dialog when clicking Edit", async () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: mockSession,
    });

    (getUsersAsAdmin as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({
        userList: mockUsers,
        userCount: 1,
      }),
    });

    (getDepartmentsList as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => [],
    });

    render(<Page />);

    const editButton = await screen.findByText("Edit");
    fireEvent.click(editButton);

    expect(screen.getByText("Edit Dialog")).toBeInTheDocument();
  });

  test("opens confirm dialog when clicking Accept", async () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: mockSession,
    });

    (getUsersAsAdmin as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({
        userList: mockUsers.map((user) => { user.user_status = 0; return user; }), // pending
        userCount: 1,
      }),
    });

    (getDepartmentsList as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => [],
    });

    render(<Page />);

    const acceptButton = await screen.findByText("Accept");
    fireEvent.click(acceptButton);

    expect(
      screen.getByText("Accept User Registeration")
    ).toBeInTheDocument();
  });

});
