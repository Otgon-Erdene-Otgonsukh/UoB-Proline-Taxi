"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, TableHead } from "@mui/material";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { BookingRecord } from "@/model/models";
import { cancelBooking, getUserBookingList } from "./requests";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import BookingPage from "../book/page";
import CustomizedButton from "@/components/CustomizedButton";
import { StyledTableCell } from "@/components/StyledTableCell";
import { Snackbar, Alert } from "@mui/material";
import ConfirmDialog from "@/components/confirmDIalog";
import ViewDialog from "./components/viewDialog";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { bookingStatus } from "./constants";
import { TablePaginationActions } from "@/components/paginationActions";
import { motion } from "framer-motion";
import Image from "next/image";

const Page = () => {
  // Get NextAuth Session.
  const { status, data } = useSession();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [paginationMeta, setPaginationMeta] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    _getBookingListData(0, 10);
  }, [status, router]);

  const handleClick = () => {
    router.push("/book");
  };

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
    const newPageSize = parseInt(event.target.value, 10);
    setPaginationMeta({
      page: 0,
      pageSize: newPageSize,
    });
    _getBookingListData(0, newPageSize);
  };

  const [bookingListData, setBookingListData] = useState<BookingRecord[]>([]);
  const [bookingListCount, setBookingListCount] = useState(0);

  // Cancel booking
  const [cancelBookDialogOpen, setCancelBookDialogOpen] = useState(false);
  const [toCancelBookingId, setToCancelBookingId] = useState<number>();

  const handleCancelBooking = (row: BookingRecord) => {
    setToCancelBookingId(row.booking_id);
    setCancelBookDialogOpen(true);
  };

  const handleCancelDialogClose = () => {
    setCancelBookDialogOpen(false);
    setToCancelBookingId(undefined);
  };

  const handleConfirmCancel = () => {
    cancelBooking(toCancelBookingId!).then((res) => {
      setCancelBookDialogOpen(false);
      if (res.status === 200) {
        setSnackbarState({
          open: true,
          status: "success",
          message: "Successfully Cancelled!",
        });
        setBookingListData(
          bookingListData.map((ele) => {
            if (ele.booking_id === toCancelBookingId) {
              ele.booking_status = "Cancelled";
            }
            return ele;
          }),
        );
      } else {
        setSnackbarState({
          open: true,
          status: "error",
          message: "Cancel failed, please try again later!",
        });
      }
    });
  };

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    status: "success",
    message: "",
  });

  const handleCloseSnackbarState = () => {
    setSnackbarState({
      ...snackbarState,
      open: false,
    });
  };

  // View Dialog
  const [bookDetailDialogOpen, setBookDetailDialogOpen] = useState(false);
  const [bookDetail, setBookDetail] = useState<BookingRecord>();

  const handleViewDialogOpen = (data: BookingRecord) => {
    setBookDetail(data);
    setBookDetailDialogOpen(true);
  };
  const handleViewDialogClose = () => {
    setBookDetailDialogOpen(false);
  };

  // Edit Dialog
  const [editBookDialogOpen, setEditBookDialogOpen] = useState(false);
  const handleEditDialogOpen = (data: BookingRecord) => {
    setBookDetail(data);
    setEditBookDialogOpen(true);
  };
  const handleEditDialogClose = () => {
    setEditBookDialogOpen(false);
  };

  // Search form state
  type SearchFormProps = {
    pickUpTimeFrom?: string;
    pickUpTimeTo?: string;
    from?: string;
    to?: string;
    bookingStatus?: string;
  };
  const [searchFormInput, setSearchFormInput] = useState<SearchFormProps>({
    pickUpTimeFrom: "",
    pickUpTimeTo: "",
    from: "",
    to: "",
    bookingStatus: "All",
  });

  const handleSubmitSearchForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(searchFormInput);
    setIsLoading(true);
    setPaginationMeta({
      page: 0,
      pageSize: paginationMeta.pageSize,
    })
    _getBookingListData(0, paginationMeta.pageSize);
  };

  const _getBookingListData = (page: number, pageSize: number) => {
    getUserBookingList(page, pageSize, {
      ...searchFormInput,
      bookingStatus:
        searchFormInput?.bookingStatus === "All"
          ? ""
          : searchFormInput?.bookingStatus,
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setBookingListData(data.bookings);
          setBookingListCount(data.totalNum);
          setIsLoading(false);
        });
      }
    });
  };

  // Do nothing if we get a status. Await for this check to be carried out in useEffect.
  if (status === "loading" || status === "unauthenticated") {
    return null;
  }

  return (
    <div className="flex flex-col items-center font-inter p-4">
      <motion.div
        className="text-[32px] mt-5 font-bold font-aleo text-center text-shadow-md/10"
        initial={{ opacity: 0, y: 6, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Welcome, {data?.user.name}!
        <p className="text-gray-600 text-lg font-normal">To Your Booking Space</p>
      </motion.div>
      <div className="flex mt-7 gap-10 max-w-6xl">
        <motion.div
          className="bg-white flex items-center rounded-lg overflow-hidden px-4 text-gray-800 border-l-6 border-l-yellow-500 drop-shadow-md/20 cursor-pointer"
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.24 }}
          whileHover={{
            y: -6,
            boxShadow: "0 20px 30px rgba(15, 23, 42, 0.12)",
            transition: { duration: 0.18, ease: "easeOut" },
          }}
        >
          <Image
            src="/book.jpg"
            width={150}
            height={120}
            alt="person booking a taxi"
          ></Image>
          <p className="px-2 py-7 text-sm leading-snug max-w-[220px]">
            <strong>Book</strong> a luxurious chauffeur service from any
            destination in <strong>Bristol</strong>.
          </p>
        </motion.div>
        <motion.div
          className="bg-white flex items-center rounded-lg overflow-hidden px-4 text-gray-800 border-l-6 border-l-gray-500 drop-shadow-md/20 cursor-pointer"
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.48 }}
          whileHover={{
            y: -6,
            boxShadow: "0 20px 30px rgba(15, 23, 42, 0.12)",
            transition: { duration: 0.18, ease: "easeOut" },
          }}
        >
          <Image
            src="/status.png"
            width={110}
            height={120}
            alt="check status"
            className="drop-shadow-lg/20"
          ></Image>
          <p className="px-4 py-6 text-sm leading-snug max-w-[220px]">
            <strong>Track</strong> the status of your bookings and{" "}
            <strong>receive email</strong> updates.
          </p>
        </motion.div>
        <motion.div
          className="bg-white flex items-center rounded-lg overflow-hidden px-4 text-gray-800 border-l-6 border-l-pink-300 drop-shadow-md/20 cursor-pointer"
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.72 }}
          whileHover={{
            y: -6,
            boxShadow: "0 20px 30px rgba(15, 23, 42, 0.12)",
            transition: { duration: 0.18, ease: "easeOut" },
          }}
        >
          <Image
            src="/check.jpg"
            width={110}
            height={120}
            alt="view booking details"
          ></Image>
          <p className="px-2 pl-3 py-6 text-sm leading-snug max-w-[220px]">
            <strong>View</strong> full booking details, and{" "}
            <strong>cancel</strong> or <strong>edit</strong> them anytime as
            needed.
          </p>
        </motion.div>
      </div>
      <motion.div
        className="bg-white shadow-lg/20 rounded-lg p-6 md:p-8 w-full max-w-6xl my-15 mt-13"
        initial={{ opacity: 0, y: 6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
      >
        <div className="flex justify-between mb-6">
          <h1 className="font-aleo text-2xl sm:text-3xl font-semibold text-shadow-lg/20">
            MY BOOKINGS
          </h1>
          <CustomizedButton
            title="+ New Booking"
            type="warning"
            click={handleClick}
          />
        </div>

        <Box
          component="form"
          onSubmit={handleSubmitSearchForm}
          sx={{
            display: "flex",
            gap: 2.5,
            marginBottom: 3,
          }}
        >
          <TextField
            fullWidth
            label="From"
            id="searchFromInput"
            value={searchFormInput.from}
            onChange={(e) => {
              setSearchFormInput({ ...searchFormInput, from: e.target.value });
            }}
            size="small"
            sx={{ minWidth: 150 }}
          />
          <TextField
            fullWidth
            label="To"
            id="searchToInput"
            value={searchFormInput.to}
            onChange={(e) => {
              setSearchFormInput({ ...searchFormInput, to: e.target.value });
            }}
            size="small"
            sx={{ minWidth: 150 }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="searchBookingStatusInputLabel" size="small">
              Booking Status
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              label="Booking Status"
              id="searchBookingStatusInput"
              value={searchFormInput.bookingStatus}
              onChange={(e) => {
                setSearchFormInput({
                  ...searchFormInput,
                  bookingStatus: e.target.value,
                });
              }}
              size="small"
            >
              <MenuItem value={"All"} key={"All"}>
                All
              </MenuItem>
              {bookingStatus.map((e) => {
                return (
                  <MenuItem value={e} key={e}>
                    {e}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <CustomizedButton title="Search" type="warning" click={() => { }} />
        </Box>

        {isLoading ? (
          <Typography
            sx={{ color: "gray", fontSize: 16, textAlign: "center", my: 10 }}
          >
            Getting your bookings...
          </Typography>
        ) : bookingListData.length === 0 ? (
          <Typography
            sx={{ color: "gray", fontSize: 16, textAlign: "center", my: 10 }}
          >
            No bookings to show.
          </Typography>
        ) : (
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
                  <StyledTableCell>Booking Status</StyledTableCell>
                  <StyledTableCell>Operation</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookingListData &&
                  bookingListData.map((row, index) => (
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
                        <span
                          className={`inline-block px-5 py-1 rounded-full text-xs font-medium ${row.booking_status === "Approved"
                              ? "bg-green-100 text-green-800 border border-green-800"
                              : row.booking_status === "Rejected"
                                ? "bg-red-100 text-red-800 border border-red-800"
                                : row.booking_status === "Cancelled"
                                  ? "bg-gray-300 text-gray-900 border border-gray-900"
                                  : "bg-yellow-100 text-yellow-800 border border-yellow-800"
                            }`}
                        >
                          {row.booking_status}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell>
                        <div className="flex gap-2 justify-center">
                          <CustomizedButton
                            click={() => handleViewDialogOpen(row)}
                            type="warning"
                            title="View"
                          />
                          {row.booking_status === "Pending" && (
                            <CustomizedButton
                              click={() => handleEditDialogOpen(row)}
                              type="warning"
                              title="Edit"
                            />
                          )}
                          {row.booking_status === "Pending" && (
                            <CustomizedButton
                              click={() => handleCancelBooking(row)}
                              type="error"
                              title="Cancel"
                            />
                          )}
                        </div>
                      </StyledTableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <ViewDialog
          viewData={bookDetail!}
          dialogOpen={bookDetailDialogOpen}
          handleDialogClose={handleViewDialogClose}
        />
        <Dialog
          onClose={handleEditDialogClose}
          aria-labelledby="customized-dialog-title"
          open={editBookDialogOpen}
          maxWidth="md"
        >
          <DialogTitle
            sx={{
              m: 0,
              p: 2,
              fontFamily: "inter",
              fontWeight: "bold",
              bgcolor: "#2c2c2c",
              color: "white",
              textAlign: "center",
              fontSize: 28,
            }}
            id="customized-dialog-title"
          >
            Edit Booking
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleEditDialogClose}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <BookingPage />
          </DialogContent>
          <DialogActions>
            <Button
              sx={{
                color: "#2c2c2c",
                transition: "all 300ms",
                mr: 1,
                ":hover": { bgcolor: "#2c2c2c", color: "white" },
              }}
              onClick={handleCancelDialogClose}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <ConfirmDialog
          open={cancelBookDialogOpen}
          dialogTitle="Cancel Booking"
          confirmMessage="Are you sure you want to cancel this booking?"
          confirmCallBack={handleConfirmCancel}
          cancelCallBack={handleCancelDialogClose}
        />
        <div className="flex justify-center mt-4">
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
            count={bookingListCount}
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
      </motion.div>
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbarState.open}
        onClose={handleCloseSnackbarState}
      >
        <Alert
          onClose={handleCloseSnackbarState}
          severity={snackbarState.status === "success" ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Page;
