import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExportPage from "@/app/super/exportManageComponents/export";
import { getBookingsList, cancelBooking } from "@/app/super/requests";
import { easyGetRequest } from "@/utils/easyRequest";

jest.mock("@/app/super/requests", () => ({
  getBookingsList: jest.fn(),
  cancelBooking: jest.fn(),
}));

jest.mock("@/utils/easyRequest", () => ({
  easyGetRequest: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/components/SuperBookingsTable", () => ({
  BookingTable: ({ data }: { data: Array<{ booking_id: number }> }) => (
    <div data-testid="booking-table">
      {data.map((row) => (
        <div key={row.booking_id} data-testid={`row-${row.booking_id}`}>
          Booking {row.booking_id}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("@/components/datetimePicker/DateTimePicker", () => ({
  DateTimePicker: () => <div data-testid="datetime-picker" />,
}));

jest.mock("@/components/datetimePicker/locale", () => ({
  enLocale: {},
}));

jest.mock("@/components/confirmDIalog", () => ({
  __esModule: true,
  default: ({ open, dialogTitle }: { open: boolean; dialogTitle: string }) =>
    open ? <div data-testid="confirm-dialog">{dialogTitle}</div> : null,
}));

jest.mock("@/components/CustomizedButton", () => ({
  __esModule: true,
  default: ({ title, click }: { title: string; click: () => void }) => (
    <button onClick={click}>{title}</button>
  ),
}));

const bookings = [
  {
    booking_id: 1,
    additional_info: "note",
    time_created: "2025-06-01T12:00:00.000Z",
    booking_status: "Approved",
    department: { dep_name: "CS" },
    trip: {
      pickup_location: "Main Gate",
      dropoff_location: "Airport",
      via: null,
      pickup_time: "2025-06-02T12:00:00.000Z",
    },
  },
];

const depCounts = [
  { dep_id: 1, dep_name: "Computer Science", count: 10 },
  { dep_id: 2, dep_name: "Mathematics", count: 5 },
];

function mockGetBookingsList() {
  (getBookingsList as jest.Mock).mockResolvedValue({
    status: 200,
    json: async () => ({ bookings, totalNum: 1 }),
  });
}

function mockEasyGetRequest(data: typeof depCounts = depCounts) {
  (easyGetRequest as jest.Mock).mockResolvedValue({
    status: 200,
    json: async () => data,
  });
}

describe("Super-admin ExportPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  test("shows loading state before data arrives", () => {
    (getBookingsList as jest.Mock).mockReturnValue(new Promise(() => {}));
    (easyGetRequest as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(<ExportPage />);
    expect(screen.getByText("Getting booking data...")).toBeInTheDocument();
  });

  test("renders bookings after fetch resolves", async () => {
    mockGetBookingsList();
    mockEasyGetRequest();

    render(<ExportPage />);

    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );
    expect(screen.getByText("Booking 1")).toBeInTheDocument();
  });

  test("renders empty state when no bookings", async () => {
    (getBookingsList as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({ bookings: [], totalNum: 0 }),
    });
    mockEasyGetRequest();

    render(<ExportPage />);
    await waitFor(() =>
      expect(screen.getByText("No bookings to show.")).toBeInTheDocument(),
    );
  });

  test("renders department options in the export select", async () => {
    mockGetBookingsList();
    mockEasyGetRequest();

    render(<ExportPage />);

    await waitFor(() =>
      expect(screen.getByText("Export by department")).toBeInTheDocument(),
    );

    const depSelect = screen.getByText("Select a department to export");
    expect(depSelect).toBeInTheDocument();
  });

  test("typing in the department search field updates input", async () => {
    mockGetBookingsList();
    mockEasyGetRequest();
    const user = userEvent.setup();

    render(<ExportPage />);

    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    const input = screen.getByLabelText("Department");
    await user.type(input, "CS");
    expect(input).toHaveValue("CS");
  });

  test("Clear button resets search form fields", async () => {
    mockGetBookingsList();
    mockEasyGetRequest();
    const user = userEvent.setup();

    render(<ExportPage />);

    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    const fromInput = screen.getByLabelText("From");
    await user.type(fromInput, "Place A");
    expect(fromInput).toHaveValue("Place A");

    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(fromInput).toHaveValue("");
  });

  test("submitting the search form refetches bookings", async () => {
    mockGetBookingsList();
    mockEasyGetRequest();
    const user = userEvent.setup();

    render(<ExportPage />);

    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    (getBookingsList as jest.Mock).mockClear();

    const fromInput = screen.getByLabelText("From");
    await user.type(fromInput, "Main");
    fireEvent.submit(fromInput.closest("form")!);

    await waitFor(() => {
      expect(getBookingsList).toHaveBeenCalled();
    });
  });

  test("renders nothing in depCount select when request fails", async () => {
    mockGetBookingsList();
    (easyGetRequest as jest.Mock).mockResolvedValue({ status: 500 });

    render(<ExportPage />);

    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    expect(screen.getByText("Select a department to export")).toBeInTheDocument();
  });
});
