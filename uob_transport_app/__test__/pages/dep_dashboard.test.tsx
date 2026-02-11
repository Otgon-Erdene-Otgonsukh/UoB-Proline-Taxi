import { screen, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "@/app/dep-dashboard/page";

// mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn().mockReturnValue({ status: "authenticated" }),
}));

// mock useRouter
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

global.fetch = jest.fn()

jest.mock("@/app/dep-dashboard/requests", () => ({
  getPendingBookingList: jest.fn().mockResolvedValue({
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
          surname: "Doe",
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
          },
        },
      ],
      totalNum: 1,
    }),
  }),
}));

describe("dashboard page renders correctly", () => {
  test("fetched booking is displayed", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn()
    })

    render(<Dashboard />);

    // Wait for the booking data to load
    await waitFor(() => {
      expect(screen.getByText("Chew Magna")).toBeInTheDocument();
    });

    // The no bookings text should not be displayed
    const noText = screen.queryByText(
      "There are no bookings awaiting approval."
    );
    expect(noText).toBeNull();

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    // Check that booking data is displayed
    const row = screen.getByText('Chew Magna').closest('tr');
    expect(row).toBeInTheDocument();

    // Check buttons are rendered

    const buttons = row!.querySelectorAll("button");
    expect(buttons.length).toBe(3);
  });
});
