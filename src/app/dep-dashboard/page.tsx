"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import type {
  booking,
  trip,
  User,
  department,
} from "@/generated/prisma/client"; // importing just the type is safe and does not expose any prisma code

type BookingWithTrip = booking & {
  // creating a custom type to access the data
  trip: trip;
  User: User & { department: department };
};

export default function DepDashboard() {
  const [pendingBookings, setPendingBookings] = useState<BookingWithTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("api/get_pending_bookings")
      .then((res) => res.json())
      .then((data) => {
        setPendingBookings(data);
        setIsLoading(false);
      });
  }, []);

  const [selectedBooking, setSelectedBooking] =
    useState<BookingWithTrip | null>(null);

  const handleViewOpen = (booking: BookingWithTrip) => {
    setSelectedBooking(booking);
  };

  const handleViewClose = () => {
    setSelectedBooking(null);
  };

  // mapping over the booking records until id matches and update the status
  const handleApprove = (bookingId: number) => {
    setPendingBookings((prev) =>
      prev.map((b) =>
        b.booking_id === bookingId ? { ...b, booking_status: "Approved" } : b
      )
    );
    fetch("api/update_booking", {
      method: "POST",
      body: JSON.stringify({ bookingId: bookingId, newStatus: "Approved" }),
    });
  };

  const handleReject = (bookingId: number) => {
    setPendingBookings((prev) =>
      prev.map((b) =>
        b.booking_id === bookingId ? { ...b, booking_status: "Rejected" } : b
      )
    );
    fetch("api/update_booking", {
      method: "POST",
      body: JSON.stringify({ bookingId: bookingId, newStatus: "Rejected" }),
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 w-full max-w-6xl mb-8 -mt-2">
        <div>
          <h1 className="text-2xl font-aleo md:text-3xl font-semibold text-shadow-lg/20">
            Department Bookings
          </h1>
        </div>
        {pendingBookings.length === 0 ? (
          <div className="text-center py-15 font-inter text-gray-400">
            {isLoading
              ? "Loading..."
              : "There are no bookings awaiting approval."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="border-collapse w-full mt-10">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border-2 border-gray-900 px-4 py-3 font-bold text-gray-900 text-lg">
                    Time Created
                  </th>
                  <th className="border-2 border-gray-900 px-4 py-3 font-bold text-gray-900 text-lg">
                    From
                  </th>
                  <th className="border-2 border-gray-900 px-4 py-3 font-bold text-gray-900 text-lg">
                    To
                  </th>
                  <th className="border-2 border-gray-900 px-4 py-3 font-bold text-gray-900 text-lg">
                    Operation
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingBookings.map((e) => {
                  return (
                    <tr
                      key={e.booking_id}
                      className="hover:bg-gray-50 transition-colors text-center"
                    >
                      <td className="border-2 border-gray-900 px-4 py-3 text-md">
                        {e.time_created
                          ? new Date(e.time_created).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="border-2 border-gray-900 px-4 py-3 text-md">
                        {e.trip.pickup_location}
                      </td>
                      <td className="border-2 border-gray-900 px-4 py-3 text-md">
                        {e.trip.dropoff_location}
                      </td>
                      <td className="border-2 border-gray-900 px-4 py-3 text-md">
                        {e.booking_status === "Approved" ? (
                          <div className="flex flex-row justify-evenly items-center">
                            <button
                              className="bg-[#585858] text-white py-1.5 px-4 rounded-md hover:scale-105 hover:bg-cyan-700 duration-200 transition-all cursor-pointer"
                              onClick={() => handleViewOpen(e)}
                            >
                              View
                            </button>
                            <span className="inline-block px-10 py-1 rounded-full text-xs font-medium bg-green-200 text-green-800">
                              Approved
                            </span>
                          </div>
                        ) : e.booking_status === "Rejected" ? (
                          <div className="flex flex-row justify-evenly items-center">
                            <button
                              className="bg-[#585858] text-white py-1.5 px-4 rounded-md hover:scale-105 hover:bg-cyan-700 duration-200 transition-all cursor-pointer"
                              onClick={() => handleViewOpen(e)}
                            >
                              View
                            </button>
                            <span className="inline-block px-10 py-1 rounded-full text-xs font-medium bg-red-200 text-red-800">
                              Rejected
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-row justify-evenly">
                            <button
                              className="bg-[#585858] text-white py-1.5 px-4 rounded-md hover:scale-105 hover:bg-cyan-700 duration-200 transition-all cursor-pointer"
                              onClick={() => handleViewOpen(e)}
                            >
                              View
                            </button>
                            <button
                              className="bg-[#2c2c2c] text-white py-1.5 px-4 rounded-md hover:bg-green-400 hover:scale-105 transition-all duration-200 cursor-pointer"
                              onClick={() => handleApprove(e.booking_id)}
                            >
                              Approve
                            </button>
                            <button
                              className="border-[#2c2c2c] py-1.5 px-4 border-2 rounded-md hover:scale-105 hover:bg-red-400 transition-all cursor-pointer"
                              onClick={() => handleReject(e.booking_id)}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <Dialog
          open={selectedBooking !== null}
          onClose={handleViewClose}
          aria-labelledby="label"
          aria-describedby="description"
        >
          <DialogTitle
            id="label"
            sx={{
              color: "white",
              textAlign: "center",
              fontSize: 30,
              fontWeight: "bold",
              font: "aleo",
              bgcolor: "#2c2c2c",
            }}
          >
            Booking Detail
          </DialogTitle>
          <DialogContent id="desscription">
            {selectedBooking && (
              <>
                <div className="flex flex-col gap-2 mt-8">
                  <h1 className="text-xl font-semibold font-inter">
                    Information about passenger:
                  </h1>
                  <h3>
                    <strong>First name</strong>: {selectedBooking.first_name}
                  </h3>
                  <h3>
                    <strong>Last name</strong>: {selectedBooking.surname}
                  </h3>
                  <h3>
                    <strong>Phone number</strong>:{" "}
                    {selectedBooking.tel_number}
                  </h3>
                  <h3>
                    <strong>Department</strong>:{" "}
                    {selectedBooking.User.department.dep_name}
                  </h3>
                </div>
                <div className="flex flex-col gap-2 mt-7">
                  <h1 className="text-xl font-semibold font-inter">
                    Information about booking:
                  </h1>
                  <h3>
                    <strong>Time Created</strong>:{" "}
                    {selectedBooking.time_created
                      ? new Date(selectedBooking.time_created).toLocaleString()
                      : "N/A"}
                  </h3>
                  <h3>
                    <strong>From</strong>:{" "}
                    {selectedBooking.trip.pickup_location}
                  </h3>
                  <h3>
                    <strong>Coordinates</strong>:{" "}
                    {selectedBooking.trip.pickup_latitude},{" "}
                    {selectedBooking.trip.pickup_longitude}
                  </h3>
                  <h3>
                    <strong>To</strong>: {selectedBooking.trip.dropoff_location}
                  </h3>
                  <h3>
                    <strong>Coordinates</strong>:{" "}
                    {selectedBooking.trip.dropoff_latitude},{" "}
                    {selectedBooking.trip.dropoff_longitude}
                  </h3>
                  <h3>
                    <strong>Additional Info</strong>:{" "}
                    {selectedBooking.additional_info}
                  </h3>
                  <h3>
                    <strong>Status</strong>:{" "}
                    {selectedBooking.booking_status === "Approved" ? (
                      <span className="inline-block px-10 py-1 rounded-full text-xs font-medium border border-green-800 bg-green-200 text-green-800">
                        Approved
                      </span>
                    ) : selectedBooking.booking_status === "Rejected" ? (
                      <span className="inline-block px-10 py-1 rounded-full text-xs font-medium border border-red-800 bg-red-200 text-red-800">
                        Rejected
                      </span>
                    ) : (
                      <span className="inline-block px-10 py-1 rounded-full text-xs font-medium border border-yellow-800 bg-yellow-200 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </h3>
                </div>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleViewClose}
              sx={{
                mr: 2,
                mt: 2,
                mb: 1,
                color: "#2c2c2c",
                ":hover": {
                  bgcolor: "#2c2c2c",
                  color: "white",
                  transition: "all",
                  transitionDuration: 200,
                },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
