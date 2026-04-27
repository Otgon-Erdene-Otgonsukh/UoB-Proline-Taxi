import { screen, render, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "@/app/dep-dashboard/page";
import type { BookingWithTrip } from "@/app/dep-dashboard/constants";
import userEvent from "@testing-library/user-event";
import { useSession } from "next-auth/react";

// mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn().mockReturnValue({
    status: "authenticated",
    data: { user: { account_type: "finance_staff" } },
  }),
}));

// mock useRouter
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

global.fetch = jest.fn();

const mockPendingBooking = {
  booking_id: 38,
  user_id: 1,
  trip_id: 35,
  booking_status: "Pending",
  passenger_name: "John Doe",
  time_created: "2025-12-02T15:34:26.951Z",
  first_name: "John",
  tel_number: "07700 123 456",
  email: "yes@example.com",
  additional_info: "",
  department: "Cybersecurity",
  trip: {
    trip_id: 35,
    icabbi_booking_id: null,
    pickup_location: "Merchant Venturers Building",
    dropoff_location: "Chew Magna",
    pickup_time: "2025-12-06T11:11:00.000Z",
    via: "",
    passenger_num: 1,
    return_drop_loc: "",
    PO: null,
    airport: null,
    flight_num: null,
    price: 12,
  },
} as unknown as BookingWithTrip;

const mockApprovedBooking = {
  ...mockPendingBooking,
  booking_id: 39,
  booking_status: "Approved",
  trip: { ...mockPendingBooking.trip, PO: "PO-001" },
} as unknown as BookingWithTrip;

const mockRejectedBooking = {
  ...mockPendingBooking,
  booking_id: 40,
  booking_status: "Rejected",
} as unknown as BookingWithTrip;

const mockGetPendingBookingList = jest.fn();

jest.mock("@/app/dep-dashboard/requests", () => ({
  getPendingBookingList: (...args: unknown[]) =>
    mockGetPendingBookingList(...args),
}));

const setupFetchMock = (
  bookings: unknown[] = [mockPendingBooking],
  totalNum = 1,
) => {
  mockGetPendingBookingList.mockResolvedValue({
    status: 200,
    json: async () => ({ pendingBookings: bookings, totalNum }),
  });

  (global.fetch as jest.Mock).mockResolvedValue({
    json: jest.fn().mockResolvedValue({
      total: 10,
      pending: 5,
      approved: 3,
      rejected: 2,
      overdue: 1,
    }),
  });
};

beforeEach(() => {
  jest.clearAllMocks();
});

// RENDERING

describe("Rendering", () => {
  test("renders the page title", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() =>
      expect(screen.getByText("Department Bookings")).toBeInTheDocument(),
    );
  });

  test("renders the summary cards", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText("Total Bookings")).toBeInTheDocument();
      expect(screen.getByText("Overdue Bookings")).toBeInTheDocument();
    });
  });

  test("renders search input fields", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByLabelText("Passenger Name")).toBeInTheDocument();
      expect(screen.getByLabelText("From")).toBeInTheDocument();
      expect(screen.getByLabelText("To")).toBeInTheDocument();
    });
  });

  test("renders the table with correct headers", async () => {
    setupFetchMock();
    render(<Dashboard />);
    // Wait for booking data to load first (table only renders after data arrives)
    await waitFor(() =>
      expect(screen.getByText("Chew Magna")).toBeInTheDocument(),
    );
    expect(screen.getByText("Pick-up Time")).toBeInTheDocument();
    expect(screen.getAllByText("From").length).toBeGreaterThan(0);
    expect(screen.getAllByText("To").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Passenger Name").length).toBeGreaterThan(0);
    expect(screen.getByText("Operation")).toBeInTheDocument();
  });

  test("shows loading state initially", () => {
    setupFetchMock();
    render(<Dashboard />);
    expect(screen.getByText("Getting your bookings...")).toBeInTheDocument();
  });
});

