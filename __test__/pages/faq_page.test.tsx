import "@testing-library/jest-dom";
import { screen, render } from "@testing-library/react";
import FAQ from "@/src/app/faq/page";

describe("Faq page renders with all elements", () => {
  beforeEach(() => {
    render(<FAQ />);
  });

  test("Titles are both present", () => {
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings.length).toBe(2);
    headings.forEach((heading) => {
      expect(heading).toBeInTheDocument();
    });
  });

  test("renders all DdInfoBox titles", () => {
    const questions = [
      "What fleet options are there?",
      "How can I book a taxi?",
      "How do I sign up?",
      "How do bookings get approved?",
    ];

    questions.forEach((q) => {
      expect(screen.getByText(q)).toBeInTheDocument();
    });
  });

  test("images load correctly", () => {
    const images = screen.getAllByRole("img")
    expect(images.length).toBe(3)
  })
});
