import { screen, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "@/app/dep-dashboard/page";
import { getPendingBookingList } from "@/app/dep-dashboard/requests";
import userEvent from "@testing-library/user-event";

// mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest
    .fn()
    .mockReturnValue({
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

jest.mock("@/app/dep-dashboard/requests", () => ({
  getPendingBookingList: jest.fn(),
}));

describe("dashboard page renders correctly", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetched booking is displayed", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn(),
    });

    (getPendingBookingList as jest.Mock).mockResolvedValue({
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
              price: 12,
            },
          },
        ],
        totalNum: 1,
      }),
    });

    render(<Dashboard />);

    // Wait for the booking data to load
    await waitFor(() => {
      expect(screen.getByText("Chew Magna")).toBeInTheDocument();
    });

    // The no bookings text should not be displayed
    const noText = screen.queryByText(
      "There are no bookings awaiting approval.",
    );
    expect(noText).toBeNull();

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    // Check that booking data is displayed
    const row = screen.getByText("Chew Magna").closest("tr");
    expect(row).toBeInTheDocument();

    // Check buttons are rendered

    const buttons = row!.querySelectorAll("button");
    expect(buttons.length).toBe(3);
  });

  test("Bookings without price have only view button and a chip as operations", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn(),
    });

    (getPendingBookingList as jest.Mock).mockResolvedValue({
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

    (getPendingBookingList as jest.Mock).mockResolvedValue({
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

    (getPendingBookingList as jest.Mock).mockResolvedValue({
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
