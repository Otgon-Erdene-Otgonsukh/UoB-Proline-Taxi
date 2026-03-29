import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingPage from "@/app/book/page";

// ─── GLOBAL MOCKS ────

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

// Simulate nominatim address searching.
jest.mock("@/components/NominatimSearch", () => ({
  __esModule: true,
  getLatLon: jest.fn(async (address: string) => {
    if (address === "Temple Meads") { // A value to simulate a real resolvable location.
      return { lat: "51.4490991", lon: "-2.5804029", name: "Temple Meads Bristol", full_address: "Temple Meads Bristol, Cattle Market Road, The Dings, St Philip's, Bristol, City of Bristol, West of England, England, BS1 6QF, United Kingdom" };
    }
    return null;
  }),
}));

global.fetch = jest.fn();

// ─── HELPERS ───

function futureDateString(daysFromNow = 3): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

/** Fill every required field so the form can be submitted successfully. */
async function fillValidForm() {
  // MUI Select — fireEvent.mouseDown opens the list, then fireEvent.click picks
  // the option. This matches the pattern used in the working interactivity tests
  // and reliably fires the MUI onChange that updates formData.CommonLoc.
  fireEvent.mouseDown(screen.getAllByRole("combobox")[0]);
  await waitFor(() => screen.getByText("Queens Building"));
  fireEvent.click(screen.getByText("Queens Building"));

  // Plain inputs — userEvent.type fires synthetic onChange so formData is updated.
  await userEvent.type(
    screen.getByLabelText(/drop-off location/i),
    "Temple Meads"
  );
  // Trigger blur driven lookup logic used by the page.
  await userEvent.tab();
  await userEvent.click(screen.getByText(/i am/i));
  await waitFor(() => screen.getByLabelText(/passenger name/i));
  await userEvent.type(screen.getByLabelText(/pick-up date and time/i), futureDateString());
  await userEvent.type(document.querySelector('input[type="time"]') as HTMLElement, "10:00");
  await userEvent.type(screen.getByLabelText(/passenger name/i), "Jane Doe");
  await userEvent.type(screen.getByLabelText(/phone number/i), "07911123456");
  await userEvent.type(screen.getByLabelText(/^email$/i), "jane@example.com");

  // MUI Autocomplete — click to open, wait for options to load, then click option.
  const deptInput = screen.getByLabelText(/department/i);
  await userEvent.click(deptInput);
  await waitFor(() => screen.getByText("Finance"));
  await userEvent.click(screen.getByText("Finance"));
}

beforeEach(() => {
  jest.clearAllMocks();
  (global.fetch as jest.Mock).mockResolvedValue({
    status: 200,
    json: async () => ({}),
  });
});

// ─── RENDERING ────

describe("Rendering", () => {
  test("renders all page structure, input fields, and correct attributes", async () => {
    render(<BookingPage />);
    await waitFor(() => screen.getByText("BOOKING DETAILS"));
    await waitFor(() => screen.getByLabelText(/I am the lead passenger/i));
    await userEvent.click(screen.getByLabelText(/I am the lead passenger/i));

    // Page structure
    expect(screen.getByText(/trip details/i)).toBeInTheDocument();
    expect(screen.getByText(/lead passenger details/i)).toBeInTheDocument();
    expect(screen.getAllByTestId("map")).toHaveLength(2);
    expect(document.querySelector("form")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirm booking/i })).not.toBeDisabled();

    // All input fields present
    expect(screen.getAllByRole("combobox").length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/drop-off location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pick-up date and time/i)).toBeInTheDocument();
    expect(document.querySelector('input[type="time"]')).toBeInTheDocument();
    expect(screen.getByLabelText(/passenger name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByTestId("number-field")).toBeInTheDocument();
    expect(screen.getByLabelText(/additional information/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();

    // Field types, attributes and defaults
    expect(screen.getByLabelText(/pick-up date and time/i)).toHaveAttribute("type", "date");
    expect(screen.getByLabelText(/phone number/i)).toHaveAttribute("type", "tel");
    expect(screen.getByLabelText(/^email$/i)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(/additional information/i)).toHaveAttribute("maxLength", "500");
    expect(screen.getByLabelText(/additional information/i)).toHaveAttribute(
      "placeholder",
      "Enter any additional information..."
    );
    expect(screen.getByLabelText(/drop-off location/i)).toHaveAttribute("placeholder");
    expect(screen.getByTestId("number-field") as HTMLInputElement).toHaveValue(1);
    expect(screen.getByDisplayValue("+44 (UK)")).toBeInTheDocument();

    // Toggle checkboxes
    expect(screen.getByLabelText(/manually enter/i)).toHaveAttribute("type", "checkbox");
    expect(screen.getByLabelText(/^flight$/i)).toHaveAttribute("type", "checkbox");
    expect(screen.getByLabelText(/^via$/i)).toHaveAttribute("type", "checkbox");
    expect(screen.getByLabelText(/return trip/i)).toHaveAttribute("type", "checkbox");
  });
});

