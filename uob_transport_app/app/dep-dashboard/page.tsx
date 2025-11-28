"use client";

import { useState, useEffect } from "react";
import SearchAppBar from "@/components/SearchBar";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  createTheme,
  ThemeProvider,
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
  const [search, setSearch] = useState("");
  const [noMatchingResult, setNoMatchingResult] = useState(false);
  const [searchType, setSearchType] = useState("");
  const [selectedBooking, setSelectedBooking] =
    useState<BookingWithTrip | null>(null);

  const inputTheme = createTheme({
    //creating a custom theme outside the component
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "0.375rem", // rounded
            fontSize: "0.875rem", // text-sm
            color: "#111827", // gray-900 text color
            "& fieldset": {
              borderWidth: "2px",
              borderColor: "#111827",
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#111827", // gray-900 when select is focused
              borderWidth: "2px",
            },
          },
        },
      },
      MuiInputLabel: {
        //input label handling(default is blue)
        styleOverrides: {
          root: {
            fontSize: "0.875rem",
            color: "#111827",
            "&.Mui-focused": {
              color: "#111827",
            },
          },
        },
      },
    },
  });

  useEffect(() => {
    fetch("api/get_pending_bookings")
      .then((res) => res.json())
      .then((data) => {
        setPendingBookings(data);
        setIsLoading(false);
      });
  }, []);

  // Filter bookings based on search
  const filteredBookings = pendingBookings.filter((e) => {
    if (searchType === "Phone number") {
      return e.tel_number?.startsWith(search);
    } else if (searchType === "Email") {
      return e.email?.toLowerCase().includes(search.toLowerCase());
    } else if (searchType === "Passengers") {
      return search === "" ? e : e.trip.passenger_num === Number(search);
    } else if (searchType === "Location") {
      return (
        e.trip.pickup_location
          ?.toLowerCase()
          .startsWith(search.toLowerCase()) ||
        e.trip.dropoff_location
          ?.toLowerCase()
          .startsWith(search.toLowerCase()) ||
        e.trip.via?.toLowerCase().startsWith(search.toLowerCase()) ||
        e.trip.return_drop_loc?.toLowerCase().startsWith(search.toLowerCase())
      );
    } else {
      return (
        e.first_name?.toLowerCase().startsWith(search.toLowerCase()) ||
        e.surname?.toLowerCase().startsWith(search.toLowerCase())
      );
    }
  });

  // Update noMatchingResult based on filtered results
  useEffect(() => {
    setNoMatchingResult(filteredBookings.length === 0 && search !== "");
  }, [search]);

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
    <div className="flex min-h-screen justify-center pt-24 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 w-full max-w-6xl mb-8 h-fit">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-aleo md:text-3xl font-semibold text-shadow-lg/20">
            Department Bookings
          </h1>
          <div className="flex gap-4">
            <ThemeProvider theme={inputTheme}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Search By</InputLabel>
                <Select
                  label="Search By"
                  id="searchType"
                  defaultValue=""
                  onChange={(e) => {
                    setSearchType(e.target.value);
                  }}
                >
                  <MenuItem key="0" value="Email">
                    Email
                  </MenuItem>
                  <MenuItem key="1" value="Phone number">
                    Phone number
                  </MenuItem>
                  <MenuItem key="2" value="Location">
                    Location
                  </MenuItem>
                  <MenuItem key="3" value="Passengers">
                    Passenger count
                  </MenuItem>
                  <MenuItem key="4" value="Name">
                    Passenger name
                  </MenuItem>
                </Select>
              </FormControl>
            </ThemeProvider>
            <SearchAppBar
              onChange={(e) => {
                setSearch(e);
              }}
            ></SearchAppBar>
          </div>
        </div>
        {pendingBookings.length === 0 || noMatchingResult ? (
          <div className="text-center py-15 font-inter text-gray-400">
            {isLoading
              ? "Loading..."
              : noMatchingResult
              ? "No matching booking."
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
                {filteredBookings.map((e) => {
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
          <DialogContent dividers>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "400px",
              }}
            >
              <Typography
                gutterBottom
                sx={{ fontWeight: "bold", fontSize: 20 }}
              >
                Information about passenger:
              </Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "400px",
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: "bold" }}>
                First name:
              </Typography>
              <Typography gutterBottom>
                {selectedBooking?.first_name}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "400px",
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: "bold" }}>
                Last name:
              </Typography>
              <Typography gutterBottom>{selectedBooking?.surname}</Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "400px",
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: "bold" }}>
                Phone number:
              </Typography>
              <Typography gutterBottom>
                {selectedBooking?.tel_number}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "400px",
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: "bold" }}>
                Email:
              </Typography>
              <Typography gutterBottom>{selectedBooking?.email}</Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "400px",
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: "bold" }}>
                Department:
              </Typography>
              <Typography gutterBottom>
                {selectedBooking?.department}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "400px",
                mt: 4,
              }}
            >
              <Typography
                gutterBottom
                sx={{ fontWeight: "bold", fontSize: 19 }}
              >
                Information about booking:
              </Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "400px",
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: "bold" }}>
                Time Created:
              </Typography>
              <Typography gutterBottom>
                {selectedBooking?.time_created
                  ? new Date(selectedBooking?.time_created).toLocaleString()
                  : ""}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "400px",
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: "bold" }}>
                From:
              </Typography>
              <Typography gutterBottom>
                {selectedBooking?.trip.pickup_location}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "400px",
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: "bold" }}>
                Via:
              </Typography>
              <Typography gutterBottom>{selectedBooking?.trip.via}</Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "400px",
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: "bold" }}>
                To:
              </Typography>
              <Typography gutterBottom>
                {selectedBooking?.trip.dropoff_location}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "400px",
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: "bold" }}>
                Booking Status:
              </Typography>
              {selectedBooking?.booking_status === "Approved" ? (
                <span className="inline-block px-10 py-[3px] rounded-full text-xs font-medium border border-green-800 bg-green-200 text-green-800">
                  Approved
                </span>
              ) : selectedBooking?.booking_status === "Rejected" ? (
                <span className="inline-block px-10 py-[3px] rounded-full text-xs font-medium border border-red-800 bg-red-200 text-red-800">
                  Rejected
                </span>
              ) : (
                <span className="inline-block px-10 py-[3px] rounded-full text-xs font-medium border border-yellow-800 bg-yellow-200 text-yellow-800">
                  Pending
                </span>
              )}
            </Stack>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "400px",
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: "bold" }}>
                Passenger Number:
              </Typography>
              <Typography gutterBottom>
                {selectedBooking?.trip.passenger_num}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "400px",
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: "bold" }}>
                Pick Up Time:
              </Typography>
              <Typography gutterBottom>
                {selectedBooking?.trip.pickup_time
                  ? new Date(selectedBooking?.trip.pickup_time).toLocaleString()
                  : ""}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "400px",
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: "bold" }}>
                Return Drop-off Location:
              </Typography>
              <Typography gutterBottom>
                {selectedBooking?.trip.return_drop_loc}
              </Typography>
            </Stack>
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