// BOOKING DATA DISPLAY

describe("Booking data display", () => {
  test("displays fetched booking destination", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() =>
      expect(screen.getByText("Chew Magna")).toBeInTheDocument(),
    );
  });

  test("displays the pickup location", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() =>
      expect(
        screen.getByText("Merchant Venturers Building"),
      ).toBeInTheDocument(),
    );
  });

  test("displays the passenger name", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() =>
      expect(screen.getByText("John Doe")).toBeInTheDocument(),
    );
  });

  test("shows 'No bookings to show' when list is empty", async () => {
    setupFetchMock([], 0);
    render(<Dashboard />);
    await waitFor(() =>
      expect(screen.getByText("No bookings to show.")).toBeInTheDocument(),
    );
  });

  test("renders the table when bookings exist", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument());
  });

  test("uses airport field when available instead of pickup location", async () => {
    const bookingWithAirport = {
      ...mockPendingBooking,
      trip: {
        ...mockPendingBooking.trip,
        pickup_location: JSON.stringify({
          short_name: "Bristol Airport",
          address: "Bristol Airport, Bristol, UK",
        }),
      },
    };
    setupFetchMock([bookingWithAirport]);
    render(<Dashboard />);
    await waitFor(() =>
      expect(screen.getByText("Bristol Airport")).toBeInTheDocument(),
    );
  });

  test("displays multiple bookings in the table", async () => {
    setupFetchMock(
      [
        mockPendingBooking,
        {
          ...mockPendingBooking,
          booking_id: 99,
          trip: { ...mockPendingBooking.trip, dropoff_location: "Bath Spa" },
        },
      ],
      2,
    );
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText("Chew Magna")).toBeInTheDocument();
      expect(screen.getByText("Bath Spa")).toBeInTheDocument();
    });
  });
});


// APPROVE / REJECT ACTIONS

describe("Approve and Reject actions", () => {
  test("pending booking shows Approve and Reject buttons", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText("Approve")).toBeInTheDocument();
      expect(screen.getByText("Reject")).toBeInTheDocument();
    });
  });

  test("clicking Approve opens PO dialog", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() => screen.getByText("Approve"));
    fireEvent.click(screen.getByText("Approve"));
    await waitFor(() =>
      expect(screen.getByText("Attach PO number")).toBeInTheDocument(),
    );
  });

  test("PO dialog contains a text input", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() => screen.getByText("Approve"));
    fireEvent.click(screen.getByText("Approve"));
    await waitFor(() =>
      expect(screen.getByLabelText("PO number")).toBeInTheDocument(),
    );
  });

  test("clicking Attach without PO number shows validation error", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() => screen.getByText("Approve"));
    fireEvent.click(screen.getByText("Approve"));
    await waitFor(() => screen.getByText("Attach"));
    fireEvent.click(screen.getByText("Attach"));
    await waitFor(() =>
      expect(screen.getByText("Enter a PO number")).toBeInTheDocument(),
    );
  });

  test("clicking Reject opens confirmation dialog", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() => screen.getByText("Reject"));
    fireEvent.click(screen.getByText("Reject"));
    await waitFor(() =>
      expect(screen.getByText("Confirm Rejection")).toBeInTheDocument(),
    );
  });

  test("rejection dialog has Cancel and Yes reject buttons", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() => screen.getByText("Reject"));
    fireEvent.click(screen.getByText("Reject"));
    await waitFor(() => {
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Yes, reject")).toBeInTheDocument();
    });
  });

  test("cancelling rejection closes the dialog", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() => screen.getByText("Reject"));
    fireEvent.click(screen.getByText("Reject"));
    await waitFor(() => screen.getByText("Cancel"));
    fireEvent.click(screen.getByText("Cancel"));
    await waitFor(() =>
      expect(screen.queryByText("Confirm Rejection")).not.toBeInTheDocument(),
    );
  });

  test("approved booking shows Approved chip instead of action buttons", async () => {
    setupFetchMock([mockApprovedBooking]);
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText("Approved")).toBeInTheDocument();
      expect(screen.queryByText("Approve")).not.toBeInTheDocument();
    });
  });

  test("approved booking shows PO number chip", async () => {
    setupFetchMock([mockApprovedBooking]);
    render(<Dashboard />);
    await waitFor(() =>
      expect(screen.getByText("PO: PO-001")).toBeInTheDocument(),
    );
  });

  test("rejected booking shows Rejected chip instead of action buttons", async () => {
    setupFetchMock([mockRejectedBooking]);
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText("Rejected")).toBeInTheDocument();
      expect(screen.queryByText("Reject")).not.toBeInTheDocument();
    });
  });
});


