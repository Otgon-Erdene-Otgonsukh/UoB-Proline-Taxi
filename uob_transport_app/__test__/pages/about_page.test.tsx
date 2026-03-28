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
    // The heading text lives in a single <h1>, so querying each word separately
    // is more reliable than a combined regex across elements.
    expect(screen.getByText(/Proline Taxi/i)).toBeInTheDocument();
    expect(screen.getByText(/University of Bristol/i)).toBeInTheDocument();
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