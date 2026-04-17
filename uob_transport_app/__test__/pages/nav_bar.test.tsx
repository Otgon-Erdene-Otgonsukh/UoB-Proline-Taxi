import { Navbar } from "@/components/Navbar";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
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
const mockPathname = jest.fn() as jest.Mock;
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => mockPathname(),
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
          role: "finance_staff",
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
          role: "finance_staff",
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
          role: "finance_staff",
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
          role: "finance_staff",
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
  (useSession as jest.Mock).mockReturnValue({ data: { user: { name, role: "finance_staff" } } });
 
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
    withSession();
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

//first-name extractions
describe("Navbar – greeting: first-name extraction", () => {
  afterEach(() => jest.clearAllMocks());
 
  test("only the first word of a two-part name is shown", () => {
    withSession("Alice Smith");
    render(<Navbar />);
    expect(screen.getByText("Hi, Alice!")).toBeInTheDocument();
    expect(screen.queryByText("Hi, Alice Smith!")).not.toBeInTheDocument();
  });
 
  test("full name is shown when it contains no spaces", () => {
    withSession("Bob");
    render(<Navbar />);
    expect(screen.getByText("Hi, Bob!")).toBeInTheDocument();
  });
 
  test("only the first word of a three-part name is shown", () => {
    withSession("Jean-Paul Dupont III");
    render(<Navbar />);
    expect(screen.getByText("Hi, Jean-Paul!")).toBeInTheDocument();
  });
});

//desktop--profile
describe("Navbar – desktop dropdown: Profile item", () => {
  afterEach(() => jest.clearAllMocks());
  beforeEach(() => withSession());
 
  test("clicking Profile navigates to /profile", async () => {
    render(<Navbar />);
    fireEvent.click(screen.getByText("Hi, Alice!"));
    fireEvent.click(await screen.findByText("Profile"));
    expect(pushMock).toHaveBeenCalledWith("/profile");
  });
 
  test("clicking Profile closes the dropdown menu", async () => {
    render(<Navbar />);
    fireEvent.click(screen.getByText("Hi, Alice!"));
    await screen.findByText("Profile");
    fireEvent.click(screen.getByText("Profile"));
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });
 
  test("dropdown menu contains both Profile and Logout items", async () => {
    render(<Navbar />);
    fireEvent.click(screen.getByText("Hi, Alice!"));
    const menu = await screen.findByRole("menu");
    expect(within(menu).getByText("Profile")).toBeInTheDocument();
    expect(within(menu).getByText("Logout")).toBeInTheDocument();
  });
 
  test("avatar inside the dropdown shows the uppercased first letter of the user name", async () => {
    withSession("Charlie");
    render(<Navbar />);
    fireEvent.click(screen.getByText("Hi, Charlie!"));
    await screen.findByRole("menu");
    // The MUI Avatar renders session.user.name.charAt(0).toUpperCase()
    expect(screen.getByText("C")).toBeInTheDocument();
  });
});

//sign-out dialog
describe("Navbar – sign-out dialog: Cancel", () => {
  afterEach(() => jest.clearAllMocks());
  beforeEach(() => withSession());
 
  /** Opens the dialog and returns after it is visible. */
  const openDialog = async () => {
    render(<Navbar />);
    fireEvent.click(screen.getByText("Hi, Alice!"));
    fireEvent.click(await screen.findByText("Logout"));
    await screen.findByText("Sign out confirmation");
  };
 
  test("Cancel button closes the dialog", async () => {
    await openDialog();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => {
      expect(screen.queryByText("Sign out confirmation")).not.toBeInTheDocument();
    });
  });
 
  test("signOut is NOT called when Cancel is clicked", async () => {
    await openDialog();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(signOutMock).not.toHaveBeenCalled();
  });
 
  test("both Cancel and Yes buttons are present in the dialog", async () => {
    await openDialog();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Yes"    })).toBeInTheDocument();
  });
 
  test("dialog body contains the correct confirmation question", async () => {
    await openDialog();
    expect(
      screen.getByText("Are you sure you want to sign out?")
    ).toBeInTheDocument();
  });
});

describe("Navbar – sign-out dialog: confirm", () => {
  afterEach(() => jest.clearAllMocks());
  beforeEach(() => withSession());
 
  const clickYes = async () => {
    render(<Navbar />);
    fireEvent.click(screen.getByText("Hi, Alice!"));
    fireEvent.click(await screen.findByText("Logout"));
    await screen.findByText("Sign out confirmation");
    fireEvent.click(screen.getByRole("button", { name: "Yes" }));
  };
 
  test("signOut is called exactly once", async () => {
    await clickYes();
    expect(signOutMock).toHaveBeenCalledTimes(1);
  });
 
  test("signOut is called with callbackUrl: '/'", async () => {
    await clickYes();
    expect(signOutMock).toHaveBeenCalledWith({ callbackUrl: "/" });
  });
});

