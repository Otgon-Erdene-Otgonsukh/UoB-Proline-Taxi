import "@testing-library/jest-dom";
import { screen, render } from "@testing-library/react";
import { Navbar } from "@/components/Navbar";

jest.mock("next/navigation", () => ({
  // created a fake useRouter function to replace the Next router that is used in the navbar to avoid dependency issues since the tests do not run in next environment
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("make sure the links are there", () => {
  render(<Navbar />);

  test("all the tab texts are rendered", () => {
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByText(/Help/i)).toBeInTheDocument();
  });
});
