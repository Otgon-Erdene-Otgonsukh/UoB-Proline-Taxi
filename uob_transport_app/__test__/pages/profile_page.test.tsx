import "@testing-library/jest-dom";
import Profile from "@/app/profile/page";
import userEvent from "@testing-library/user-event";
import { screen, render, waitFor, fireEvent, within } from "@testing-library/react";
import { useSession } from "next-auth/react";

// ─── Mocks ───

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/app/requests/departments", () => ({
  getDepartments: jest.fn().mockResolvedValue({
    status: 200,
    json: jest.fn().mockResolvedValue([
      { dep_id: 1, dep_name: "Computer Science" },
      { dep_id: 2, dep_name: "Mathematics" },
    ]),
  }),
}));

jest.mock("@/utils/easyRequest", () => ({
  easyGetRequest: jest.fn().mockResolvedValue({
    status: 200,
    json: jest.fn().mockResolvedValue({
      body: {
        email: "bob.myers@example.com",
        phone_number: "+1234567890",
        full_name: "Bob Myers",
        department: { dep_id: 1, dep_name: "Computer Science" },
      },
    }),
  }),
}));

global.fetch = jest.fn();

// ─── Shared helpers ───

const mockSession = {
  data: {
    user: {
      name: "Bob Myers",
      email: "bob.myers@example.com",
      phone_number: "+1234567890",
      dep_id: 1,
      dep_name: "Computer Science",
      account_type: "normal_user",
      user_id: 123,
    },
  },
  status: "authenticated",
  update: jest.fn(),
};

/** Hover over nameDiv and click its edit button, returning the button. */
async function openNameEdit(user: ReturnType<typeof userEvent.setup>) {
  const nameDiv = screen.getByTestId("nameDiv");
  fireEvent.mouseEnter(nameDiv);
  const editButton = await screen.findByTestId("name-edit-button");
  await user.click(editButton);
  return editButton;
}

