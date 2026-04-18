import "@testing-library/jest-dom";
import { screen, render, fireEvent } from "@testing-library/react";
import FAQ from "@/app/faq/page";

describe("Faq page renders with all elements", () => {
  beforeEach(() => {
    render(<FAQ />);
  });

  test("clicking a FAQ question expands it and clicking again collapses it", () => {
    const button = screen.getByRole("button", {
      name: /What fleet options are there\?/i,
    });
    expect(button).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("opening a different FAQ question switches which one is open", () => {
    const first = screen.getByRole("button", {
      name: /What fleet options are there\?/i,
    });
    const second = screen.getByRole("button", {
      name: /How can I book a taxi\?/i,
    });

    fireEvent.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(second).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(second);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
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
    const images = screen.getAllByTestId("logos");
    expect(images.length).toBe(3);
    images.forEach(img => {
      expect(img).toBeInTheDocument();
    });
  });
});
