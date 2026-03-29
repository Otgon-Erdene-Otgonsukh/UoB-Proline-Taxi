import "@testing-library/jest-dom";
import { screen, render, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Register from "@/app/register/page";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockRedirect = jest.fn();
jest.mock("next/navigation", () => ({
  redirect: jest.fn().mockImplementation((...args) => mockRedirect(...args)),
}));

const mockUseSession = jest.fn();
jest.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
}));

jest.mock("@/app/requests/departments", () => ({
  getDepartments: jest.fn(() =>
    Promise.resolve({
      status: 200,
      json: () =>
        Promise.resolve([
          { dep_id: 1, dep_name: "Law" },
          { dep_id: 2, dep_name: "Engineering" },
          { dep_id: 3, dep_name: "Medicine" },
        ]),
    })
  ),
}));

global.fetch = jest.fn();

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the inner <input> for the Nth data-testid="textfield" wrapper. */
const getInput = (index: number): HTMLInputElement => {
  const wrappers = screen.getAllByTestId("textfield");
  const input = wrappers[index].querySelector("input");
  if (!input) throw new Error(`No <input> found inside textfield[${index}]`);
  return input as HTMLInputElement;
};

/** Fills every required field and selects a role card. */
const fillValidForm = async (
  user: ReturnType<typeof userEvent.setup>,
  opts: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    password?: string;
    role?: "Normal User" | "Finance Staff" | "Proline Staff";
  } = {}
) => {
  const {
    firstName = "John",
    lastName = "Doe",
    phone = "1234567890",
    email = "john@test.com",
    password = "password123",
    role = "Normal User",
  } = opts;

  await user.clear(getInput(0));
  await user.type(getInput(0), firstName);
  await user.clear(getInput(1));
  await user.type(getInput(1), lastName);
  await user.clear(getInput(2));
  await user.type(getInput(2), phone);
  await user.clear(getInput(4));
  await user.type(getInput(4), email);
  await user.clear(getInput(5));
  await user.type(getInput(5), password);

  await user.click(screen.getByText(role));
};

// ─── Test suites ─────────────────────────────────────────────────────────────

describe("Register page — session redirect", () => {
  test("redirects to /home when a session already exists", () => {
    mockUseSession.mockReturnValue({ data: { user: "test" } });
    render(<Register />);
    expect(mockRedirect).toHaveBeenCalledWith("/home");
  });
});

describe("Register page — rendering", () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({ data: null });
    render(<Register />);
  });

  test("renders six text fields and eight phone-code options", async () => {
    const textFields = await screen.findAllByTestId("textfield");
    expect(textFields.length).toBe(6);

    const options = screen.getAllByRole("option");
    expect(options.length).toBe(8);
  });

  test("renders the logo image", () => {
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  test("renders two level-1 headings", () => {
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(2);
  });

  test("renders three role cards", () => {
    const cards = screen.getAllByTestId("card");
    expect(cards.length).toBe(3);
    cards.forEach((card) => expect(card).toBeInTheDocument());
  });

  test("renders the submit button with correct label", () => {
    expect(screen.getByTestId("submit-button")).toHaveTextContent("Sign up");
  });

  test("renders a link to the login page", () => {
    const loginLink = screen.getByRole("link", { name: /log in/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  test("renders all three role labels", () => {
    expect(screen.getByText("Normal User")).toBeInTheDocument();
    expect(screen.getByText("Finance Staff")).toBeInTheDocument();
    expect(screen.getByText("Proline Staff")).toBeInTheDocument();
  });

  test("password field is hidden by default", () => {
    // The MUI password input has type="password"
    const passwordInput = screen
      .getAllByTestId("textfield")
      .map((el) => el.querySelector("input"))
      .find((input) => input?.getAttribute("type") === "password");

    expect(passwordInput).toBeTruthy();
  });

  test("password visibility toggle changes input type", async () => {
    const user = userEvent.setup();
    const visibilityToggle = screen.getByTestId("VisibilityIcon").closest("button")!;
    const passwordInput = getInput(5);

    expect(passwordInput.type).toBe("password");
    await user.click(visibilityToggle);
    expect(passwordInput.type).toBe("text");

    await user.click(visibilityToggle);
    expect(passwordInput.type).toBe("password");
  });

  test("no check icons are visible before any role is selected", () => {
    expect(screen.queryByTestId("normal-check-icon")).toBeNull();
    expect(screen.queryByTestId("finance-check-icon")).toBeNull();
    expect(screen.queryByTestId("proline-check-icon")).toBeNull();
  });

  test("phone-code select defaults to +44 (UK)", () => {
    const nativeSelect = document.querySelector("select") as HTMLSelectElement;
    expect(nativeSelect?.value).toBe("+44");
  });
});

// ─── Role selection ───────────────────────────────────────────────────────────

describe("Register page — role selection", () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({ data: null });
    render(<Register />);
  });

  test("clicking Normal User shows its check icon", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText("Normal User"));
    expect(await screen.findByTestId("normal-check-icon")).toBeInTheDocument();
  });

  test("clicking Finance Staff shows its check icon", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText("Finance Staff"));
    expect(await screen.findByTestId("finance-check-icon")).toBeInTheDocument();
  });

  test("clicking Proline Staff shows its check icon", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText("Proline Staff"));
    expect(await screen.findByTestId("proline-check-icon")).toBeInTheDocument();
  });

  test("only one role can be active at a time", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText("Normal User"));
    await user.click(screen.getByText("Finance Staff"));
    await user.click(screen.getByText("Proline Staff"));

    await waitFor(() => {
      expect(screen.queryByTestId("normal-check-icon")).toBeNull();
      expect(screen.queryByTestId("finance-check-icon")).toBeNull();
      expect(screen.getByTestId("proline-check-icon")).toBeInTheDocument();
    });
  });

  test("clicking an active role deselects it (toggle off)", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText("Normal User"));
    expect(await screen.findByTestId("normal-check-icon")).toBeInTheDocument();

    await user.click(screen.getByText("Normal User"));
    await waitFor(() => {
      expect(screen.queryByTestId("normal-check-icon")).toBeNull();
    });
  });

  test("selecting Proline Staff disables the Department field", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText("Proline Staff"));

    // The Autocomplete becomes disabled — its input should have disabled attribute
    const deptInput = screen.getAllByTestId("textfield")[3].querySelector("input");
    await waitFor(() => expect(deptInput).toBeDisabled());
  });

  test("switching away from Proline Staff re-enables the Department field", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText("Proline Staff"));
    await user.click(screen.getByText("Normal User"));

    const deptInput = screen.getAllByTestId("textfield")[3].querySelector("input");
    await waitFor(() => expect(deptInput).not.toBeDisabled());
  });
});