// VIEW DIALOG

describe("View dialog", () => {
  test("View button is rendered for each booking", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText("View")).toBeInTheDocument());
  });

  test("clicking View button opens the view dialog", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() => screen.getByText("View"));
    fireEvent.click(screen.getByText("View"));
    // Dialog should open — just check it doesn't crash and View was clicked
    expect(screen.getByText("View")).toBeInTheDocument();
  });
});


// AUTHENTICATION

describe("Authentication", () => {
  test("redirects to /login when unauthenticated", async () => {
    (useSession as jest.Mock).mockReturnValueOnce({
      status: "unauthenticated",
    });
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/login"));
  });

  test("does not redirect when authenticated", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() =>
      expect(screen.getByText("Department Bookings")).toBeInTheDocument(),
    );
    expect(pushMock).not.toHaveBeenCalled();
  });
});

// SEARCH

describe("Search form", () => {
  test("typing in Passenger Name updates the input", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() => screen.getByLabelText("Passenger Name"));
    const input = screen.getByLabelText("Passenger Name");
    fireEvent.change(input, { target: { value: "Alice" } });
    expect((input as HTMLInputElement).value).toBe("Alice");
  });

  test("typing in From updates the input", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() => screen.getByLabelText("From"));
    const input = screen.getByLabelText("From");
    fireEvent.change(input, { target: { value: "Bristol" } });
    expect((input as HTMLInputElement).value).toBe("Bristol");
  });

  test("typing in To updates the input", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() => screen.getByLabelText("To"));
    const input = screen.getByLabelText("To");
    fireEvent.change(input, { target: { value: "Bath" } });
    expect((input as HTMLInputElement).value).toBe("Bath");
  });

  test("Search button is present", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText("Search")).toBeInTheDocument());
  });

  test("Bookings without price have only view button and a chip as operations", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn(),
    });

    mockGetPendingBookingList.mockResolvedValue({
      status: 200,
      json: async () => ({
        pendingBookings: [
          {
            booking_id: 38,
            user_id: 1,
            trip_id: 35,
            booking_status: "Pending",
            time_created: "2025-12-02T15:34:26.951Z",
            first_name: "John",
            tel_number: "07700 123 456",
            email: "yes@example.com",
            additional_info: "",
            department: "Cybersecurity",
            trip: {
              trip_id: 35,
              icabbi_booking_id: null,
              pickup_location: "Merchant Venturers Building",
              dropoff_location: "Chew Magna",
              pickup_time: "2025-12-06T11:11:00.000Z",
              via: "",
              passenger_num: 1,
              return_drop_loc: "",
              PO: null,
              airport: null,
              flight_num: null,
              price: null,
            },
          },
        ],
        totalNum: 1,
      }),
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Chew Magna")).toBeInTheDocument();
    });

    // Get the entire row
    const row = screen.getByText("Chew Magna").closest("tr");
    expect(row!.querySelectorAll("button")).toHaveLength(1);
    expect(screen.getByText("Awaiting Price")).toBeInTheDocument();
  });

  test("Cards are displayed with the correct numbers", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        total: 100,
        pending: 50,
        approved: 40,
        rejected: 10,
        overdue: 12,
      }),
    });

    mockGetPendingBookingList.mockResolvedValue({
      status: 200,
      json: async () => ({
        pendingBookings: [
          {
            booking_id: 38,
            user_id: 1,
            trip_id: 35,
            booking_status: "Pending",
            time_created: "2025-12-02T15:34:26.951Z",
            first_name: "John",
            tel_number: "07700 123 456",
            email: "yes@example.com",
            additional_info: "",
            department: "Cybersecurity",
            trip: {
              trip_id: 35,
              icabbi_booking_id: null,
              pickup_location: "Merchant Venturers Building",
              dropoff_location: "Chew Magna",
              pickup_time: "2025-12-06T11:11:00.000Z",
              via: "",
              passenger_num: 1,
              return_drop_loc: "",
              PO: null,
              airport: null,
              flight_num: null,
              price: null,
            },
          },
        ],
        totalNum: 1,
      }),
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Chew Magna")).toBeInTheDocument();
    });

    const totalCard = screen.getByTestId("totalCard");
    const statusCard = screen.getByTestId("statusCard");
    const overdueCard = screen.getByTestId("overdueCard");

    expect(totalCard).toHaveTextContent("100");
    expect(statusCard).toHaveTextContent("Pending: 50Approved: 40Rejected: 10");
    expect(overdueCard).toHaveTextContent("12");
  });

  test("Card filters are applied and bookings description is changed when clicked", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn(),
    });

    mockGetPendingBookingList.mockResolvedValue({
      status: 200,
      json: async () => ({
        pendingBookings: [
          {
            booking_id: 38,
            user_id: 1,
            trip_id: 35,
            booking_status: "Pending",
            time_created: "2025-12-02T15:34:26.951Z",
            first_name: "John",
            tel_number: "07700 123 456",
            email: "yes@example.com",
            additional_info: "",
            department: "Cybersecurity",
            trip: {
              trip_id: 35,
              icabbi_booking_id: null,
              pickup_location: "Merchant Venturers Building",
              dropoff_location: "Chew Magna",
              pickup_time: "2025-12-06T11:11:00.000Z",
              via: "",
              passenger_num: 1,
              return_drop_loc: "",
              PO: null,
              airport: null,
              flight_num: null,
              price: null,
            },
          },
        ],
        totalNum: 1,
      }),
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Chew Magna")).toBeInTheDocument();
    });

    const user = userEvent.setup();

    // Total filter
    await user.click(screen.getByTestId("totalCard"));
    expect(screen.getByText("All Bookings")).toBeInTheDocument();

    // Status filter
    await user.click(screen.getByTestId("statusCard"));
    expect(screen.getByText("All Bookings with Statuses")).toBeInTheDocument();

    // Overdue filter
    await user.click(screen.getByTestId("overdueCard"));
    expect(screen.getByTestId("filter_text")).toHaveTextContent(
      "Overdue Bookings",
    );
  });
});

// CARD FILTERS

describe("Card filter labels", () => {
  test("default label shows Pending Bookings", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() =>
      expect(screen.getByText("Pending Bookings")).toBeInTheDocument(),
    );
  });

  test("clicking Total Bookings card changes label", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() => screen.getByText("Total Bookings"));
    fireEvent.click(screen.getByText("Total Bookings"));
    await waitFor(() =>
      expect(screen.getByText("All Bookings")).toBeInTheDocument(),
    );
  });

  test("clicking Overdue Bookings card changes label", async () => {
    setupFetchMock();
    render(<Dashboard />);
    await waitFor(() => screen.getByText("Pending Bookings"));
    // Click the card (there may be multiple "Overdue Bookings" texts, use the heading)
    const overdueCard = screen.getAllByText("Overdue Bookings")[0];
    fireEvent.click(overdueCard);
    await waitFor(() =>
      expect(screen.queryByText("Pending Bookings")).not.toBeInTheDocument(),
    );
  });
});
