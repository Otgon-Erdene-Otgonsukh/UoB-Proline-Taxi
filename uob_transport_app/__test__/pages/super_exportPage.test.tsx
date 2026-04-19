import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExportPage from "@/app/super/exportManageComponents/export";
import { getBookingsList, cancelBooking } from "@/app/super/requests";
import { easyGetRequest } from "@/utils/easyRequest";
import { redirect } from "next/navigation";

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

type BookingTableMockProps = {
  data: Array<{ booking_id: number }>;
  count: number;
  page: number;
  pageSize: number;
  onPageChange: (e: unknown, newPage: number) => void;
  onPageSizeChange: (e: { target: { value: string } }) => void;
  onViewDetails: (row: unknown) => void;
  onEditBooking: (row: unknown) => void;
  onCancelBooking: (row: unknown) => void;
  onPriceAttached: () => void;
  openSnackBar: () => void;
  handleCheck: (id: number) => void;
  handleCheckAll: (checked: boolean) => void;
  selectedBookingIds: number[];
  allChecked: boolean;
  ActionsComponent: React.ComponentType<{
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
      e: React.MouseEvent<HTMLButtonElement>,
      p: number,
    ) => void;
  }>;
};

jest.mock("@/components/SuperBookingsTable", () => ({
  BookingTable: (props: BookingTableMockProps) => {
    const {
      data,
      count,
      page,
      pageSize,
      onPageChange,
      onPageSizeChange,
      onViewDetails,
      onEditBooking,
      onCancelBooking,
      onPriceAttached,
      openSnackBar,
      handleCheck,
      handleCheckAll,
      selectedBookingIds,
      allChecked,
      ActionsComponent,
    } = props;
    return (
      <div data-testid="booking-table">
        <div data-testid="allChecked">{String(allChecked)}</div>
        <div data-testid="selectedIds">{selectedBookingIds.join(",")}</div>
        {data.map((row) => (
          <div key={row.booking_id} data-testid={`row-${row.booking_id}`}>
            Booking {row.booking_id}
            <button onClick={() => onViewDetails(row)}>view-{row.booking_id}</button>
            <button onClick={() => onEditBooking(row)}>edit-{row.booking_id}</button>
            <button onClick={() => onCancelBooking(row)}>cancel-{row.booking_id}</button>
            <button onClick={() => handleCheck(row.booking_id)}>check-{row.booking_id}</button>
          </div>
        ))}
        <button onClick={() => handleCheckAll(true)}>check-all-on</button>
        <button onClick={() => handleCheckAll(false)}>check-all-off</button>
        <button onClick={onPriceAttached}>price-attached</button>
        <button onClick={openSnackBar}>open-snackbar</button>
        <button
          onClick={(e) =>
            onPageChange(
              e as unknown as React.MouseEvent<HTMLButtonElement>,
              1,
            )
          }
        >
          page-change
        </button>
        <button
          onClick={() => onPageSizeChange({ target: { value: "25" } })}
        >
          page-size-change
        </button>
        <div data-testid="actions">
          <ActionsComponent
            count={count}
            page={page}
            rowsPerPage={pageSize}
            onPageChange={
              onPageChange as (
                e: React.MouseEvent<HTMLButtonElement>,
                p: number,
              ) => void
            }
          />
        </div>
      </div>
    );
  },
}));

jest.mock("@/components/datetimePicker/DateTimePicker", () => ({
  DateTimePicker: ({
    open,
    onClose,
    onDateChange,
  }: {
    open: boolean;
    onClose: () => void;
    onDateChange: (d: Date) => void;
  }) =>
    open ? (
      <div data-testid="datetime-picker">
        <button onClick={() => onDateChange(new Date("2025-07-01T10:00:00Z"))}>
          pick-date
        </button>
        <button onClick={onClose}>close-picker</button>
      </div>
    ) : null,
}));

jest.mock("@/components/datetimePicker/locale", () => ({
  enLocale: {},
}));

