import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegRequestSent from "@/app/register/(components)/register-req";

const mockRedirect = jest.fn();
jest.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}));

describe("RegRequestSent", () => {
  beforeEach(() => {
    mockRedirect.mockClear();
  });

  test("renders confirmation copy and helpful sections", () => {
    render(<RegRequestSent />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Request Sent Successfully/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /What.s Next\?/i }),
    ).toBeInTheDocument();
    expect(screen.getByAltText(/person waiting image/i)).toBeInTheDocument();
  });

  test("each home button click triggers a redirect to '/'", async () => {
    render(<RegRequestSent />);
    const buttons = screen.getAllByRole("button", { name: /Go to home page/i });
    expect(buttons.length).toBeGreaterThanOrEqual(2);

    for (const button of buttons) {
      await userEvent.click(button);
    }

    expect(mockRedirect).toHaveBeenCalledTimes(buttons.length);
    mockRedirect.mock.calls.forEach((call) => {
      expect(call[0]).toBe("/");
    });
  });
});
