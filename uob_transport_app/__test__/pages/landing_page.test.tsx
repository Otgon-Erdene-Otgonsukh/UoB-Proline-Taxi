import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Land from "@/components/Landing_page";
import { useSession } from "next-auth/react";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn().mockResolvedValue({}),
}));

describe("Landing page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should have image", () => {
    render(<Land />);
    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/landpic.svg");
  });

  test("should have text", () => {
    render(<Land />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  // button tests
  test("should have 2 button", () => {
    render(<Land />);
    const buttons = screen.getAllByRole("button");
    buttons.map((b) => {
      expect(b).toBeInTheDocument();
    });
    expect(buttons.length).toEqual(2);
  });

  test("both buttons should navigate to their respective pages if user is normal user", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          account_type: "normal_user",
        },
      },
    });
    render(<Land />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/home");
    expect(links[1]).toHaveAttribute("href", "/about");
  });

  test("The first button redirects to super page if user is super admin", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          account_type: "super_admin"
        }
      }
    })
    render(<Land />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/super");
    expect(links[1]).toHaveAttribute("href", "/about");
  })

  test("The first button redirects to dep-dashboard page if user is finance staff", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          account_type: "finance_staff"
        }
      }
    })
    render(<Land />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/dep-dashboard");
    expect(links[1]).toHaveAttribute("href", "/about");
  })

  test("If no session exists, redirects to login page", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null    
    })
    render(<Land />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/login");
    expect(links[1]).toHaveAttribute("href", "/about");
  })
});