jest.mock("@/components/confirmDIalog", () => ({
  __esModule: true,
  default: ({
    open,
    dialogTitle,
    confirmCallBack,
    cancelCallBack,
  }: {
    open: boolean;
    dialogTitle: string;
    confirmCallBack: () => void;
    cancelCallBack: () => void;
  }) =>
    open ? (
      <div data-testid="confirm-dialog">
        {dialogTitle}
        <button onClick={confirmCallBack}>confirm-cancel</button>
        <button onClick={cancelCallBack}>reject-cancel</button>
      </div>
    ) : null,
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
  {
    booking_id: 2,
    additional_info: "",
    time_created: "2025-06-02T12:00:00.000Z",
    booking_status: "Pending",
    department: { dep_name: "Math" },
    trip: {
      pickup_location: JSON.stringify({
        short_name: "Library",
        address: "Some Rd, Area, City, Region, UK",
      }),
      dropoff_location: JSON.stringify({
        short_name: "Heathrow Airport",
        address: "airport rd",
      }),
      via: JSON.stringify([
        { short_name: "Stop A", address: "r1, a, b, c, City, UK" },
        { short_name: "Heathrow Airport", address: "airport rd" },
      ]),
      pickup_time: "2025-06-03T12:00:00.000Z",
    },
  },
];

const depCounts = [
  { dep_id: 1, dep_name: "Computer Science", count: 10 },
  { dep_id: 2, dep_name: "Mathematics", count: 5 },
];

function mockGetBookingsList(
  payload: { bookings: typeof bookings; totalNum: number } = {
    bookings,
    totalNum: 1,
  },
) {
  (getBookingsList as jest.Mock).mockResolvedValue({
    status: 200,
    json: async () => payload,
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
    global.URL.createObjectURL = jest.fn(() => "blob:url");
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

  test("handleCheck toggles a booking id on and off", async () => {
    mockGetBookingsList();
    mockEasyGetRequest();
    const user = userEvent.setup();

    render(<ExportPage />);
    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    await user.click(screen.getByText("check-1"));
    await waitFor(() =>
      expect(screen.getByTestId("selectedIds")).toHaveTextContent("1"),
    );

    await user.click(screen.getByText("check-1"));
    await waitFor(() =>
      expect(screen.getByTestId("selectedIds")).toHaveTextContent(""),
    );
  });

  test("onEditBooking triggers redirect", async () => {
    mockGetBookingsList();
    mockEasyGetRequest();
    const user = userEvent.setup();

    render(<ExportPage />);
    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    await user.click(screen.getByText("edit-1"));
    expect(redirect).toHaveBeenCalledWith("/book?update=1");
  });

  test("onCancelBooking opens confirm dialog, confirm calls cancelBooking", async () => {
    mockGetBookingsList();
    mockEasyGetRequest();
    (cancelBooking as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({ ok: true }),
    });
    const user = userEvent.setup();

    render(<ExportPage />);
    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    await user.click(screen.getByText("cancel-1"));
    expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument();

    await user.click(screen.getByText("confirm-cancel"));

    await waitFor(() => {
      expect(cancelBooking).toHaveBeenCalledWith(1);
    });
  });

  test("confirm dialog reject closes without calling cancelBooking", async () => {
    mockGetBookingsList();
    mockEasyGetRequest();
    const user = userEvent.setup();

    render(<ExportPage />);
    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    await user.click(screen.getByText("cancel-1"));
    await user.click(screen.getByText("reject-cancel"));

    await waitFor(() =>
      expect(screen.queryByTestId("confirm-dialog")).not.toBeInTheDocument(),
    );
    expect(cancelBooking).not.toHaveBeenCalled();
  });

  test("onPriceAttached triggers refetch; openSnackBar shows snackbar", async () => {
    mockGetBookingsList();
    mockEasyGetRequest();
    const user = userEvent.setup();

    render(<ExportPage />);
    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    (getBookingsList as jest.Mock).mockClear();
    await user.click(screen.getByText("price-attached"));
    await waitFor(() => {
      expect(getBookingsList).toHaveBeenCalled();
    });

    await user.click(screen.getByText("open-snackbar"));
    expect(
      await screen.findByText("Price has been successfully attached."),
    ).toBeInTheDocument();
  });

  test("page size change triggers refetch with new size", async () => {
    mockGetBookingsList();
    mockEasyGetRequest();
    const user = userEvent.setup();

    render(<ExportPage />);
    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    (getBookingsList as jest.Mock).mockClear();
    await user.click(screen.getByText("page-size-change"));

    await waitFor(() => {
      expect(getBookingsList).toHaveBeenCalledWith(
        0,
        25,
        true,
        expect.any(Object),
      );
    });
  });

  test("page change handler refetches and keeps page size", async () => {
    mockGetBookingsList({ bookings, totalNum: 50 });
    mockEasyGetRequest();
    const user = userEvent.setup();

    render(<ExportPage />);
    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    (getBookingsList as jest.Mock).mockClear();
    await user.click(screen.getByText("page-change"));

    await waitFor(() => {
      expect(getBookingsList).toHaveBeenCalledWith(
        1,
        10,
        true,
        expect.any(Object),
      );
    });
  });

  test("TablePaginationActions disables prev/first on first page, enables next/last", async () => {
    mockGetBookingsList({ bookings, totalNum: 50 });
    mockEasyGetRequest();

    render(<ExportPage />);
    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    expect(screen.getByLabelText("first page")).toBeDisabled();
    expect(screen.getByLabelText("previous page")).toBeDisabled();
    expect(screen.getByLabelText("next page")).not.toBeDisabled();
    expect(screen.getByLabelText("last page")).not.toBeDisabled();
  });

  test("selecting a department enables export and handleDepartmentExport fires", async () => {
    mockGetBookingsList();
    mockEasyGetRequest();
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      blob: async () => new Blob(["csv"], { type: "text/csv" }),
    });
    const user = userEvent.setup();

    render(<ExportPage />);
    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    const depSelect = screen.getByText("Select a department to export");
    await user.click(depSelect);
    const option = await screen.findByRole("option", {
      name: /Computer Science/,
    });
    await user.click(option);

    const exportBtn = screen.getByLabelText(
      "Export all Computer Science bookings",
    );
    await user.click(exportBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/export_bookings",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });

  test("handleCheckAll=true fetches ids and marks allChecked", async () => {
    mockGetBookingsList();
    mockEasyGetRequest();
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => [1, 2, 3],
    });
    const user = userEvent.setup();

    render(<ExportPage />);
    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    await user.click(screen.getByText("check-all-on"));

    await waitFor(() =>
      expect(screen.getByTestId("allChecked")).toHaveTextContent("true"),
    );
    expect(screen.getByTestId("selectedIds")).toHaveTextContent("1,2,3");
  });

  test("handleCheckAll=false clears selection", async () => {
    mockGetBookingsList();
    mockEasyGetRequest();
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => [1, 2],
    });
    const user = userEvent.setup();

    render(<ExportPage />);
    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    await user.click(screen.getByText("check-all-on"));
    await waitFor(() =>
      expect(screen.getByTestId("allChecked")).toHaveTextContent("true"),
    );

    await user.click(screen.getByText("check-all-off"));
    expect(screen.getByTestId("allChecked")).toHaveTextContent("false");
    expect(screen.getByTestId("selectedIds")).toHaveTextContent("");
  });

  test("handleSelectedExport sends selected booking ids", async () => {
    mockGetBookingsList();
    mockEasyGetRequest();
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      blob: async () => new Blob(["csv"], { type: "text/csv" }),
    });
    const user = userEvent.setup();

    render(<ExportPage />);
    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    await user.click(screen.getByText("check-1"));
    await user.click(screen.getByLabelText("Export selected bookings"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/export_bookings",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });

  test("Clear-selected button in ready-to-export panel resets selection", async () => {
    mockGetBookingsList();
    mockEasyGetRequest();
    const user = userEvent.setup();

    render(<ExportPage />);
    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    await user.click(screen.getByText("check-1"));
    const clearButtons = await screen.findAllByRole("button", {
      name: "Clear",
    });
    // The second "Clear" button sits in the "Ready to export" panel
    await user.click(clearButtons[clearButtons.length - 1]);

    expect(screen.getByTestId("selectedIds")).toHaveTextContent("");
  });

  test("changing booking status select triggers refetch", async () => {
    mockGetBookingsList();
    mockEasyGetRequest();
    const user = userEvent.setup();

    render(<ExportPage />);
    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    (getBookingsList as jest.Mock).mockClear();

    const statusSelect = screen.getByLabelText("Booking Status");
    await user.click(statusSelect);
    const approved = await screen.findByRole("option", { name: "Approved" });
    await user.click(approved);

    await waitFor(() => {
      expect(getBookingsList).toHaveBeenCalled();
    });
  });

  test("onViewDetails opens booking detail dialog with formatted locations", async () => {
    mockGetBookingsList({ bookings, totalNum: 2 });
    mockEasyGetRequest();
    const user = userEvent.setup();

    render(<ExportPage />);
    await screen.findByTestId("row-1");
    await screen.findByTestId("row-2");

    await user.click(screen.getByText("view-2"));

    expect(await screen.findByText("Booking Detail")).toBeInTheDocument();
    expect(screen.getByText(/Library/)).toBeInTheDocument();
    // Airport short-circuit paths
    expect(screen.getAllByText(/Heathrow Airport/).length).toBeGreaterThan(0);
  });

  test("booking detail close button closes the dialog", async () => {
    mockGetBookingsList();
    mockEasyGetRequest();
    const user = userEvent.setup();

    render(<ExportPage />);
    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    await user.click(screen.getByText("view-1"));
    expect(await screen.findByText("Booking Detail")).toBeInTheDocument();

    const closeBtn = screen.getAllByRole("button", { name: "Close" })[0];
    await user.click(closeBtn);

    await waitFor(() =>
      expect(screen.queryByText("Booking Detail")).not.toBeInTheDocument(),
    );
  });

  test("date picker From sets date and shows banner on submit", async () => {
    mockGetBookingsList();
    mockEasyGetRequest();
    const user = userEvent.setup();

    render(<ExportPage />);
    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText("Pick Up Date From"));
    expect(screen.getByTestId("datetime-picker")).toBeInTheDocument();
    await user.click(screen.getByText("pick-date"));
    await user.click(screen.getByText("close-picker"));

    const form = screen.getByLabelText("From").closest("form")!;
    fireEvent.submit(form);

    await waitFor(() =>
      expect(screen.getByText(/Showing Bookings from/)).toBeInTheDocument(),
    );
  });

  test("date picker To sets date and shows up-to banner on submit", async () => {
    mockGetBookingsList();
    mockEasyGetRequest();
    const user = userEvent.setup();

    render(<ExportPage />);
    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText("Pick Up Date To"));
    await user.click(screen.getByText("pick-date"));
    await user.click(screen.getByText("close-picker"));

    const form = screen.getByLabelText("From").closest("form")!;
    fireEvent.submit(form);

    await waitFor(() =>
      expect(screen.getByText(/Showing Bookings up to/)).toBeInTheDocument(),
    );
  });

  test("clicking last/first/next/prev pagination buttons all call page handler", async () => {
    mockGetBookingsList({ bookings, totalNum: 50 });
    mockEasyGetRequest();
    const user = userEvent.setup();

    render(<ExportPage />);
    await waitFor(() =>
      expect(screen.getByTestId("row-1")).toBeInTheDocument(),
    );

    (getBookingsList as jest.Mock).mockClear();
    await user.click(screen.getByLabelText("next page"));
    await waitFor(() => expect(getBookingsList).toHaveBeenCalled());

    (getBookingsList as jest.Mock).mockClear();
    await user.click(screen.getByLabelText("last page"));
    await waitFor(() => expect(getBookingsList).toHaveBeenCalled());

    (getBookingsList as jest.Mock).mockClear();
    await user.click(screen.getByLabelText("previous page"));
    await waitFor(() => expect(getBookingsList).toHaveBeenCalled());

    (getBookingsList as jest.Mock).mockClear();
    await user.click(screen.getByLabelText("first page"));
    await waitFor(() => expect(getBookingsList).toHaveBeenCalled());
  });
});