// ─── Validation errors ────────────────────────────────────────────────────────

describe("Register page — validation on empty submit", () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({ data: null });
    render(<Register />);
  });

  test("shows 'Account type must be selected' when no role is chosen", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("submit-button"));
    expect(await screen.findByText(/account type must be selected/i)).toBeInTheDocument();
  });

  test("shows empty-field errors when form is submitted blank", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByText(/please enter name/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter last name/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter phone number/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter an email/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter a password/i)).toBeInTheDocument();
    });
  });

  test("shows password length error for a too-short password", async () => {
    const user = userEvent.setup();
    await user.type(getInput(5), "abc"); // < 5 chars
    await user.click(screen.getByText("Normal User"));
    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByText(/enter a valid password/i)).toBeInTheDocument();
    });
  });

  test("shows email empty error when email field is left blank", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText("Normal User"));
    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByText(/please enter an email/i)).toBeInTheDocument();
    });
  });

  test("shows university email error for Finance Staff with a non-bristol email", async () => {
    const user = userEvent.setup();
    await user.type(getInput(4), "john@gmail.com");
    await user.click(screen.getByText("Finance Staff"));
    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByText(/enter a valid university email/i)).toBeInTheDocument();
    });
  });

  test("shows company email error for Proline Staff with a non-proline email", async () => {
    const user = userEvent.setup();
    await user.type(getInput(4), "john@gmail.com");
    await user.click(screen.getByText("Proline Staff"));
    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByText(/enter a valid company email/i)).toBeInTheDocument();
    });
  });

  test("shows department error for Normal User without a department selected", async () => {
    const user = userEvent.setup();
    await user.type(getInput(0), "John");
    await user.type(getInput(1), "Doe");
    await user.type(getInput(2), "1234567890");
    await user.type(getInput(4), "john@test.com");
    await user.type(getInput(5), "password123");
    await user.click(screen.getByText("Normal User"));
    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByText(/select a department/i)).toBeInTheDocument();
    });
  });
});

// ─── Inline error clearing ────────────────────────────────────────────────────

describe("Register page — errors clear on user input", () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({ data: null });
    render(<Register />);
  });

  test("email error clears when the user starts typing again", async () => {
    const user = userEvent.setup();

    // Trigger the error
    await user.click(screen.getByTestId("submit-button"));
    expect(await screen.findByText(/please enter an email/i)).toBeInTheDocument();

    // Start typing — error should vanish
    await user.type(getInput(4), "a");
    await waitFor(() => {
      expect(screen.queryByText(/please enter an email/i)).toBeNull();
    });
  });

  test("password error clears when the user starts typing again", async () => {
    const user = userEvent.setup();

    await user.click(screen.getByTestId("submit-button"));
    expect(await screen.findByText(/please enter a password/i)).toBeInTheDocument();

    await user.type(getInput(5), "a");
    await waitFor(() => {
      expect(screen.queryByText(/please enter a password/i)).toBeNull();
    });
  });

  test("role error clears when a role is selected", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("submit-button"));
    expect(await screen.findByText(/account type must be selected/i)).toBeInTheDocument();

    await user.click(screen.getByText("Normal User"));
    await waitFor(() => {
      expect(screen.queryByText(/account type must be selected/i)).toBeNull();
    });
  });
});