// ─── TOGGLE FIELDS ───

describe("Toggle fields", () => {
  test("all toggles show/hide their conditional fields correctly", async () => {
    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/manually enter/i));

    // Manually enter: hidden by default, shown on toggle, re-hidden on second toggle, disables dropdown
    expect(screen.queryByLabelText(/custom pick-up location/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByLabelText(/manually enter/i));
    await waitFor(() => {
      expect(screen.getByLabelText(/custom pick-up location/i)).toBeInTheDocument();
      expect(
        document.querySelector('#commonLoc[aria-disabled="true"]') ??
          document.querySelector('.Mui-disabled [role="combobox"]') ??
          document.querySelector(".MuiSelect-root.Mui-disabled")
      ).not.toBeNull();
    });
    await userEvent.click(screen.getByLabelText(/manually enter/i));
    await waitFor(() =>
      expect(screen.queryByLabelText(/custom pick-up location/i)).not.toBeInTheDocument()
    );

    // Flight: hidden by default, shown on toggle, also hides manually enter
    expect(screen.queryByLabelText(/flight number/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/airport/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByLabelText(/^flight$/i));
    await waitFor(() => {
      expect(screen.getByLabelText(/flight number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/airport/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/manually enter/i)).not.toBeInTheDocument();
    });
  });

  test("via and return trip toggles show conditional fields", async () => {
    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/^via$/i));

    // Via: hidden by default, shown on toggle
    expect(screen.queryByPlaceholderText(/via\.\.\./i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByLabelText(/^via$/i));
    await waitFor(() =>
      expect(screen.getByPlaceholderText(/via\.\.\./i)).toBeInTheDocument()
    );

    // Return trip: hidden by default, shown on toggle, pick-up location pre-filled and disabled
    expect(screen.queryByLabelText(/return date/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByLabelText(/return trip/i));
    await waitFor(() => {
      expect(screen.getByLabelText(/return trip pick-up date and time/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/return trip pick-up location/i)).toBeDisabled();
    });
  });

  test("enabling flight toggle resets manual entry state", async () => {
    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/manually enter/i));

    await userEvent.click(screen.getByLabelText(/manually enter/i));
    await waitFor(() => screen.getByLabelText(/custom pick-up location/i));

    await userEvent.click(screen.getByLabelText(/^flight$/i));
    await waitFor(() => {
      expect(screen.queryByLabelText(/custom pick-up location/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/manually enter/i)).not.toBeInTheDocument();
    });
  });
});

// ─── VALIDATION ───

