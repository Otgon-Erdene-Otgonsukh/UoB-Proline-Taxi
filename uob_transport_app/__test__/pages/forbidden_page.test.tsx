import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ForbiddenPage from "@/components/ForbiddenPage";

describe("ForbiddenPage", () => {
  beforeEach(() => {
    render(<ForbiddenPage />);
  });

  test("renders the 403 image with descriptive alt text", () => {
    const image = screen.getByAltText(/403 Forbidden error image/i);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", expect.stringContaining("403.png"));
  });

  test("shows the access denied heading", () => {
    expect(
      screen.getByRole("heading", { level: 1, name: /Access Denied/i }),
    ).toBeInTheDocument();
  });

  test("shows the unauthorized explanation message", () => {
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /not authorized to access this page/i,
      }),
    ).toBeInTheDocument();
  });
});
