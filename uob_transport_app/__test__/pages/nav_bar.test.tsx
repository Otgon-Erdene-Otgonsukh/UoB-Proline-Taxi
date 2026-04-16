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

//helper functions
const withSession = (name = "Alice") =>
  (useSession as jest.Mock).mockReturnValue({ data: { user: { name } } });
 
const withoutSession = () =>
  (useSession as jest.Mock).mockReturnValue({ data: null });

//assert correct href on every nav link
describe("Navbar – nav link href targets", () => {
  afterEach(() => jest.clearAllMocks());
 
  test.each([
    ["Home",      "/home"],
    ["Dashboard", "/dep-dashboard"],
    ["About",     "/about"],
    ["Help",      "/faq"],
  ])('"%s" link href is "%s"', (label, expectedHref) => {
    withoutSession();
    render(<Navbar />);
    const link = screen.getByText(label).closest("a");
    expect(link).toHaveAttribute("href", expectedHref);
  });
});

//company logo links to the root path
describe("Navbar – logo link", () => {
  afterEach(() => jest.clearAllMocks());
 
  test('the main company logo is wrapped in a link to "/"', () => {
    withoutSession();
    render(<Navbar />);
    // getAllByAltText because secondary partner logos share the same alt
    const [mainLogo] = screen.getAllByAltText("Company Logo");
    expect(mainLogo.closest("a")).toHaveAttribute("href", "/");
  });
});

//unauthnticated state
describe("Navbar – unauthenticated state", () => {
  afterEach(() => jest.clearAllMocks());
 
  test("no greeting text is rendered when there is no session", () => {
    withoutSession();
    render(<Navbar />);
    expect(screen.queryByText(/hi,/i)).not.toBeInTheDocument();
  });
 
  test("hamburger menu icon is absent when unauthenticated", () => {
    withoutSession();
    render(<Navbar />);
    expect(screen.queryByTestId("MenuIcon")).not.toBeInTheDocument();
  });
 
  test("ArrowDropDown icon is absent when unauthenticated", () => {
    withoutSession();
    render(<Navbar />);
    expect(screen.queryByTestId("ArrowDropDownIcon")).not.toBeInTheDocument();
  });
 
  test("login button is visible when unauthenticated", () => {
    withoutSession();
    render(<Navbar />);
    expect(screen.getByRole("button", { name: /login/i })).toBeVisible();
  });
});

//authenticated state
describe("Navbar – authenticated state – present elements", () => {
  afterEach(() => jest.clearAllMocks());
 
  test("login button is NOT rendered when a session exists", () => {
    withSession();
    render(<Navbar />);
    expect(screen.queryByRole("button", { name: /login/i })).not.toBeInTheDocument();
  });
 
  test("hamburger menu icon is present when authenticated", () => {
    withSession();
    render(<Navbar />);
    expect(screen.getByTestId("MenuIcon")).toBeInTheDocument();
  });
 
  test("ArrowDropDown icon is present inside the greeting button", () => {
    withSession();
    render(<Navbar />);
    expect(screen.getByTestId("ArrowDropDownIcon")).toBeInTheDocument();
  });
});