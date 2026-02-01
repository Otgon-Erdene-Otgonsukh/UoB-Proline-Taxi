import "@testing-library/jest-dom";
import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Register from "@/app/register/page";

jest.mock("next/navigation", () => ({
  redirect: jest.fn()
}))

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: true,
  }))
}))

describe("Register page rendering test", () => {
  beforeEach(() => {
    render(<Register />);
  });

  test("All TextFields and select render correctly.", () => {
    const textFields = screen.getAllByTestId("textfield");
    expect(textFields.length).toBe(6);

    const options = screen.getAllByRole("option");
    expect(options.length).toBe(8);
  });

  test("Image is displayed and headers are there.", () => {
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 }).length).toBe(2);
  });

  test("Role cards are displayed", () => {
    const cards = screen.getAllByTestId("card");
    expect(cards.length).toBe(3);
    cards.forEach((card) => {
      expect(card).toBeVisible();
    });
  });

  test("button behaviour.", async () => {
    const user = userEvent.setup();
    const button = screen.getByTestId("submit-button");

    // Fill in the form
    await user.type(screen.getAllByTestId("textfield")[0], "John"); // firstName
    await user.type(screen.getAllByTestId("textfield")[1], "Doe"); // lastName
    await user.type(screen.getAllByTestId("textfield")[2], "1234567890"); // phone
    await user.type(screen.getAllByTestId("textfield")[3], "Law"); // department
    await user.type(screen.getAllByTestId("textfield")[4], "john@test.com"); // email
    await user.type(screen.getAllByTestId("textfield")[5], "password123"); // password

    // Click on the text within the first card to select Normal User
    await user.click(screen.getByText("Normal User"));
    expect(button).toHaveTextContent("Sign up");

    // Wait for the check icon to appear after state update
    const checkIcon = await screen.findByTestId("normal-check-icon");
    expect(checkIcon).toBeInTheDocument();

    // Ensure the loading animation is displayed in the button when a valid form is submitted
    await user.click(button);
    waitFor(() => {
      expect(button).not.toHaveTextContent("Sign up");
      expect(button).toContainElement(screen.getByTestId("loadingBar"));
    });
  });

  test("Test only one role can be selected", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText("Normal User"));
    await user.click(screen.getByText("Finance Staff"));
    await user.click(screen.getByText("Proline Staff"));

    // After clicking other roles, normal user check icon should be invisible. i.e. null
    await waitFor(() => {
      expect(screen.queryByTestId("normal-check-icon")).toBeNull();
      expect(screen.queryByTestId("finance-check-icon")).toBeNull();
      expect(screen.getByTestId("proline-check-icon")).toBeInTheDocument();
    });
  });
});
