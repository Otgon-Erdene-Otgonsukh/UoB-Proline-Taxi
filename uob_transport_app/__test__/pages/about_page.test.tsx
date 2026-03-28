import "@testing-library/jest-dom";
import { screen, render } from "@testing-library/react";
import About from "@/app/about/page";

describe("Check whether the about page has the required elements", () => {
  beforeEach(() => {
    render(<About />);
  });

  test("all the icons are rendered", () => {
    // Query SVGs from the already-rendered component (via beforeEach),
    // rather than calling render() again inside the test.
    const icons = document.querySelectorAll("svg");
    expect(icons.length).toBeGreaterThanOrEqual(9);
  });

  test("displays main heading with company name", () => {
    // Query all h1 elements and check that at least one contains both terms,
    // avoiding the "multiple elements" error from repeated text elsewhere on the page.
    const headings = screen.getAllByRole("heading", { level: 1 });
    const mainHeading = headings.find(
      (h) =>
        /Proline Taxi/i.test(h.textContent ?? "") &&
        /University of Bristol/i.test(h.textContent ?? "")
    );
    expect(mainHeading).toBeInTheDocument();
  });

  test("displays all 4 booking steps in order", () => {
    expect(screen.getByText(/1\. Fill in the booking form/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Get approval/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Receive confirmation/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. Off you go!/i)).toBeInTheDocument();
  });

  test("image renders", () => {
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThanOrEqual(1);
    expect(images[0]).toBeVisible();
  });

  test("review cards are all displayed", () => {
    const cards = screen.getAllByTestId("review-card");
    cards.forEach((card) => {
      expect(card).toBeInTheDocument();
      expect(card).toBeVisible();
    });
    expect(cards.length).toBe(3);
  });

  test("contact details are present", () => {
    expect(screen.getByText(/sales@prolinetaxi\.com/i)).toBeInTheDocument();
  });
});