//hamburger menu
describe("Navbar – hamburger menu: item rendering", () => {
  afterEach(() => jest.clearAllMocks());
  beforeEach(() => withSession());
 
  const openHamburger = async () => {
    render(<Navbar />);
    fireEvent.click(screen.getByTestId("MenuIcon").closest("button")!);
    return screen.findByRole("menu");
  };
 
  test("all four page items appear in the hamburger menu", async () => {
    const menu = await openHamburger();
    expect(within(menu).getByText("Home"     )).toBeInTheDocument();
    expect(within(menu).getByText("Dashboard")).toBeInTheDocument();
    expect(within(menu).getByText("About"    )).toBeInTheDocument();
    expect(within(menu).getByText("Help"     )).toBeInTheDocument();
  });
 
  test("Profile item appears in the hamburger menu for authenticated users", async () => {
    const menu = await openHamburger();
    expect(within(menu).getByText("Profile")).toBeInTheDocument();
  });
 
  test("Logout item appears in the hamburger menu for authenticated users", async () => {
    const menu = await openHamburger();
    expect(within(menu).getByText("Logout")).toBeInTheDocument();
  });
});

describe("Navbar – hamburger menu: navigation", () => {
  afterEach(() => jest.clearAllMocks());
  beforeEach(() => withSession());
 
  test.each([
    ["Home",      "/home"          ],
    ["Dashboard", "/dep-dashboard" ],
    ["About",     "/about"         ],
    ["Help",      "/faq"           ],
  ])("clicking %s navigates to %s", async (label, expectedPath) => {
    render(<Navbar />);
    fireEvent.click(screen.getByTestId("MenuIcon").closest("button")!);
    const menu = await screen.findByRole("menu");
    fireEvent.click(within(menu).getByText(label));
    expect(pushMock).toHaveBeenCalledWith(expectedPath);
  });
 
  test("clicking a page item closes the hamburger menu", async () => {
    render(<Navbar />);
    fireEvent.click(screen.getByTestId("MenuIcon").closest("button")!);
    const menu = await screen.findByRole("menu");
    fireEvent.click(within(menu).getByText("Home"));
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });
});

describe("Navbar – hamburger menu: Logout item", () => {
  afterEach(() => jest.clearAllMocks());
  beforeEach(() => withSession());
 
  test("clicking Logout in the hamburger menu opens the sign-out dialog", async () => {
    render(<Navbar />);
    fireEvent.click(screen.getByTestId("MenuIcon").closest("button")!);
    const menu = await screen.findByRole("menu");
    fireEvent.click(within(menu).getByText("Logout"));
    expect(await screen.findByText("Sign out confirmation")).toBeInTheDocument();
  });
 
  test("clicking Logout in the hamburger menu closes the hamburger menu", async () => {
    render(<Navbar />);
    fireEvent.click(screen.getByTestId("MenuIcon").closest("button")!);
    const menu = await screen.findByRole("menu");
    fireEvent.click(within(menu).getByText("Logout"));
    await screen.findByText("Sign out confirmation");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
 
  test("confirming from hamburger-triggered dialog calls signOut", async () => {
    render(<Navbar />);
    fireEvent.click(screen.getByTestId("MenuIcon").closest("button")!);
    const menu = await screen.findByRole("menu");
    fireEvent.click(within(menu).getByText("Logout"));
    await screen.findByText("Sign out confirmation");
    fireEvent.click(screen.getByRole("button", { name: "Yes" }));
    expect(signOutMock).toHaveBeenCalledWith({ callbackUrl: "/" });
  });
});

//active link underline class
describe("Navbar – active link underline", () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockPathname.mockReturnValue("/");
  });
 
  test("active page link span has the w-full class", () => {
    mockPathname.mockReturnValue("/home");
    withoutSession();
    render(<Navbar />);
    const span = screen.getByText("Home").closest("a")!.querySelector("span");
    expect(span).toHaveClass("w-full");
  });
 
  test("inactive page link span has the w-0 class", () => {
    mockPathname.mockReturnValue("/home");
    withoutSession();
    render(<Navbar />);
    const span = screen.getByText("Dashboard").closest("a")!.querySelector("span");
    expect(span).toHaveClass("w-0");
    expect(span).not.toHaveClass("w-full");
  });
 
  test("no link is marked active when the path matches none of the pages", () => {
    mockPathname.mockReturnValue("/some-unknown-page");
    withoutSession();
    render(<Navbar />);
    ["Home", "Dashboard", "About", "Help"].forEach((label) => {
      const span = screen.getByText(label).closest("a")!.querySelector("span");
      expect(span).toHaveClass("w-0");
      expect(span).not.toHaveClass("w-full");
    });
  });
 
  test.each([
    ["/home",          "Home"     ],
    ["/dep-dashboard", "Dashboard"],
    ["/about",         "About"    ],
    ["/faq",           "Help"     ],
  ])("path %s marks only the %s link as active", (path, activeLabel) => {
    mockPathname.mockReturnValue(path);
    withoutSession();
    const { unmount } = render(<Navbar />);
 
    const activeSpan = screen.getByText(activeLabel).closest("a")!.querySelector("span");
    expect(activeSpan).toHaveClass("w-full");
 
    ["Home", "Dashboard", "About", "Help"]
      .filter((l) => l !== activeLabel)
      .forEach((label) => {
        const span = screen.getByText(label).closest("a")!.querySelector("span");
        expect(span).toHaveClass("w-0");
      });
 
    unmount();
    jest.clearAllMocks();
  });
});