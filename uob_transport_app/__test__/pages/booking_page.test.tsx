import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingPage from "@/app/book/page";

// ─── Mocks ───

// next-auth session
jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { user_id: "test-user-123" } },
    status: "authenticated",
  }),
}));

// next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  redirect: jest.fn(),
}));

// Department API
jest.mock("@/app/requests/departments", () => ({
  getDepartments: jest.fn(() =>
    Promise.resolve({
      status: 200,
      json: () =>
        Promise.resolve([
          { dep_id: 1, dep_name: "Engineering" },
          { dep_id: 2, dep_name: "HR" },
        ]),
    })
  ),
}));

// Map components (no-op stubs so MapLibre doesn't crash in jsdom)
jest.mock("@/components/ui/map", () => ({
  Map: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-map">{children}</div>
  ),
  MapMarker: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  MarkerContent: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  MapRoute: () => null,
  MarkerLabel: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// NumberField
jest.mock("@/components/NumberField", () => ({
  __esModule: true,
  default: ({ onValueChange }: { onValueChange: (v: number) => void }) => (
    <input
      data-testid="number-field"
      type="number"
      defaultValue={1}
      onChange={(e) => onValueChange(Number(e.target.value))}
    />
  ),
}));

// Nominatim (geocoding)
global.fetch = jest.fn((url: string) => {
  if (url.includes("nominatim")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            lat: "51.456890",
            lon: "-2.601892",
            name: "Test Location",
            display_name: "Test Location, Bristol, United Kingdom",
          },
        ]),
    });
  }
  // OSRM routing
  if (url.includes("osrm")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          routes: [
            {
              geometry: { coordinates: [[-2.6, 51.45], [-2.61, 51.46]] },
              duration: 600,
              distance: 3200,
            },
          ],
        }),
    });
  }
  // Booking API
  if (url.includes("create_booking")) {
    return Promise.resolve({ status: 200 });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
}) as jest.Mock;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const renderPage = () => render(<BookingPage />);

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("BookingPage – rendering", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Static structure ───────────────────────────────────────────────────────

  it("renders the page heading", () => {
    renderPage();
    expect(screen.getByText("BOOKING DETAILS")).toBeInTheDocument();
  });

  it("renders section headings", () => {
    renderPage();
    expect(screen.getByText("Trip details:")).toBeInTheDocument();
    expect(screen.getByText("Lead passenger details:")).toBeInTheDocument();
  });

  it("renders the common pick-up locations dropdown", () => {
    renderPage();
    expect(
      screen.getByLabelText(/common pick-up locations/i)
    ).toBeInTheDocument();
  });

  it("renders all toggle checkboxes", () => {
    renderPage();
    expect(screen.getByLabelText(/manually enter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^flight$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^via$/i)).toBeInTheDocument();
  });

  it("renders passenger name, phone, email and additional info fields", () => {
    renderPage();
    expect(screen.getByLabelText(/passenger name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/additional information/i)).toBeInTheDocument();
  });

  it("renders pick-up date and time inputs", () => {
    renderPage();
    expect(screen.getByLabelText(/pick-up date and time/i)).toBeInTheDocument();
    expect(document.getElementById("pickupDate")).toBeInTheDocument();
    expect(document.getElementById("pickupTime")).toBeInTheDocument();
  });

  it("renders the Confirm Booking button", () => {
    renderPage();
    expect(
      screen.getByRole("button", { name: /confirm booking/i })
    ).toBeInTheDocument();
  });

  it("renders the map panel", () => {
    renderPage();
    expect(screen.getByTestId("mock-map")).toBeInTheDocument();
  });

  // ── Toggle: Manually Enter ──

  it("shows custom pick-up input when 'Manually Enter' is toggled on", async () => {
    renderPage();
    const toggle = screen.getByLabelText(/manually enter/i);
    await userEvent.click(toggle);
    expect(screen.getByLabelText(/custom pick-up location/i)).toBeInTheDocument();
  });

  it("hides the common-locations dropdown when 'Manually Enter' is toggled on", async () => {
    renderPage();
    await userEvent.click(screen.getByLabelText(/manually enter/i));
    // MUI Select is rendered but disabled
    const select = screen.getByLabelText(/common pick-up locations/i);
    expect(select).toBeDisabled();
  });

  // ── Toggle: Flight ──

  it("shows flight number and airport inputs when 'Flight' is toggled on", async () => {
    renderPage();
    await userEvent.click(screen.getByLabelText(/^flight$/i));
    expect(screen.getByLabelText(/flight number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^airport$/i)).toBeInTheDocument();
  });

  it("hides 'Manually Enter' toggle when 'Flight' is active", async () => {
    renderPage();
    await userEvent.click(screen.getByLabelText(/^flight$/i));
    expect(screen.queryByLabelText(/manually enter/i)).not.toBeInTheDocument();
  });

  // ── Toggle: Via ──

  it("shows the first Via input when Via is toggled on", async () => {
    renderPage();
    await userEvent.click(screen.getByLabelText(/^via$/i));
    expect(screen.getByPlaceholderText(/^via\.\.\./i)).toBeInTheDocument();
  });

  // ── Toggle: Return trip ─

  it("shows return trip fields when return checkbox is checked", async () => {
    renderPage();
    const checkbox = screen.getByLabelText(/return trip/i);
    await userEvent.click(checkbox);
    expect(
      screen.getByLabelText(/return trip pick-up location/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/return trip drop-off location/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/return trip pick-up date and time/i)
    ).toBeInTheDocument();
  });

  // ── Validation errors on empty submit ─

  it("shows validation errors when form is submitted empty", async () => {
    renderPage();
    await userEvent.click(
      screen.getByRole("button", { name: /confirm booking/i })
    );
    await waitFor(() => {
      expect(screen.getByText(/please pick one/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter a drop-off location/i)).toBeInTheDocument();
      expect(screen.getByText(/please select a date/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter the passenger's name/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  // ── Flight validation ─

  it("shows flight number format error for an invalid value", async () => {
    renderPage();
    await userEvent.click(screen.getByLabelText(/^flight$/i));

    fireEvent.change(screen.getByLabelText(/flight number/i), {
      target: { value: "INVALID" },
    });

    await userEvent.click(
      screen.getByRole("button", { name: /confirm booking/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/please enter your flight number/i)
      ).toBeInTheDocument();
    });
  });

  // ── Drop-off location geocoding ─

  it("calls Nominatim when drop-off field loses focus", async () => {
    renderPage();
    const dropoff = document.getElementById("dropLoc") as HTMLInputElement;
    fireEvent.change(dropoff, { target: { value: "Temple Meads, Bristol" } });
    fireEvent.blur(dropoff);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("nominatim"),
        expect.any(Object)
      );
    });
  });

  // ── Departments loaded ──

  it("loads and displays departments in the autocomplete", async () => {
    renderPage();
    const input = screen.getByLabelText(/department/i);
    await userEvent.click(input);

    await waitFor(() => {
      expect(screen.getByText("Engineering")).toBeInTheDocument();
      expect(screen.getByText("HR")).toBeInTheDocument();
    });
  });

  // ── Phone code selector ─

  it("renders phone country code selector with +44 as default", () => {
    renderPage();
    const select = screen.getByDisplayValue("+44 (UK)") as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    expect(select.value).toBe("+44");
  });

  it("allows changing phone country code", async () => {
    renderPage();
    const select = screen.getByDisplayValue("+44 (UK)") as HTMLSelectElement;
    await userEvent.selectOptions(select, "+33");
    expect(select.value).toBe("+33");
  });

  // ── Successful form submission ──

  it("redirects to /book/confirmed on successful submission", async () => {
    renderPage();

    // Pick a common location
    const locationSelect = document.getElementById("commonLoc");
    fireEvent.mouseDown(locationSelect!);
    await waitFor(() =>
      screen.getByText("Queens Building")
    );
    await userEvent.click(screen.getByText("Queens Building"));

    // Fill drop-off
    const dropoff = document.getElementById("dropLoc") as HTMLInputElement;
    fireEvent.change(dropoff, { target: { value: "Bristol Temple Meads" } });
    fireEvent.blur(dropoff);
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("nominatim"),
        expect.any(Object)
      )
    );

    // Fill date/time (future)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];
    fireEvent.change(document.getElementById("pickupDate")!, {
      target: { value: dateStr },
    });
    fireEvent.change(document.getElementById("pickupTime")!, {
      target: { value: "10:00" },
    });

    // Passenger details
    fireEvent.change(screen.getByLabelText(/passenger name/i), {
      target: { value: "Jane Smith" },
    });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(document.getElementById("number")!, {
      target: { value: "07700900123" },
    });

    // Department (autocomplete)
    const { getDepartments } = require("@/app/requests/departments");
    await waitFor(() => expect(getDepartments).toHaveBeenCalled());
    const deptInput = screen.getByLabelText(/department/i);
    await userEvent.click(deptInput);
    await userEvent.click(await screen.findByText("Engineering"));

    // Submit
    await userEvent.click(
      screen.getByRole("button", { name: /confirm booking/i })
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/book/confirmed");
    });
  });
});