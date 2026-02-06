"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NumbersIcon from "@mui/icons-material/Numbers";
import ReceiptIcon from "@mui/icons-material/Receipt";
import InfoIcon from "@mui/icons-material/Info";
import HailIcon from "@mui/icons-material/Hail";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningIcon from "@mui/icons-material/Warning";
import { motion } from "framer-motion";
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
  CircularProgress,
  Chip,
} from "@mui/material";
import { StyledTableCell } from "@/components/StyledTableCell";
import CustomizedButton from "@/components/CustomizedButton";
import { getPendingBookingList } from "./requests";
import { TablePaginationActions } from "@/components/paginationActions";
import ViewDialog from "./components/viewDialog";
import CustomSwitch from "@/components/CustomSwitch";
import type { BookingWithTrip, BookingData } from "./constants";

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
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [cardLoading, setCardLoading] = useState(true);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectId, setRejectId] = useState(-1);
  const [totalApplied, setTotalApplied] = useState(false);
  const [statusApplied, setStatusApplied] = useState(false);
  const [overdueApplied, setOverdueApplied] = useState(false);
  const [hovered, setHovered] = useState({
    total: false,
    status: false,
    overdue: false,
  });
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
    _getBookingListData(0, paginationMeta.pageSize);
  }, []);

  useEffect(() => {
    fetch("api/booking-data", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setBookingData(data);
        setCardLoading(false);
      });
  }, []);

  // pagination
  const [paginationMeta, setPaginationMeta] = useState({
    page: 0,
    pageSize: 10,
  });
  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setIsLoading(true);
    setPaginationMeta({
      ...paginationMeta,
      page: newPage,
    });
    _getBookingListData(newPage, paginationMeta.pageSize);
  };
  const handleChangePageSize = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setIsLoading(true);
    setPaginationMeta({
      page: 0,
      pageSize: parseInt(event.target.value, 10),
    });
    _getBookingListData(0, parseInt(event.target.value, 10));
  };

  // booking data
  const [pendingBookings, setPendingBookings] = useState<BookingWithTrip[]>([]);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
  // search form
  type SearchFormProps = {
    passengerName?: string;
    from?: string;
    to?: string;
    isFlight: boolean;
  };
  const [searchFormInput, setSearchFormInput] = useState<SearchFormProps>({
    passengerName: "",
    from: "",
    to: "",
    isFlight: false,
  });
  const handleSubmitSearchForm = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submit");
    setIsLoading(true);
    setPaginationMeta({
      page: 0,
      pageSize: paginationMeta.pageSize,
    });
    _getBookingListData(0, paginationMeta.pageSize);
  };

  useEffect(() => {
    setIsLoading(true);
    setPaginationMeta({
      page: 0,
      pageSize: paginationMeta.pageSize,
    });
    _getBookingListData(0, paginationMeta.pageSize);
  }, [totalApplied, statusApplied, overdueApplied])

  const _getBookingListData = (page: number, pageSize: number) => {
    // fetch data with current paginationMeta and searchParams
    getPendingBookingList(page, pageSize, {
      from: searchFormInput.from,
      to: searchFormInput.to,
      passengerName: searchFormInput.passengerName,
      isFlight: searchFormInput.isFlight,
      total: totalApplied,
      status: statusApplied,
      overdue: overdueApplied,
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setPendingBookings(data.pendingBookings);
          setPendingBookingsCount(data.totalNum);
          setIsLoading(false);
        });
      }
    });
  };

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
              : b,
          ),
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
        b.booking_id === bookingId ? { ...b, booking_status: "Rejected" } : b,
      ),
    );
    fetch("api/update_booking", {
      method: "POST",
      body: JSON.stringify({ bookingId: bookingId, newStatus: "Rejected" }),
    });
  };

  return (
    <div className="flex flex-col min-h-screen items-center pt-15 p-4">
      <div className="flex gap-20 mb-5">
        <div className="flex flex-col gap-3 items-center">
          <motion.div
            className="flex bg-white rounded-lg overflow-hidden drop-shadow-blue-600 drop-shadow-lg/30 cursor-pointer border-r-4 border-r-blue-500"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0 }}
            whileHover={{
              y: -4,
              transition: { duration: 0.12, ease: "easeOut" },
            }}
            onMouseEnter={() => setHovered({ ...hovered, total: true })}
            onMouseLeave={() => setHovered({ ...hovered, total: false })}
            onClick={() => {setTotalApplied((prev) => !prev); setStatusApplied(false); setOverdueApplied(false)}}
          >
            <div className="bg-gradient-to-br from-blue-300 via-blue-500 to-blue-700 rounded-lg p-2">
              <HailIcon sx={{ color: "white", fontSize: 80 }} />
            </div>
            <motion.div
              className="flex flex-col items-end px-5 py-3 justify-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.08 }}
            >
              {cardLoading ? (
                <CircularProgress color="inherit" size={30} />
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-blue-600">
                    {bookingData?.total && bookingData.total}
                  </h1>
                  <p className="text-gray-600">Total Bookings</p>
                </>
              )}
            </motion.div>
          </motion.div>
          <p
            className={`text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded mt-2 border border-blue-200 transition-opacity ease-in-out duration-200 ${hovered.total || totalApplied ? "opacity-100" : "opacity-0"}`}
          >
            {totalApplied ? (
              <Button sx={{ fontSize: 12, fontWeight: "bold", maxHeight: 20, textTransform: "none" }} onClick={() => setTotalApplied(false)}>
                <CancelIcon sx={{ fontSize: 17, mr: 1 }} /> Clear filter
              </Button>
            ) : (
              "🔍 Click to filter"
            )}
          </p>
        </div>
        <div className="flex flex-col gap-3 items-center">
          <motion.div
            className="flex bg-white rounded-lg overflow-hidden drop-shadow-yellow-600 drop-shadow-lg/30 cursor-pointer border-r-4 border-r-yellow-500"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.24 }}
            whileHover={{
              y: -4,
              transition: { duration: 0.12, ease: "easeOut" },
            }}
            onMouseEnter={() => setHovered({ ...hovered, status: true })}
            onMouseLeave={() => setHovered({ ...hovered, status: false })}
            onClick={() => {setStatusApplied((prev) => !prev); setTotalApplied(false); setOverdueApplied(false)}}
          >
            <div className="bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-700 rounded-lg p-2 py-[13px] flex justify-center items-center">
              <InfoIcon sx={{ color: "white", fontSize: 70 }} />
            </div>
            <motion.div
              className="flex flex-col items-end pl-8 pr-5 py-1 justify-center text-gray-600 text-[15px]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.32 }}
            >
              {cardLoading ? (
                <CircularProgress color="inherit" size={30} />
              ) : (
                <>
                  <div>
                    Pending:{" "}
                    <span className="text-yellow-500 font-bold">
                      {bookingData?.pending && bookingData.pending}
                    </span>
                  </div>
                  <div>
                    Approved:{" "}
                    <span className="text-green-500 font-bold">
                      {bookingData?.approved && bookingData.approved}
                    </span>
                  </div>
                  <div>
                    Rejected:{" "}
                    <span className="text-red-500 font-bold">
                      {bookingData?.rejected && bookingData.rejected}
                    </span>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
          <p
            className={`text-xs font-semibold text-yellow-700 bg-yellow-50 px-2 py-1 rounded mt-2 border border-yellow-300 transition-opacity ease-in-out duration-200 ${hovered.status || statusApplied ? "opacity-100" : "opacity-0"}`}
          >
            {statusApplied ? (
              <Button sx={{ fontSize: 12, fontWeight: "bold", maxHeight: 20, textTransform: "none", color: "#b7410e" }} onClick={() => setStatusApplied(false)}>
                <CancelIcon sx={{ fontSize: 17, mr: 1 }} /> Clear filter
              </Button>
            ) : (
              "🔍 Click to filter"
            )}
          </p>
        </div>
        <div className="flex flex-col gap-3 items-center">
          <motion.div
            className="flex bg-white rounded-lg overflow-hidden drop-shadow-red-600 drop-shadow-lg/30 cursor-pointer border-r-4 border-r-red-500"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.48 }}
            whileHover={{
              y: -4,
              transition: { duration: 0.12, ease: "easeOut" },
            }}
            onMouseEnter={() => setHovered({ ...hovered, overdue: true })}
            onMouseLeave={() => setHovered({ ...hovered, overdue: false })}
            onClick={() => {setOverdueApplied((prev) => !prev); setTotalApplied(false); setStatusApplied(false)}}
          >
            <div className="bg-gradient-to-br from-red-300 via-red-500 to-red-700 rounded-lg p-2 py-[13px] flex justify-center items-center">
              <AccessTimeIcon sx={{ color: "white", fontSize: 70 }} />
            </div>
            <motion.div
              className="flex flex-col items-end px-5 py-3 justify-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.56 }}
            >
              {cardLoading ? (
                <CircularProgress color="inherit" size={30} />
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-red-600">
                    {bookingData?.overdue && bookingData.overdue}
                  </h1>
                  <p className="text-gray-600 text-[15px]">Overdue Bookings</p>
                </>
              )}
            </motion.div>
          </motion.div>
          <p
            className={`text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded mt-2 border border-red-200 transition-opacity ease-in-out duration-200 ${hovered.overdue || overdueApplied ? "opacity-100" : "opacity-0"}`}
          >
            {overdueApplied ? (
              <Button sx={{ fontSize: 12, fontWeight: "bold", maxHeight: 20, textTransform: "none", color: "red" }} onClick={() => setOverdueApplied(false)}>
                <CancelIcon sx={{ fontSize: 17, mr: 1 }} /> Clear filter
              </Button>
            ) : (
              "🔍 Click to filter"
            )}
          </p>
        </div>
      </div>
      <motion.div
        className="bg-white shadow-lg rounded-lg p-6 md:p-8 w-full max-w-6xl mb-8 h-fit"
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.24 }}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-aleo md:text-3xl font-semibold text-shadow-lg/20">
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
                setSearchFormInput({
                  ...searchFormInput,
                  isFlight: !searchFormInput.isFlight,
                });
              }}
            ></CustomSwitch>
            <TextField
              fullWidth
              label="Passenger Name"
              id="passengerNameInput"
              value={searchFormInput.passengerName}
              onChange={(e) => {
                setSearchFormInput({
                  ...searchFormInput,
                  passengerName: e.target.value,
                });
              }}
              size="small"
              sx={{ minWidth: 150 }}
            />
            <TextField
              fullWidth
              label="From"
              id="fromInput"
              value={searchFormInput.from}
              onChange={(e) => {
                setSearchFormInput({
                  ...searchFormInput,
                  from: e.target.value,
                });
              }}
              size="small"
              sx={{ minWidth: 150 }}
            />
            <TextField
              fullWidth
              label="To"
              id="toInput"
              value={searchFormInput.to}
              onChange={(e) => {
                setSearchFormInput({ ...searchFormInput, to: e.target.value });
              }}
              size="small"
              sx={{ minWidth: 150 }}
            />
            <CustomizedButton title="Search" type="warning" click={() => {}} />
          </Box>
        </div>
        {isLoading ? (
          <Typography
            sx={{ color: "gray", fontSize: 16, textAlign: "center", my: 10 }}
          >
            Getting your bookings...
          </Typography>
        ) : pendingBookings && pendingBookings.length === 0 ? (
          <Typography
            sx={{ color: "gray", fontSize: 16, textAlign: "center", my: 10 }}
          >
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
                          <span>{row.first_name + " " + row.surname}</span>
                        </StyledTableCell>
                        <StyledTableCell>
                          <div className="flex gap-2 justify-center">
                            <CustomizedButton
                              click={() => handleViewOpen(row)}
                              type="warning"
                              title="View"
                            />
                            {(row.booking_status === "Pending" && (
                              <>
                                <CustomizedButton
                                  click={() => handleApprove(row.booking_id)}
                                  type="primary"
                                  title="Approve"
                                />
                                <CustomizedButton
                                  click={() => {setRejectId(row.booking_id); setRejectOpen(true)}}
                                  type="error"
                                  title="Reject"
                                />
                              </>
                            )) || (
                              <>
                                <Chip
                                  label={row.booking_status}
                                  sx={{
                                    bgcolor:
                                      row.booking_status === "Approved"
                                        ? "#86efac"
                                        : "#fca5a5",
                                    border: 2,
                                    borderColor:
                                      row.booking_status === "Approved"
                                        ? "#16a34a"
                                        : "#dc2626",
                                    px: 1,
                                  }}
                                />
                                {row.booking_status === "Approved" && (
                                  <Chip
                                    label={row.trip.PO}
                                    deleteIcon={<ReceiptIcon />}
                                    sx={{
                                      px: 1,
                                      border: 2,
                                      borderColor: "gray",
                                    }}
                                  ></Chip>
                                )}
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
        <Dialog open={rejectOpen} onClose={() => {setRejectOpen(false)}}>
          <DialogTitle
            sx={{
              color: "white",
              textAlign: "center",
              fontSize: 24,
              fontWeight: "bold",
              bgcolor: "#dc2626",
              fontFamily: "aleo",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <WarningIcon sx={{ fontSize: 28 }} />
            Confirm Rejection
          </DialogTitle>
          <DialogContent sx={{ mt: 3, mb: 2 }}>
            <DialogContentText
              sx={{
                fontFamily: "inter",
                fontWeight: 500,
                maxWidth: 350,
                textAlign: "center",
                fontSize: 16,
                color: "#374151",
              }}
            >
              Are you sure you want to reject this booking? This action cannot
              be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{ pb: 2, px: 3, justifyContent: "center", gap: 1 }}
          >
            <Button
              variant="outlined"
              sx={{
                color: "#6b7280",
                borderColor: "#d1d5db",
                transition: "all ease 300ms",
                ":hover": {
                  bgcolor: "#f3f4f6",
                  borderColor: "#9ca3af",
                },
                textTransform: "none",
                px: 3,
              }}
              onClick={() => {setRejectOpen(false)}}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#dc2626",
                transition: "all 300ms",
                ":hover": {
                  bgcolor: "#b91c1c",
                },
                textTransform: "none",
                px: 3,
              }}
              onClick={() => {handleReject(rejectId); setRejectOpen(false)}}
            >
              Yes, reject
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </div>
  );
}
