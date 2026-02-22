import "@testing-library/jest-dom";
import { screen, render } from "@testing-library/react";
import About from "@/app/about/page";

describe("Check whether the about page has the required elements", () => {
  beforeEach(() => {
    render(<About />);
  });

  test("all the icons are rendered", () => {
    const { container } = render(<About />);
    const icons = container.querySelectorAll("svg");
    expect(icons.length).toBe(10);
  });

  test("displays main heading with company name", () => {
    const heading = screen.getByText(/Proline Taxi.*University of Bristol/i);
    expect(heading).toBeInTheDocument();
  });

  test("displays all 4 booking steps in order", () => {
    expect(
      screen.getByText(/1. Fill in the booking form/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/2. Get approval/i)).toBeInTheDocument();
    expect(
      screen.getByText(/3. Receive confirmation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/4. Off you go!/i)).toBeInTheDocument();
  });

  test("image renders", () => {
    const image = screen.getAllByRole("img");
    expect(image.length).toBe(1);
    expect(image[0]).toBeVisible();
  });

  test("Reveiw cards are all displayed", () => {
    const cards = screen.getAllByTestId("review-card");
    cards.forEach(card => {
      expect(card).toBeInTheDocument();
      expect(card).toBeVisible();
    })
    expect(cards.length).toBe(3);
  })
});