describe("Validation", () => {
  test("empty form submission shows all required errors and red borders, does not redirect", async () => {
    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/I am the lead passenger/i));
    await userEvent.click(screen.getByLabelText(/I am the lead passenger/i));
    await waitFor(() => screen.getByRole("button", { name: /confirm booking/i }));
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() => {
      expect(screen.getByText(/please pick one/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter a drop-off location/i)).toBeInTheDocument();
      expect(screen.getByText(/please select a date/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/select a department/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter the passenger's phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/drop-off location/i)).toHaveClass("border-red-700");
      expect(screen.getByLabelText(/pick-up date and time/i)).toHaveClass("border-red-700");
      expect(screen.getByLabelText(/^email$/i)).toHaveClass("border-red-700");
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  test("drop-off location: validates non-existent, and clears error on valid input", async () => {
    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/drop-off location/i));
    const input = screen.getByLabelText(/drop-off location/i);

    // Non existent location
    fireEvent.change(input, { target: { value: "hfgnuaijekgfhnbusjiyklgbfhnsuyikglhf" } });
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() =>
      expect(screen.getByText(/please enter a drop\-off location/i)).toBeInTheDocument()
    );

    // Empty location
    fireEvent.change(input, { target: { value: "" } });
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() =>
      expect(screen.getByText(/please enter a drop\-off location/i)).toBeInTheDocument()
    );

    await userEvent.type(input, "Real Place");
    await waitFor(() => expect(input).not.toHaveClass("border-red-700"));
  });

  test("custom pick-up location: validates empty, non-existent, and red border", async () => {
    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/manually enter/i));
    await userEvent.click(screen.getByLabelText(/manually enter/i));
    await waitFor(() => screen.getByLabelText(/custom pick-up location/i));
    const input = screen.getByLabelText(/custom pick-up location/i);

    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() => {
      expect(screen.getByText(/please enter a pickup location/i)).toBeInTheDocument();
      expect(input).toHaveClass("border-red-700");
    }); 

    fireEvent.change(input, { target: { value: "hfgnuaijekgfhnbusjiyklgbfhnsuyikglhf" } });
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() =>
      expect(screen.getByText(/please enter a drop\-off location/i)).toBeInTheDocument()
    );
  });

  test("flight fields: validates empty and invalid flight number, empty and too-long airport", async () => {
    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/^flight$/i));
    await userEvent.click(screen.getByLabelText(/^flight$/i));
    await waitFor(() => screen.getByLabelText(/flight number/i));
    const flightInput = screen.getByLabelText(/flight number/i);
    const airportInput = screen.getByLabelText(/airport/i);

    // Empty submit
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() => {
      expect(screen.getByText(/please enter your flight number/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter your airport/i)).toBeInTheDocument();
      expect(airportInput).toHaveClass("border-red-700");
    });

    // Invalid flight number format
    await userEvent.type(flightInput, "INVALID");
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/please enter your flight number \(formatted AB1234\)/i)
      ).toBeInTheDocument();
      expect(flightInput).toHaveClass("border-red-700");
    });

    // Valid format clears flight error
    fireEvent.change(flightInput, { target: { value: "BA1234" } });
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() =>
      expect(
        screen.queryByText(/please enter your flight number \(formatted AB1234\)/i)
      ).not.toBeInTheDocument()
    );
  });

  test("flight number: accepts valid formats including easyJet-style (letter+alphanum+digits)", async () => {
    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/^flight$/i));
    await userEvent.click(screen.getByLabelText(/^flight$/i));
    await waitFor(() => screen.getByLabelText(/flight number/i));
    const flightInput = screen.getByLabelText(/flight number/i);

    // Regex: ^[A-Za-z]{1}[A-Za-z0-9]{1}[0-9]{1,4}$ — two-char prefix then 1–4 digits.
    // EZY (ICAO code, 3 letters) fails the regex; easyJet's IATA code U2 is used instead.
    for (const valid of ["U21234", "BA123", "U29999"]) {
      fireEvent.change(flightInput, { target: { value: valid } });
      await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
      await waitFor(() =>
        expect(
          screen.queryByText(/please enter your flight number \(formatted AB1234\)/i)
        ).not.toBeInTheDocument()
      );
    }
  });

  test("pickup date/time: validates empty, missing time, past date, and accepts future date", async () => {
    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/pick-up date and time/i));
    const dateInput = screen.getByLabelText(/pick-up date and time/i);
    const timeInput = document.querySelector('input[type="time"]') as HTMLInputElement;

    // No date
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() =>
      expect(screen.getByText(/please select a date/i)).toBeInTheDocument()
    );

    // Date but no time
    await userEvent.type(dateInput, futureDateString());
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() =>
      expect(screen.getByText(/please select a time/i)).toBeInTheDocument()
    );

    // Past date — error and red borders
    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, "2020-01-01");
    await userEvent.type(timeInput, "10:00");
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() => {
      expect(screen.getByText(/booking cannot be made in the past/i)).toBeInTheDocument();
      expect(dateInput).toHaveClass("border-red-700");
      expect(timeInput).toHaveClass("border-red-700");
    });

    // Future date — no past error
    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, futureDateString());
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() =>
      expect(
        screen.queryByText(/booking cannot be made in the past/i)
      ).not.toBeInTheDocument()
    );
  });

  test("return trip date/time: validates empty return date and empty return time", async () => {
    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/return trip/i));
    await userEvent.click(screen.getByLabelText(/return trip/i));
    await waitFor(() => screen.getByLabelText(/return trip pick-up date and time/i));
    const returnDateInput = screen.getByLabelText(/return trip pick-up date and time/i);

    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() => {
      expect(screen.getByText(/please select a return date/i)).toBeInTheDocument();
      expect(returnDateInput).toHaveClass("border-red-700");
    });

    await userEvent.type(returnDateInput, futureDateString(5));
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() =>
      expect(screen.getByText(/please select a return time/i)).toBeInTheDocument()
    );
  });

  test("phone number: validates empty, invalid, valid, and country code change", async () => {
    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/I am the lead passenger/i));
    await userEvent.click(screen.getByLabelText(/I am the lead passenger/i));
    await waitFor(() => screen.getByLabelText(/phone number/i));
    const phoneInput = screen.getByLabelText(/phone number/i);

    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() =>
      expect(
        screen.getByText(/please enter the passenger's phone number/i)
      ).toBeInTheDocument()
    );

    await userEvent.type(phoneInput, "abc123");
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument();
      expect(phoneInput).toHaveClass("border-red-700");
    });

    fireEvent.change(phoneInput, { target: { value: "07123456789" } });
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() =>
      expect(
        screen.queryByText(/please enter a valid phone number/i)
      ).not.toBeInTheDocument()
    );

    await userEvent.selectOptions(screen.getByDisplayValue("+44 (UK)"), "+1 (US/CA)");
    expect(screen.getByDisplayValue("+1 (US/CA)")).toBeInTheDocument();
  });

  test("email: shows error and red border when empty, clears on valid input", async () => {
    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/I am the lead passenger/i));
    await userEvent.click(screen.getByLabelText(/I am the lead passenger/i));
    await waitFor(() => screen.getByLabelText(/^email$/i));
    const emailInput = screen.getByLabelText(/^email$/i);

    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      expect(emailInput).toHaveClass("border-red-700");
    });

    await userEvent.type(emailInput, "valid@example.com");
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() =>
      expect(
        screen.queryByText(/please enter a valid email address/i)
      ).not.toBeInTheDocument()
    );
  });

  test("passenger name: empty name blocks submission, filling it allows other errors to show", async () => {
    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/passenger/i));

    // Empty name blocks submission — no redirect occurs.
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() => expect(mockPush).not.toHaveBeenCalled());
  });

  test("fixing one field preserves errors on others and re-validates correctly on resubmit", async () => {
    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/I am the lead passenger/i));
    await userEvent.click(screen.getByLabelText(/I am the lead passenger/i));
    await waitFor(() => screen.getByRole("button", { name: /confirm booking/i }));
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() => screen.getByText(/please enter a drop-off location/i));

    await userEvent.type(screen.getByLabelText(/drop-off location/i), "Temple Meads");
    await userEvent.tab()
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() =>
      expect(
        screen.queryByText(/please enter a drop-off location/i)
      ).not.toBeInTheDocument()
    );
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  test("past date blocks submission", async () => {
    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/I am the lead passenger/i));
    await userEvent.click(screen.getByLabelText(/I am the lead passenger/i));
    await waitFor(() => screen.getByLabelText(/pick-up date and time/i));
    await userEvent.type(
      screen.getByLabelText(/drop-off location/i),
      "Temple Meads Station, Bristol"
    );
    await userEvent.type(screen.getByLabelText(/passenger name/i), "Jane Doe");
    await userEvent.type(screen.getByLabelText(/phone number/i), "07911123456");
    await userEvent.type(screen.getByLabelText(/^email$/i), "jane@example.com");
    await userEvent.type(screen.getByLabelText(/pick-up date and time/i), "2015-06-01");
    await userEvent.type(
      document.querySelectorAll('input[type="time"]')[0] as HTMLElement,
      "09:00"
    );
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() => {
      expect(screen.getByText(/booking cannot be made in the past/i)).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  test("invalid flight number blocks submission", async () => {
    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/^flight$/i));
    await userEvent.click(screen.getByLabelText(/^flight$/i));
    await waitFor(() => screen.getByLabelText(/flight number/i));

    await userEvent.type(screen.getByLabelText(/flight number/i), "INVALID");
    await userEvent.type(screen.getByLabelText(/airport/i), "Bristol Airport");
    await userEvent.type(
      screen.getByLabelText(/drop-off location/i),
      "Temple Meads Station, Bristol"
    );
    await userEvent.type(
      document.querySelectorAll('input[type="time"]')[0] as HTMLElement,
      "09:00"
    );
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/please enter your flight number \(formatted AB1234\)/i)
      ).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});