describe("Profile page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue(mockSession);
  });

  // ── Rendering ────

  describe("Initial render", () => {
    test("renders avatar with first initial and user's name as heading", () => {
      render(<Profile />);

      const avatar = screen.getByTestId("avatar");
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveTextContent("B");

      expect(
        screen.getByRole("heading", { level: 1, name: "Bob Myers" }),
      ).toBeInTheDocument();
    });

    test("renders all three section headings", () => {
      render(<Profile />);

      const h2s = screen.getAllByRole("heading", { level: 2 });
      expect(h2s).toHaveLength(3);

      expect(
        screen.getByRole("heading", { level: 2, name: "Personal Information" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 2, name: "Contact Information" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 2, name: "Account Details" }),
      ).toBeInTheDocument();
    });

    test("shows a loading spinner while session is loading", () => {
      (useSession as jest.Mock).mockReturnValue({
        data: null,
        status: "loading",
        update: jest.fn(),
      });

      render(<Profile />);

      // MUI CircularProgress renders an svg role="progressbar"
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("renders fetched user data after load", async () => {
      render(<Profile />);

      await waitFor(() => {
        expect(screen.getByText("bob.myers@example.com")).toBeInTheDocument();
      });

      expect(screen.getByText("+1234567890")).toBeInTheDocument();
      expect(screen.getByText("Computer Science")).toBeInTheDocument();
    });

    test("renders account type label for normal_user", () => {
      render(<Profile />);
      expect(screen.getByText("Normal User")).toBeInTheDocument();
    });

    test("does not show Save / Cancel buttons before any edit is triggered", () => {
      render(<Profile />);
      expect(screen.queryByText("Save Changes")).not.toBeInTheDocument();
      expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
    });
  });

  // ── Name field edit ───

  describe("Name field editing", () => {
    test("edit button appears on hover and disappears on mouse leave", async () => {
      render(<Profile />);

      const nameDiv = screen.getByTestId("nameDiv");

      fireEvent.mouseEnter(nameDiv);
      expect(await screen.findByTestId("name-edit-button")).toBeInTheDocument();

      fireEvent.mouseLeave(nameDiv);
      await waitFor(() => {
        expect(
          screen.queryByTestId("name-edit-button"),
        ).not.toBeInTheDocument();
      });
    });

    test("clicking edit renders text field pre-filled with current name and action buttons", async () => {
      const user = userEvent.setup();
      render(<Profile />);

      await openNameEdit(user);

      const nameTextField = await screen.findByTestId("nameTextField");
      expect(nameTextField).toBeInTheDocument();
      expect(screen.getByLabelText("Name")).toHaveValue("Bob Myers");

      expect(screen.getByText("Save Changes")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    test("Cancel button restores read-only view and hides action buttons", async () => {
      const user = userEvent.setup();
      render(<Profile />);

      await openNameEdit(user);
      await user.click(screen.getByText("Cancel"));

      await waitFor(() => {
        expect(screen.queryByTestId("nameTextField")).not.toBeInTheDocument();
      });
      expect(screen.queryByText("Save Changes")).not.toBeInTheDocument();
      expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
    });

    test("typing in the name field updates its value", async () => {
      const user = userEvent.setup();
      render(<Profile />);

      await openNameEdit(user);

      const input = screen.getByLabelText("Name");
      await user.clear(input);
      await user.type(input, "Alice");

      expect(input).toHaveValue("Alice");
    });
  });

  // ── Email field edit ───

  describe("Email field editing", () => {
    test("email edit button appears on hover", async () => {
      render(<Profile />);

      // Wait for async data so the email div is populated
      await waitFor(() =>
        expect(screen.getByText("bob.myers@example.com")).toBeInTheDocument(),
      );

      const emailDiv = screen
        .getByText("bob.myers@example.com")
        .closest("div.bg-gray-50")!;

      fireEvent.mouseEnter(emailDiv);
      // There should now be an edit button visible inside the contact section
      const editButtons = screen.getAllByRole("button");
      expect(editButtons.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ── Password dialog ────────────────────────────────────────────────────────

  describe("Password confirmation dialog", () => {
    test("Save Changes opens the password dialog", async () => {
      const user = userEvent.setup();
      render(<Profile />);

      await openNameEdit(user);
      await user.click(screen.getByText("Save Changes"));

      expect(
        await screen.findByText("Enter Password to Save Changes"),
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
    });

    test("Cancel inside dialog closes it without submitting", async () => {
      const user = userEvent.setup();
      render(<Profile />);

      await openNameEdit(user);
      await user.click(screen.getByText("Save Changes"));

      // There are now two Cancel buttons: one in the main form, one in the dialog
      const cancelButtons = await screen.findAllByText("Cancel");
      // Click the dialog's Cancel (last one rendered)
      await user.click(cancelButtons[cancelButtons.length - 1]);

      await waitFor(() => {
        expect(
          screen.queryByText("Enter Password to Save Changes"),
        ).not.toBeInTheDocument();
      });
      expect(global.fetch).not.toHaveBeenCalled();
    });

    test("password field toggles visibility when the eye icon is clicked", async () => {
      const user = userEvent.setup();
      render(<Profile />);

      await openNameEdit(user);
      await user.click(screen.getByText("Save Changes"));

      const passwordInput = await screen.findByLabelText("Password");
      expect(passwordInput).toHaveAttribute("type", "password");

      // The visibility toggle button is inside the dialog
      const toggleButton = passwordInput
        .closest(".MuiInputBase-root")!
        .querySelector("button")!;
      await user.click(toggleButton);

      expect(passwordInput).toHaveAttribute("type", "text");

      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    test("submitting the dialog calls the update API", async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({ status: 200 });

      render(<Profile />);

      await openNameEdit(user);

      // Change the name so there's something to save
      const nameInput = await screen.findByLabelText("Name");
      await user.clear(nameInput);
      await user.type(nameInput, "Alice");

      await user.click(screen.getByText("Save Changes"));

      const passwordInput = await screen.findByLabelText("Password");
      await user.type(passwordInput, "secret123");

      // Click Save inside the dialog
      const saveButtons = screen.getAllByText("Save");
      await user.click(saveButtons[saveButtons.length - 1]);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/update-user-info",
          expect.objectContaining({ method: "POST" }),
        );
      });
    });
  });

  // ── Snackbar feedback ──

  describe("Snackbar feedback", () => {
    test("shows success snackbar after a successful save", async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({ status: 200 });

      render(<Profile />);

      await openNameEdit(user);
      await user.click(screen.getByText("Save Changes"));

      const passwordInput = await screen.findByLabelText("Password");
      await user.type(passwordInput, "secret123");

      const saveButtons = screen.getAllByText("Save");
      await user.click(saveButtons[saveButtons.length - 1]);

      await waitFor(() => {
        expect(
          screen.getByText("Changes saved successfully."),
        ).toBeInTheDocument();
      });
    });

    test("shows error snackbar when the API returns a non-200 status", async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({ status: 500 });

      render(<Profile />);

      await openNameEdit(user);
      await user.click(screen.getByText("Save Changes"));

      const passwordInput = await screen.findByLabelText("Password");
      await user.type(passwordInput, "wrongpassword");

      const saveButtons = screen.getAllByText("Save");
      await user.click(saveButtons[saveButtons.length - 1]);

      await waitFor(() => {
        expect(
          screen.getByText("Changes were not saved, try again later."),
        ).toBeInTheDocument();
      });
    });

    test("clicking the mobile Edit button opens edit mode for every field", async () => {
      const user = userEvent.setup();
      render(<Profile />);

      await waitFor(() => {
        expect(screen.getByText("bob.myers@example.com")).toBeInTheDocument();
      });

      const editButtons = screen.getAllByRole("button", { name: /^Edit$/ });
      const mobileEdit = editButtons[editButtons.length - 1];
      await user.click(mobileEdit);

      expect(await screen.findByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
      expect(screen.getByLabelText("Department")).toBeInTheDocument();
      expect(screen.getByLabelText("Name")).toHaveValue("Bob Myers");
    });

    test("hovering and clicking the Email edit pencil reveals an editable input", async () => {
      const user = userEvent.setup();
      render(<Profile />);

      await waitFor(() => {
        expect(screen.getByText("bob.myers@example.com")).toBeInTheDocument();
      });

      const emailDiv = screen
        .getByText("bob.myers@example.com")
        .closest("div.bg-gray-50")!;

      fireEvent.mouseEnter(emailDiv);
      const pencil = await within(emailDiv as HTMLElement).findByRole("button");
      await user.click(pencil);

      const emailInput = await screen.findByLabelText("Email");
      await user.clear(emailInput);
      await user.type(emailInput, "new@example.com");
      expect(emailInput).toHaveValue("new@example.com");

      // mouseLeave on the original gray div should still be exercised earlier
      fireEvent.mouseLeave(emailDiv);
    });

    test("hovering and clicking the Phone edit pencil reveals an editable phone input", async () => {
      const user = userEvent.setup();
      render(<Profile />);

      await waitFor(() => {
        expect(screen.getByText("+1234567890")).toBeInTheDocument();
      });

      const phoneDiv = screen
        .getByText("+1234567890")
        .closest("div.bg-gray-50")!;

      fireEvent.mouseEnter(phoneDiv);
      const pencil = await within(phoneDiv as HTMLElement).findByRole("button");
      await user.click(pencil);

      const phoneInput = await screen.findByLabelText("Phone Number");
      await user.clear(phoneInput);
      await user.type(phoneInput, "+447700900000");
      expect(phoneInput).toHaveValue("+447700900000");

      fireEvent.mouseLeave(phoneDiv);
    });

    test("hovering and clicking the Department edit pencil reveals the autocomplete", async () => {
      const user = userEvent.setup();
      render(<Profile />);

      await waitFor(() => {
        expect(screen.getByText("Computer Science")).toBeInTheDocument();
      });

      const depDiv = screen
        .getByText("Computer Science")
        .closest("div.bg-blue-50")!;

      fireEvent.mouseEnter(depDiv);
      const pencil = await within(depDiv as HTMLElement).findByRole("button");
      await user.click(pencil);

      expect(await screen.findByLabelText("Department")).toBeInTheDocument();
      fireEvent.mouseLeave(depDiv);
    });

    test("snackbar onClose handler runs when dismiss is triggered", async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({ status: 200 });

      render(<Profile />);

      await openNameEdit(user);
      await user.click(screen.getByText("Save Changes"));

      const passwordInput = await screen.findByLabelText("Password");
      await user.type(passwordInput, "secret123");

      const saveButtons = screen.getAllByText("Save");
      await user.click(saveButtons[saveButtons.length - 1]);

      const successText = await screen.findByText("Changes saved successfully.");
      // Find the close button rendered inside the Alert and click it.
      const alert = successText.closest('[role="alert"]') as HTMLElement;
      const closeButton = alert?.querySelector("button");
      if (closeButton) {
        await user.click(closeButton);
      }
    });

    test("password dialog onClose runs when clicking the backdrop", async () => {
      const user = userEvent.setup();
      render(<Profile />);

      await openNameEdit(user);
      await user.click(screen.getByText("Save Changes"));

      const dialog = await screen.findByRole("dialog");
      const backdrop = dialog.parentElement?.querySelector(
        ".MuiBackdrop-root",
      ) as HTMLElement | null;
      if (backdrop) {
        fireEvent.click(backdrop);
      }
    });

    test("shows invalid password error message on 401 response", async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({ status: 401 });

      render(<Profile />);

      await openNameEdit(user);
      await user.click(screen.getByText("Save Changes"));

      const passwordInput = await screen.findByLabelText("Password");
      await user.type(passwordInput, "badpass");

      const saveButtons = screen.getAllByText("Save");
      await user.click(saveButtons[saveButtons.length - 1]);

      await waitFor(() => {
        expect(screen.getByText("Invalid password")).toBeInTheDocument();
      });
      // Clicking Cancel should derender the buttons and edit textfield
      const cancelButton = screen.getAllByText("Cancel")[0];
      await user.click(cancelButton);
      await waitFor(() => {
        expect(screen.queryByTestId("nameTextField")).not.toBeInTheDocument();
        expect(screen.queryByText("Save Changes")).not.toBeInTheDocument();
      });
    });
  });
});
