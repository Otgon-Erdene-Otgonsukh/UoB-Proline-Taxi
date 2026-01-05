import { Navbar } from "@/components/Navbar";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSession } from "next-auth/react";
import type { ReactNode } from "react";
import type { SignOutParams } from "next-auth/react";

// ---- mocks ----
// mock next/link
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: {
    href: string;
    children: ReactNode;
  }) => <a href={href}>{children}</a>,
}));

// mock next/navigation
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  usePathname: () => "/",
}));

// mock next-auth
const signOutMock = jest.fn();
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: (args: SignOutParams) => signOutMock(args),
}));

describe("Navbar", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders navigation links", () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });

    render(<Navbar />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Help")).toBeInTheDocument();
  });

  test("renders login button when user is not authenticated", () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });

    render(<Navbar />);

    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });

  test("clicking login button redirects to /login", () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });

    render(<Navbar />);

    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    expect(pushMock).toHaveBeenCalledWith("/login");
  });

  test("renders user menu when session exists", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: "Alice",
        },
      },
    });

    render(<Navbar />);

    expect(screen.getByText("Hi, Alice!")).toBeInTheDocument();
  });

  test("opens dropdown menu when clicking on welcome page", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: "Alice",
        },
      },
    });

    render(<Navbar />);

    fireEvent.click(screen.getByText("Hi, Alice!"));

    await waitFor(() => {
      expect(screen.getByText("Profile")).toBeInTheDocument();
      expect(screen.getByText("Logout")).toBeInTheDocument();
    });
  });

  test("opens sign-out confirmation dialog when clicking Logout", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: "Alice",
        },
      },
    });

    render(<Navbar />);

    fireEvent.click(screen.getByText("Hi, Alice!"));

    const logoutItem = await screen.findByText("Logout");
    fireEvent.click(logoutItem);

    expect(
      await screen.findByText("Sign out confirmation")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Are you sure you want to sign out?")
    ).toBeInTheDocument();
  });

  test("confirms sign out when clicking Yes", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: "Alice",
        },
      },
    });

    render(<Navbar />);

    fireEvent.click(screen.getByText("Hi, Alice!"));
    fireEvent.click(await screen.findByText("Logout"));
    fireEvent.click(await screen.findByRole("button", { name: "Yes" }));

    expect(signOutMock).toHaveBeenCalledWith({ callbackUrl: "/" });
  });
});
