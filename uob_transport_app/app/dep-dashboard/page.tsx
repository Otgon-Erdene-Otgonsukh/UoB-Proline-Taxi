"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NumbersIcon from "@mui/icons-material/Numbers";
import ReceiptIcon from "@mui/icons-material/Receipt";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  DialogContentText,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  TablePagination,
} from "@mui/material";
import { StyledTableCell } from "@/components/StyledTableCell";
import CustomizedButton from "@/components/CustomizedButton";
import { getPendingBookingList } from "./requests";
import { TablePaginationActions } from "@/components/paginationActions";
import ViewDialog from "./components/viewDialog";
import CustomSwitch from "@/components/CustomSwitch";
import type { BookingWithTrip } from "./constants";

export default function DepDashboard() {
  const [selectedBooking, setSelectedBooking] =
    useState<BookingWithTrip | null>(null);
  const [poDialog, setPoDialog] = useState(false);
  const [poNumber, setPoNumber] = useState("");
  const [poValidity, setPoValidity] = useState(false);
  const [poEmpty, setPoEmpty] = useState(false);
  const [poTooLong, setPoTooLong] = useState(false);
  const [pendingBookingId, setPendingBookingId] = useState<number | null>(null);
  const [snackBar, setSnackBar] = useState(false);

  const [isLoading, setIsLoading] = useState(true);


  // Get NextAuth Session.
  const { status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
  }, [status, router]);

  useEffect(() => {
    _getBookingListData()
  }, []);

  // pagination
  const [paginationMeta, setPaginationMeta] = useState({
    page: 0,
    pageSize: 10,
  });
  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setIsLoading(true);
    setPaginationMeta({
      ...paginationMeta,
      page: newPage,
    });
    _getBookingListData()
  };
  const handleChangePageSize = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setIsLoading(true);
    setPaginationMeta({
      page: 0,
      pageSize: parseInt(event.target.value, 10),
    });
    _getBookingListData()
  };

  // booking data
  const [pendingBookings, setPendingBookings] = useState<BookingWithTrip[]>([]);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
  // search form
  type SearchFormProps = {
    passengerName?: string,
    from?: string,
    to?: string,
    isFlight: boolean,
  }
  const [searchFormInput, setSearchFormInput] = useState<SearchFormProps>({
    passengerName: "",
    from: "",
    to: "",
    isFlight: false,
  })
  const handleSubmitSearchForm = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('submit');
    setIsLoading(true)
    _getBookingListData()
  }

  const _getBookingListData = () => {
    console.log(searchFormInput);

    // fetch data with current paginationMeta and searchParams
    getPendingBookingList(
      paginationMeta.page,
      paginationMeta.pageSize,
      {
        from: searchFormInput.from,
        to: searchFormInput.to,
        passengerName: searchFormInput.passengerName,
        isFlight: searchFormInput.isFlight,
      }
    )
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setPendingBookings(data.pendingBookings);
            setPendingBookingsCount(data.totalNum);
            setIsLoading(false);
          })
        }
      })
  }

  const handleViewOpen = (booking: BookingWithTrip) => {
    setSelectedBooking(booking);
  };

  const handleViewClose = () => {
    setSelectedBooking(null);
  };

  const handlePoClose = () => {
    setPoDialog(!poDialog);
  };

  const handlePoAttach = () => {
    if (poNumber.length === 0) {
      setPoValidity(true);
      setPoEmpty(true);
    } else if (poNumber.length > 30) {
      setPoValidity(true);
      setPoTooLong(true);
    } else {
      setPoValidity(false);
      setPoDialog(false);
      setSnackBar(true);

      // Complete the approval
      if (pendingBookingId !== null) {
        setPendingBookings((prev) =>
          prev.map((b) =>
            b.booking_id === pendingBookingId
              ? {
                ...b,
                booking_status: "Approved",
                trip: { ...b.trip, PO: poNumber },
              }
              : b
          )
        );
        fetch("api/update_booking", {
          method: "POST",
          body: JSON.stringify({
            bookingId: pendingBookingId,
            newStatus: "Approved",
            po: poNumber,
          }),
        });

        // Reset states
        setPendingBookingId(null);
        setPoNumber("");
      }
    }
  };

  const handleApprove = (bookingId: number) => {
    setPendingBookingId(bookingId);
    setPoDialog(true);
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
          <Box
            component="form"
            onSubmit={handleSubmitSearchForm}
            sx={{
              display: "flex",
              gap: 2.5,
            }}
          >
            <CustomSwitch
              onClick={() => {
                setSearchFormInput({ ...searchFormInput, isFlight: !searchFormInput.isFlight });
              }}
            ></CustomSwitch>
            <TextField
              fullWidth
              label="Passenger Name"
              id="passengerNameInput"
              value={searchFormInput.passengerName}
              onChange={(e) => { setSearchFormInput({ ...searchFormInput, passengerName: e.target.value }); }}
              size="small"
              sx={{ minWidth: 150 }}
            />
            <TextField
              fullWidth
              label="From"
              id="fromInput"
              value={searchFormInput.from}
              onChange={(e) => { setSearchFormInput({ ...searchFormInput, from: e.target.value }); }}
              size="small"
              sx={{ minWidth: 150 }}
            />
            <TextField
              fullWidth
              label="To"
              id="toInput"
              value={searchFormInput.to}
              onChange={(e) => { setSearchFormInput({ ...searchFormInput, to: e.target.value }); }}
              size="small"
              sx={{ minWidth: 150 }}
            />
            <CustomizedButton
              title="Search"
              type="primary"
              click={() => { }}
            />
          </Box>
        </div>
        {isLoading ? (
          <Typography sx={{ color: "gray", fontSize: 16, textAlign: "center" }}>
            Getting your bookings...
          </Typography>
        ) : pendingBookings && pendingBookings.length === 0 ? (
          <Typography sx={{ color: "gray", fontSize: 16, textAlign: "center" }}>
            No bookings to show.
          </Typography>
        ) : (
          <div className="mt-6">
            <TableContainer
              component={Paper}
              sx={{ boxShadow: "none", border: "none" }}
            >
              <Table
                sx={{ minWidth: 500, borderCollapse: "collapse" }}
                aria-label="custom pagination table"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Pick-up Time</StyledTableCell>
                    <StyledTableCell>From</StyledTableCell>
                    <StyledTableCell>To</StyledTableCell>
                    <StyledTableCell>Passenger Name</StyledTableCell>
                    <StyledTableCell>Operation</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingBookings &&
                    pendingBookings.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": { bgcolor: "#f9fafb" },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <StyledTableCell>
                          {row.trip.pickup_time
                            ? new Date(row.trip.pickup_time).toLocaleString()
                            : "N/A"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.trip.airport === "" || row.trip.airport === null
                            ? row.trip.pickup_location
                            : row.trip.airport}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.trip.dropoff_location}
                        </StyledTableCell>
                        <StyledTableCell>
                          <span>
                            {row.first_name + " " + row.surname}
                          </span>
                        </StyledTableCell>
                        <StyledTableCell>
                          <div className="flex gap-2 justify-center">
                            <CustomizedButton
                              click={() => handleViewOpen(row)}
                              type="primary"
                              title="View"
                            />
                            {row.booking_status === "Pending" && (
                              <>
                                <CustomizedButton
                                  click={() => handleApprove(row.booking_id)}
                                  type="primary"
                                  title="Approve"
                                />
                                <CustomizedButton
                                  click={() => handleReject(row.booking_id)}
                                  type="error"
                                  title="Cancel"
                                />
                              </>
                            )}
                          </div>
                        </StyledTableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="flex justify-center mt-4">
              <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                count={pendingBookingsCount}
                rowsPerPage={paginationMeta.pageSize}
                page={paginationMeta.page}
                slotProps={{
                  select: {
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangePageSize}
                ActionsComponent={TablePaginationActions}
              />
            </div>
          </div>
        )}
        <ViewDialog
          open={selectedBooking !== null}
          handleDialogClose={handleViewClose}
          viewData={selectedBooking!}
        />
        <Dialog open={poDialog} onClose={handlePoClose}>
          <DialogTitle
            sx={{
              color: "white",
              textAlign: "center",
              fontSize: 25,
              fontWeight: "bold",
              font: "aleo",
              bgcolor: "#2c2c2c",
              fontFamily: "aleo",
            }}
          >
            Attach PO number
            <ReceiptIcon sx={{ ml: 1, mr: -1 }}></ReceiptIcon>
          </DialogTitle>
          <DialogContent sx={{ mt: 3 }}>
            <DialogContentText
              sx={{
                fontFamily: "inter",
                fontWeight: "bold",
                maxWidth: 350,
                textAlign: "center",
                fontSize: 16,
              }}
            >
              Please enter the PO number below to approve the booking.
            </DialogContentText>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!poValidity) {
                  handlePoAttach();
                }
              }}
              id="poForm"
            >
              <TextField
                autoFocus
                margin="dense"
                id="po"
                name="po"
                label="PO number"
                type="text"
                fullWidth
                variant="standard"
                error={poValidity}
                helperText={
                  poEmpty
                    ? "Enter a PO number"
                    : poTooLong
                      ? "PO number is too long"
                      : ""
                }
                sx={{
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#2c2c2c",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#2c2c2c",
                  },
                }}
                onChange={(e) => {
                  setPoNumber(e.target.value);
                  setPoValidity(false);
                  setPoEmpty(false);
                  setPoTooLong(false);
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <NumbersIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              sx={{
                color: "#2c2c2c",
                transition: "all 300ms",
                ":hover": { bgcolor: "#2c2c2c", color: "white" },
              }}
              onClick={handlePoClose}
            >
              Close
            </Button>
            <Button
              type="submit"
              form="poForm"
              sx={{
                mr: 2,
                color: "#2c2c2c",
                transition: "all 300ms",
                ":hover": { bgcolor: "#2c2c2c", color: "white" },
              }}
            >
              Attach
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackBar}
          autoHideDuration={4000}
          onClose={() => {
            setSnackBar(!snackBar);
          }}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => {
              setSnackBar(!snackBar);
            }}
            severity="success"
            variant="filled"
          >
            PO number has been successfully attached!
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