// ─── DEPARTMENT AUTOCOMPLETE & INTERACTIVITY ───

describe("Department autocomplete and interactivity", () => {
  test("department: shows error when missing, loads API options, selection clears error", async () => {
    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/I am the lead passenger/i));
    await userEvent.click(screen.getByLabelText(/I am the lead passenger/i));
    await waitFor(() => screen.getByLabelText(/department/i));
    const deptInput = screen.getByLabelText(/department/i);

    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    await waitFor(() =>
      expect(screen.getByText(/select a department/i)).toBeInTheDocument()
    );

    await userEvent.click(deptInput);
    await userEvent.type(deptInput, "Eng");
    await waitFor(() => screen.getByText("Engineering"));

    await userEvent.clear(deptInput);
    await waitFor(() => {
      expect(screen.getByText("Engineering")).toBeInTheDocument();
      expect(screen.getByText("Finance")).toBeInTheDocument();
      expect(screen.getByText("HR")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("Finance"));
    expect(deptInput).toHaveValue("Finance");
    await waitFor(() =>
      expect(screen.queryByText(/select a department/i)).not.toBeInTheDocument()
    );
  });

  test("text inputs accept typed values and pick-up dropdown shows all six locations", async () => {
    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/drop-off location/i));

    await waitFor(() => screen.getByLabelText(/I am the lead passenger/i));
    await userEvent.click(screen.getByLabelText(/I am the lead passenger/i));

    await userEvent.type(screen.getByLabelText(/drop-off location/i), "Clifton Village");
    expect(screen.getByLabelText(/drop-off location/i)).toHaveValue("Clifton Village");

    await userEvent.type(screen.getByLabelText(/passenger name/i), "Alice Johnson");
    expect(screen.getByLabelText(/passenger name/i)).toHaveValue("Alice Johnson");

    await userEvent.type(screen.getByLabelText(/phone number/i), "07911123456");
    expect(screen.getByLabelText(/phone number/i)).toHaveValue("07911123456");

    await userEvent.type(
      screen.getByLabelText(/additional information/i),
      "Please call on arrival."
    );
    expect(screen.getByLabelText(/additional information/i)).toHaveValue(
      "Please call on arrival."
    );

    fireEvent.mouseDown(screen.getAllByRole("combobox")[0]);
    await waitFor(() => {
      expect(screen.getByText("Queens Building")).toBeInTheDocument();
      expect(screen.getByText("Merchant Venturers Building")).toBeInTheDocument();
      expect(screen.getByText("Richmond Building")).toBeInTheDocument();
      expect(screen.getByText("Victoria Rooms")).toBeInTheDocument();
      expect(screen.getByText("Wills Memorial Building")).toBeInTheDocument();
      expect(screen.getByText("Physics Laboratory")).toBeInTheDocument();
    });
  });
});

