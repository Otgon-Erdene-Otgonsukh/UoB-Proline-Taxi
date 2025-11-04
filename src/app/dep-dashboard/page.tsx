"use client";

import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

// to be removed but for now used as stock booking data
type BookingRecord = {
  id: number;
  name: string;
  lastName: string;
  department: string;
  phoneNumber: string;
  timeCreated: string;
  from: Location;
  to: Location;
  bookingStatus: BookingStatus;
};

type Location = {
  name: string;
  longitude: string;
  latitude: string;
};

type BookingStatus = "Approved" | "Rejected" | "Pending";

export default function DepDashboard() {
    // put the whole booking record in a stateful variable so we can change the status
  const [bookings, setBookings] = useState<BookingRecord[]>([
    {
      id: 1,
      name: "John",
      lastName: "Smith",
      department: "Computer Science",
      phoneNumber: "+44 7700 900123",
      timeCreated: "2025-10-18 19:39:23",
      from: {
        name: "Merchand Venturer's Building",
        longitude: "51.456135536468345",
        latitude: "-2.6031069746564572",
      },
      to: {
        name: "Will's Memorial",
        longitude: "51.45629453609578",
        latitude: "-2.604629732327902",
      },
      bookingStatus: "Pending",
    },
    {
      id: 2,
      name: "Emma",
      lastName: "Johnson",
      department: "Physics",
      phoneNumber: "+44 7700 900456",
      timeCreated: "2025-10-18 19:40:23",
      from: {
        name: "Physics Building",
        longitude: "51.45898708443594",
        latitude: "-2.6021663169848677",
      },
      to: {
        name: "Victoria Rooms",
        longitude: "51.45839341614687",
        latitude: "-2.609458972806376",
      },
      bookingStatus: "Pending",
    },
    {
      id: 3,
      name: "Michael",
      lastName: "Brown",
      department: "Chemistry",
      phoneNumber: "+44 7700 900789",
      timeCreated: "2025-10-18 19:39:23",
      from: {
        name: "Queen's Building",
        longitude: "43.1232322323242",
        latitude: "-2.8762387468762",
      },
      to: {
        name: "Chemistry Building",
        longitude: "34.34343454241123",
        latitude: "-1.23232435343243",
      },
      bookingStatus: "Pending",
    },
  ]);

  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(
    null
  );

  const handleViewOpen = (booking: BookingRecord) => {
    setSelectedBooking(booking);
  };

  const handleViewClose = () => {
    setSelectedBooking(null);
  };

  // mapping over the booking records until id matches and update the status
  const handleApprove = (bookingId: number) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, bookingStatus: "Approved" } : b
      )
    );
  };

  const handleReject = (bookingId: number) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, bookingStatus: "Rejected" } : b
      )
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 w-full max-w-6xl mb-8 -mt-2">
        <div>
          <h1 className="text-2xl font-aleo md:text-3xl font-semibold text-shadow-lg/20">
            Department Bookings
          </h1>
        </div>
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
              {bookings.map((e) => {
                return (
                  <tr
                    key={e.id}
                    className="hover:bg-gray-50 transition-colors text-center"
                  >
                    <td className="border-2 border-gray-900 px-4 py-3 text-md">
                      {e.timeCreated}
                    </td>
                    <td className="border-2 border-gray-900 px-4 py-3 text-md">
                      {e.from.name}
                    </td>
                    <td className="border-2 border-gray-900 px-4 py-3 text-md">
                      {e.to.name}
                    </td>
                    <td className="border-2 border-gray-900 px-4 py-3 text-md">
                      {e.bookingStatus === "Approved" ? (
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
                      ) : e.bookingStatus === "Rejected" ? (
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
                            onClick={() => handleApprove(e.id)}
                          >
                            Approve
                          </button>
                          <button
                            className="border-[#2c2c2c] py-1.5 px-4 border-2 rounded-md hover:scale-105 hover:bg-red-400 transition-all cursor-pointer"
                            onClick={() => handleReject(e.id)}
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
          <DialogContent id="description">
            {selectedBooking && (
              <>
                <div className="flex flex-col gap-2 mt-8">
                  <h1 className="text-xl font-semibold font-inter">
                    Information about passenger:
                  </h1>
                  <h3>
                    <strong>First name</strong>: {selectedBooking.name}
                  </h3>
                  <h3>
                    <strong>Last name</strong>: {selectedBooking.lastName}
                  </h3>
                  <h3>
                    <strong>Phone number</strong>: {selectedBooking.phoneNumber}
                  </h3>
                  <h3>
                    <strong>Department</strong>: {selectedBooking.department}
                  </h3>
                </div>
                <div className="flex flex-col gap-2 mt-7">
                  <h1 className="text-xl font-semibold font-inter">
                    Information about booking:
                  </h1>
                  <h3>
                    <strong>Time Created</strong>: {selectedBooking.timeCreated}
                  </h3>
                  <h3>
                    <strong>From</strong>: {selectedBooking.from.name}
                  </h3>
                  <h3>
                    <strong>Coordinates</strong>:{" "}
                    {selectedBooking.from.latitude},{" "}
                    {selectedBooking.from.longitude}
                  </h3>
                  <h3>
                    <strong>To</strong>: {selectedBooking.to.name}
                  </h3>
                  <h3>
                    <strong>Coordinates</strong>: {selectedBooking.to.latitude},{" "}
                    {selectedBooking.to.longitude}
                  </h3>
                  <h3>
                    <strong>Status</strong>: {selectedBooking.bookingStatus}
                  </h3>
                </div>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleViewClose}
              sx={{
                mr: 4,
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
