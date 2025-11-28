"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, TableHead } from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import { BookingRecord } from "@/model/models";
import { cancelBooking, getUserBookingList } from "./requests";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import BookingPage from "../book/page";
import CustomizedButton from "@/components/CustomizedButton";
import { StyledTableCell } from "@/components/StyledTableCell";
import { Snackbar, Alert } from "@mui/material";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("login");
    }
    getUserBookingList(paginationMeta.page, paginationMeta.pageSize).then(
      (res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            console.log(data);
            setBookingListData(data.bookings);
            setIsLoading(false);
          });
        } else if (res.status === 201) {
          router.push("login");
        }
      }
    );

    // setBookingListData([{
    //   booking_id: 5,
    //   booking_status: "Pending",
    //   time_created: "2025-11-10T09:42:02.512Z",
    //   trip: {
    //     dropoff_latitude: 23,
    //     dropoff_location: "Physics Building",
    //     dropoff_longitude: 2,
    //     pickup_latitude: 34,
    //     pickup_location: "Queens building",
    //     pickup_longitude: 12,
    //     trip_id: 1
    //   }
    // }])
  }, []);

  const handleClick = () => {
    router.push("/book");
  };

  const [paginationMeta, setPaginationMeta] = useState({
    page: 0,
    pageSize: 10,
  });

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPaginationMeta({
      ...paginationMeta,
      page: newPage,
    });
  };

  const handleChangePageSize = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPaginationMeta({
      page: 0,
      pageSize: parseInt(event.target.value, 10),
    });
  };

  const [bookingListData, setBookingListData] = useState<BookingRecord[]>([]);

  // Cancel booking
  const [cancelBookDialogOpen, setCancelBookDialogOpen] = useState(false);
  const [toCancelBookingId, setToCancelBookingId] = useState<number>();

  const handleCancelBooking = (row: BookingRecord) => {
    console.log(row);
    setToCancelBookingId(row.booking_id);
    setCancelBookDialogOpen(true);
  };

  const handleCancelDialogClose = () => {
    setCancelBookDialogOpen(false);
    setToCancelBookingId(undefined);
  };

  const handleConfirmCancel = () => {
    console.log(toCancelBookingId);
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
          })
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

  return (
    <div className="flex justify-center font-inter p-4">
      <div className="bg-white shadow-lg/20 rounded-lg p-6 md:p-8 w-full max-w-6xl my-15 mt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-aleo text-2xl sm:text-3xl font-semibold text-shadow-lg/20">
            MY BOOKINGS
          </h1>
          <button
            onClick={handleClick}
            className="bg-[#2c2c2c] text-white py-2 px-6 rounded-md hover:bg-[#474747] hover:scale-101 transition-all duration-200 text-sm font-light cursor-pointer"
          >
            + New Booking
          </button>
        </div>

        {isLoading ? (
          <Typography sx={{ color: "gray", fontSize: 16, textAlign: "center" }}>
            Getting your bookings...
          </Typography>
        ) : bookingListData.length === 0 ? (
          <Typography sx={{ color: "gray", fontSize: 16, textAlign: "center" }}>
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
                        {row.trip.pickup_location}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.trip.dropoff_location}
                      </StyledTableCell>
                      <StyledTableCell>
                        <span
                          className={`inline-block px-5 py-1 rounded-full text-xs font-medium ${
                            row.booking_status === "Approved"
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
                            type="primary"
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

        <Dialog
          onClose={handleViewDialogClose}
          aria-labelledby="customized-dialog-title"
          open={bookDetailDialogOpen}
        >
          <DialogTitle
            sx={{
              m: 0,
              p: 2,
              fontFamily: "aleo",
              fontWeight: "bold",
              bgcolor: "#2c2c2c",
              color: "white",
              textAlign: "center",
              fontSize: 28,
            }}
            id="customized-dialog-title"
          >
            Booking Detail
            <FindInPageIcon
              sx={{ fontSize: 35, mb: 1, ml: 1, mr: -1 }}
            ></FindInPageIcon>
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleViewDialogClose}
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
                {bookDetail?.time_created
                  ? new Date(bookDetail?.time_created).toLocaleString()
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
                {bookDetail?.trip.pickup_location}
              </Typography>
            </Stack>
            {bookDetail?.trip.via && (
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
                <Typography gutterBottom>{bookDetail?.trip.via}</Typography>
              </Stack>
            )}
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
                {bookDetail?.trip.dropoff_location}
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
              <Chip
                size="small"
                color={`${
                  bookDetail?.booking_status === "Approved"
                    ? "success"
                    : bookDetail?.booking_status === "Pending"
                    ? "warning"
                    : bookDetail?.booking_status === "Cancelled"
                    ? "default"
                    : "error"
                }`}
                label={bookDetail?.booking_status}
              />
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
                {bookDetail?.trip.passenger_num}
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
                {bookDetail?.trip.pickup_time
                  ? new Date(bookDetail?.trip.pickup_time).toLocaleString()
                  : ""}
              </Typography>
            </Stack>
            {bookDetail?.trip.return_drop_loc && (
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
                  {bookDetail?.trip.return_drop_loc}
                </Typography>
              </Stack>
            )}
            {bookDetail?.trip.PO && (
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "400px",
                }}
              >
                <Typography gutterBottom sx={{ fontWeight: "bold" }}>
                  PO number:
                </Typography>
                <Typography gutterBottom>{bookDetail?.trip.PO}</Typography>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              sx={{
                color: "#2c2c2c",
                mr: 1,
                transition: "all 250ms",
                ":hover": { bgcolor: "#2c2c2c", color: "white" },
              }}
              onClick={handleViewDialogClose}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
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
        <Dialog
          onClose={handleCancelDialogClose}
          aria-labelledby="customized-dialog-title"
          open={cancelBookDialogOpen}
          maxWidth="md"
        >
          <DialogTitle
            sx={{
              m: 0,
              p: 2,
              fontFamily: "aleo",
              fontWeight: "bold",
              bgcolor: "#2c2c2c",
              color: "white",
              textAlign: "center",
              fontSize: 28,
            }}
            id="customized-dialog-title"
          >
            Cancel Booking
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCancelDialogClose}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers sx={{fontFamily: "inter"}}>
            Are you sure you want to cancel this booking?
          </DialogContent>
          <DialogActions>
            <Button
              sx={{
                color: "#2c2c2c",
                transition: "all 300ms",
                ":hover": { bgcolor: "#2c2c2c", color: "white" },
              }}
              onClick={handleCancelDialogClose}
            >
              Close
            </Button>
            <Button
              sx={{
                color: "#2c2c2c",
                transition: "all 300ms",
                mr: 1,
                ":hover": { bgcolor: "#2c2c2c", color: "white" },
              }}
              onClick={handleConfirmCancel}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <div className="flex justify-center mt-4">
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
            count={bookingListData.length}
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