// ─── Form submission ──────────────────────────────────────────────────────────

describe("Register page — form submission", () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({ data: null });
    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ status: 200 }),
    });
    render(<Register />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("submit button shows loading indicator after a valid submission", async () => {
    const user = userEvent.setup();
    // Use Proline Staff — no department required, simplest valid submission
    await fillValidForm(user, {
      email: "driver@prolinetaxi.com",
      role: "Proline Staff",
    });

    const button = screen.getByTestId("submit-button");
    await user.click(button);

    await waitFor(() => {
      expect(button).not.toHaveTextContent("Sign up");
    });
  });

  test("fetch is called with correct body for Normal User", async () => {
    const user = userEvent.setup();
    await fillValidForm(user, { email: "john@test.com", role: "Normal User" });

    // Normal User requires a department — select one via the Autocomplete
    const deptInput = getInput(3);
    await user.click(deptInput);
    await user.type(deptInput, "Law");
    const option = await screen.findByRole("option", { name: "Law" });
    await user.click(option);

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe("api/create_user");
    expect(options.method).toBe("POST");

    const body = JSON.parse(options.body);
    expect(body.role).toBe("normal_user");
    expect(body.mail).toBe("john@test.com");
  });

  test("fetch is called with role 'finance_staff' for Finance Staff", async () => {
    const user = userEvent.setup();
    await fillValidForm(user, {
      email: "jane@bristol.ac.uk",
      role: "Finance Staff",
    });

    // Finance Staff requires a department — type to open the dropdown and pick one
    const deptInput = getInput(3);
    await user.click(deptInput);
    await user.type(deptInput, "Law");
    const option = await screen.findByRole("option", { name: "Law" });
    await user.click(option);

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
    expect(body.role).toBe("finance_staff");
  });

  test("fetch is called with role 'proline_staff' for Proline Staff", async () => {
    const user = userEvent.setup();
    await fillValidForm(user, {
      email: "jane@prolinetaxi.com",
      role: "Proline Staff",
    });

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
    expect(body.role).toBe("proline_staff");
  });

  test("phone number is submitted with the selected country code", async () => {
    const user = userEvent.setup();

    await user.type(getInput(0), "John");
    await user.type(getInput(1), "Doe");

    // Change country code to +1
    const nativeSelect = document.querySelector("select") as HTMLSelectElement;
    await userEvent.selectOptions(nativeSelect, "+1");

    await user.type(getInput(2), "9876543210");
    // Proline Staff requires no department, so validation passes without it
    await user.type(getInput(4), "john@prolinetaxi.com");
    await user.type(getInput(5), "password123");
    await user.click(screen.getByText("Proline Staff"));
    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
    expect(body.phoneNumber).toContain("+1");
    expect(body.phoneNumber).toContain("9876543210");
  });

  test("shows error snackbar when API returns a non-200 status", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ status: 500 }),
    });

    const user = userEvent.setup();
    // Proline Staff requires no department, so validation passes without it
    await fillValidForm(user, {
      email: "driver@prolinetaxi.com",
      role: "Proline Staff",
    });
    await user.click(screen.getByTestId("submit-button"));

    expect(await screen.findByText(/failed to create an account/i)).toBeInTheDocument();
  });

  test("fetch is NOT called when the form has validation errors", async () => {
    const user = userEvent.setup();
    // Submit completely empty form
    await user.click(screen.getByTestId("submit-button"));
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

// ─── Email domain validation (edge cases) ────────────────────────────────────

describe("Register page — email domain rules", () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({ data: null });
    render(<Register />);
  });

  test("Finance Staff accepts a valid @bristol.ac.uk email", async () => {
    const user = userEvent.setup();
    await user.type(getInput(4), "staff@bristol.ac.uk");
    await user.click(screen.getByText("Finance Staff"));
    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.queryByText(/enter a valid university email/i)).toBeNull();
    });
  });

  test("Proline Staff accepts a valid @prolinetaxi.com email", async () => {
    const user = userEvent.setup();
    await user.type(getInput(4), "driver@prolinetaxi.com");
    await user.click(screen.getByText("Proline Staff"));
    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.queryByText(/enter a valid company email/i)).toBeNull();
    });
  });
});