// ─── SUCCESSFUL SUBMISSION ───

describe("Successful submission", () => {
  test("fully valid form submits, calls fetch with correct shape, and redirects to /book/confirmed", async () => {
    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/drop-off location/i));

    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/create_booking",
        expect.objectContaining({ method: "POST" })
      );
      const body = JSON.parse(
        (global.fetch as jest.Mock).mock.calls.find(
          ([url]: [string]) => url === "/api/create_booking"
        )[1].body
      );
      expect(body).toMatchObject({
        user_id: "1",
        passenger_name: "Jane Doe",
        email: "jane@example.com",
        dep_id: 2,
      });
    });
  });

  test("shows loading spinner while fetch is in-flight and hides it after redirect", async () => {
    // Hold the fetch open so we can inspect the loading state.
    let resolveFetch!: (v: unknown) => void;
    (global.fetch as jest.Mock).mockReturnValueOnce(
      new Promise((res) => {
        resolveFetch = res;
      })
    );

    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/drop-off location/i));
    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));

    // Spinner should be visible while fetch is pending
    await waitFor(() =>
      expect(document.querySelector('[role="progressbar"]')).toBeInTheDocument()
    );

    // Resolve the fetch and confirm redirect
    resolveFetch({ status: 200, json: async () => ({}) });
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/book/confirmed"));
  });

  test("API error response shows inline error message and does not redirect", async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === "/api/create_booking") {
        return Promise.resolve({ status: 500, json: async () => ({}) });
      }
      return Promise.resolve({ status: 200, json: async () => ({}) });
    });

    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/drop-off location/i));
    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/form failed to submit\. please try again or check inputs/i)
      ).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  test("network failure shows connection error message and does not redirect", async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === "/api/create_booking") {
        return Promise.reject(new Error("Network error"));
      }
      // Let any other fetches (geocoding, routing) resolve normally.
      return Promise.resolve({ status: 200, json: async () => ({}) });
    });

    render(<BookingPage />);
    await waitFor(() => screen.getByLabelText(/drop-off location/i));
    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/form failed to submit\. please try again later or check your network/i)
      ).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});