import "@testing-library/jest-dom";
import Profile from "@/app/profile/page";
import userEvent from "@testing-library/user-event";
import { screen, render, waitFor, fireEvent } from "@testing-library/react";
import { useSession } from "next-auth/react";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/app/requests/departments", () => ({
  getDepartments: jest.fn().mockResolvedValue({}),
}));

global.fetch = jest.fn();

describe("Profile page render test with event testing logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Avatar and the header texts are rendered", () => {
    (useSession as jest.Mock).mockReturnValue({
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
    });

    render(<Profile />);

    // Check avatar is rendered
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveTextContent("B");

    // Check main heading with name
    const mainHeading = screen.getByRole("heading", { level: 1 });
    expect(mainHeading).toBeInTheDocument();
    expect(mainHeading).toHaveTextContent("Bob Myers");

    const sectionHeadings = screen.getAllByRole("heading", { level: 2 });
    expect(sectionHeadings).toHaveLength(3);
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("Contact Information")).toBeInTheDocument();
    expect(screen.getByText("Account Details")).toBeInTheDocument();
  });

  test("All text content is rendered in the document", () => {
    (useSession as jest.Mock).mockReturnValue({
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
    });

    render(<Profile />);

    // Check Personal Information section content
    expect(screen.getByText("Full Name")).toBeInTheDocument();
    const nameFields = screen.getAllByText("Bob Myers");
    expect(nameFields.length).toBeGreaterThanOrEqual(2);

    // Check Contact Information section content
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("bob.myers@example.com")).toBeInTheDocument();
    expect(screen.getByText("Phone Number")).toBeInTheDocument();
    expect(screen.getByText("+1234567890")).toBeInTheDocument();

    // Check Account Details section content
    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    expect(screen.getByText("Account Type")).toBeInTheDocument();
    expect(screen.getByText("Normal User")).toBeInTheDocument();
  });

  test("Save and cancel buttons and textfield is rendered in when in edit mode", async () => {
    const user = userEvent.setup();
    (useSession as jest.Mock).mockReturnValue({
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
    });

    render(<Profile />);

    // Trigger mouse enter to reveal the edit button
    const nameDiv = screen.getByTestId("nameDiv");
    fireEvent.mouseEnter(nameDiv);

    // Wait for the edit button to appear after hovering
    await waitFor(() => {
      expect(screen.getByTestId("name-edit-button")).toBeInTheDocument();
    });

    // Click the edit button
    const editButton = screen.getByTestId("name-edit-button");
    await user.click(editButton);

    // Wait for the text field to appear
    await waitFor(() => {
      expect(screen.getByTestId("nameTextField")).toBeInTheDocument();
    });

    const nameTextField = screen.getByLabelText("Name");
    expect(nameTextField).toHaveValue("Bob Myers");

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(2);
    expect(buttons[0]).toHaveTextContent("Save Changes");
    expect(buttons[1]).toHaveTextContent("Cancel");

    // Clicking Cancel should derender the buttons and edit textfield
    await user.click(buttons[1]);
    await waitFor(() => {
        expect(screen.queryAllByRole("button").length).toBe(0);
    });
    expect(screen.queryByTestId("nameTextField")).toBe(null);
  });
});
