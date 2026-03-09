import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingPage from "@/app/book/page";

// GLOBAL MOCKS

const mockPush = jest.fn();

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { user_id: "1" } },
    status: "authenticated",
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  redirect: jest.fn(),
}));

jest.mock("@/app/requests/departments", () => ({
  getDepartments: jest.fn(() =>
    Promise.resolve({
      status: 200,
      json: () =>
        Promise.resolve([
          { dep_id: 1, dep_name: "Engineering" },
          { dep_id: 2, dep_name: "Finance" },
          { dep_id: 3, dep_name: "HR" },
        ]),
    })
  ),
}));

jest.mock("@/components/ui/map", () => ({
  Map: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map">{children}</div>
  ),
  MapMarker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-marker">{children}</div>
  ),
  MarkerContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  MapRoute: () => <div data-testid="map-route" />,
  MarkerLabel: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

jest.mock("@/components/NumberField", () => ({
  __esModule: true,
  default: ({
    onValueChange,
  }: {
    onValueChange: (v: number) => void;
    min?: number;
    max?: number;
    defaultValue?: number;
    size?: string;
  }) => (
    <input
      data-testid="number-field"
      type="number"
      defaultValue={1}
      onChange={(e) => onValueChange(Number(e.target.value))}
    />
  ),
}));

global.fetch = jest.fn();

// HELPERS

function futureDateString(daysFromNow = 3): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

beforeEach(() => {
  jest.clearAllMocks();
  (global.fetch as jest.Mock).mockResolvedValue({
    status: 200,
    json: async () => ({}),
  });
});

// SECTION 1 — RENDERING

describe("Rendering — Page structure", () => {
  test("renders the page heading", async () => {
    render(<BookingPage />);
    await waitFor(() =>
      expect(screen.getByText("BOOKING DETAILS")).toBeInTheDocument()
    );
  });

  test("renders the confirm booking button", async () => {
    render(<BookingPage />);
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /confirm booking/i })
      ).toBeInTheDocument()
    );
  });

  test("renders the map container", async () => {
    render(<BookingPage />);
    await waitFor(() =>
      expect(screen.getByTestId("map")).toBeInTheDocument()
    );
  });

  test("renders Trip details and Lead passenger section headings", async () => {
    render(<BookingPage />);
    await waitFor(() => {
      expect(screen.getByText(/trip details/i)).toBeInTheDocument();
      expect(screen.getByText(/lead passenger details/i)).toBeInTheDocument();
    });
  });
});

// SECTION 2 — INPUT FIELDS PRESENT

describe("Rendering — Input fields", () => {
  test("renders the common pick-up locations dropdown", async () => {
    render(<BookingPage />);
    await waitFor(() =>
      expect(document.getElementById("commonLoc")).toBeInTheDocument()
    );
  });

  test("renders all key input fields", async () => {
    render(<BookingPage />);
    await waitFor(() => {
      expect(screen.getByLabelText(/drop-off location/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/pick-up date and time/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/passenger name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/additional information/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
    });
  });

  test("renders pick-up time input", async () => {
    render(<BookingPage />);
    await waitFor(() =>
      expect(document.querySelector('input[type="time"]')).toBeInTheDocument()
    );
  });

  test("renders the number-field (passengers) defaulting to 1", async () => {
    render(<BookingPage />);
    await waitFor(() => {
      const numField = screen.getByTestId("number-field") as HTMLInputElement;
      expect(numField).toBeInTheDocument();
      expect(numField.value).toBe("1");
    });
  });

  test("phone country code defaults to +44 (UK)", async () => {
    render(<BookingPage />);
    await waitFor(() =>
      expect(screen.getByDisplayValue("+44 (UK)")).toBeInTheDocument()
    );
  });

  test("input types are correct", async () => {
    render(<BookingPage />);
    await waitFor(() => {
      expect(screen.getByLabelText(/pick-up date and time/i)).toHaveAttribute("type", "date");
      expect(screen.getByLabelText(/phone number/i)).toHaveAttribute("type", "tel");
      expect(screen.getByLabelText(/^email$/i)).toHaveAttribute("type", "email");
    });
  });
});